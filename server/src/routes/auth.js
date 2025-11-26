import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ethers } from 'ethers';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.js';
import { OTP } from '../models/otp.js';
import { SignupTemp } from '../models/signupTemp.js';
import { sendEmail, emailTemplates } from '../config/email.js';
import { config as appConfig } from '../config/index.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

function auth(req, res, next){
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if(!token) return res.status(401).json({ message: 'No token' });
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRole(roles){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// Signup - validate and send OTP (don't create user yet)
router.post('/signup', async (req,res)=>{
  try {
    const { email, password, firstName, lastName, confirmPassword } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Check if there's a pending signup OTP
    const existingOTP = await OTP.findOne({ email, purpose: 'signup' });
    if (existingOTP) {
      await OTP.deleteOne({ email, purpose: 'signup' });
    }

    // Generate and save OTP for signup verification
    const otp = generateOTP();
    await OTP.create({ email, otp, purpose: 'signup' });

    // Store signup data temporarily
    const passwordHash = await bcrypt.hash(password, 10);
    await SignupTemp.create({ email, passwordHash, firstName, lastName, otp });
    
    // Send verification email
    await sendEmail(email, emailTemplates.signupVerification(otp, firstName));
    
    res.status(200).json({ 
      message: 'Verification code sent to your email',
      email: email // Return email for client to use in verification
    });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
});

// Verify signup OTP and create user
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp, purpose: 'signup' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get temporary signup data
    const tempData = await SignupTemp.findOne({ email, otp });
    if (!tempData) {
      return res.status(400).json({ message: 'Signup data expired. Please sign up again.' });
    }

    // Check if user was created in the meantime
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ email, purpose: 'signup' });
      await SignupTemp.deleteOne({ email });
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email: tempData.email,
      passwordHash: tempData.passwordHash,
      firstName: tempData.firstName,
      lastName: tempData.lastName,
      emailVerified: true
    });

    // Clean up
    await OTP.deleteOne({ email, purpose: 'signup' });
    await SignupTemp.deleteOne({ email });

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, profileCompleted: user.profileCompleted },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send welcome email
    await sendEmail(email, emailTemplates.welcome(tempData.firstName));

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    });
  } catch (e) {
    console.error('Verify signup OTP error:', e);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// Login - verify credentials
router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user has password (not Google OAuth only)
    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Please sign in with Google' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, profileCompleted: user.profileCompleted },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      } 
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Wallet auth - request nonce
router.post('/wallet/request', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(normalizedAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }

    let user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      const placeholderEmail = `${normalizedAddress}@wallet.baseconnect`;
      user = await User.create({
        email: placeholderEmail,
        firstName: 'Wallet',
        lastName: 'User',
        walletAddress: normalizedAddress,
        emailVerified: true,
      });
    }

    user.walletNonce = generateNonce();
    await user.save();

    res.json({ nonce: user.walletNonce });
  } catch (error) {
    console.error('Wallet request error:', error);
    res.status(500).json({ message: 'Failed to initiate wallet authentication' });
  }
});

// Wallet auth - verify signature
router.post('/wallet/verify', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || !signature) {
      return res.status(400).json({ message: 'Wallet address and signature are required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user || !user.walletNonce) {
      return res.status(400).json({ message: 'Wallet authentication not initiated' });
    }

    const message = `BaseConnect authentication nonce: ${user.walletNonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature).toLowerCase();

    if (recoveredAddress !== normalizedAddress) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    user.walletNonce = null;
    user.emailVerified = true;
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role, profileCompleted: user.profileCompleted },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        walletAddress: user.walletAddress,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Wallet verify error:', error);
    res.status(500).json({ message: 'Wallet authentication failed' });
  }
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${appConfig.serverUrl}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.emailVerified = true;
      await user.save();
      return done(null, user);
    }

    // Create new user
    const nameParts = profile.displayName.split(' ');
    user = await User.create({
      email: profile.emails[0].value,
      googleId: profile.id,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      emailVerified: true
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${appConfig.clientUrl}/login?error=google_auth_failed` 
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, role: user.role, profileCompleted: user.profileCompleted },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${appConfig.clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${appConfig.clientUrl}/login?error=google_auth_failed`);
    }
  }
);

// Return current user
router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({ message: 'User not found' });
  res.json({ 
    id: user.id, 
    email: user.email, 
    role: user.role, 
    profileCompleted: user.profileCompleted, 
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    address: user.address,
    walletAddress: user.walletAddress,
    emailVerified: user.emailVerified,
    points: user.points || 0,
    activityLevel: user.activityLevel || 0,
    referralCount: user.referralCount || 0,
    profileSlug: user.profileSlug,
    professionalTitle: user.professionalTitle,
    profilePicture: user.profilePicture,
    skills: user.skills,
    linkedin: user.linkedin,
    github: user.github,
    website: user.website
  });
});

// Select role
router.post('/select-role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    if(!role || !['creator', 'contributor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection' });
    }

    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    const newToken = jwt.sign(
      { id: user.id, role: user.role, profileCompleted: user.profileCompleted },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Select role error:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// Complete profile
router.post('/profile', auth, async (req,res)=>{
  try {
    const { firstName, lastName, bio, address, walletAddress } = req.body;
    if(!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio;
    user.address = address;
    user.rating = user.rating || 0;

    if (walletAddress) {
      const normalizedAddress = walletAddress.toLowerCase();
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!walletRegex.test(normalizedAddress)) {
        return res.status(400).json({ message: 'Invalid wallet address' });
      }

      const existingWalletUser = await User.findOne({ walletAddress: normalizedAddress, _id: { $ne: user._id } });
      if (existingWalletUser) {
        return res.status(409).json({ message: 'Wallet address already in use' });
      }

      user.walletAddress = normalizedAddress;
    }

    user.profileCompleted = true;
    await user.save();

    const newToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        profileCompleted: user.profileCompleted 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token: newToken,
      user: {
        id: user.id, 
        email: user.email, 
        role: user.role, 
        profileCompleted: user.profileCompleted, 
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        address: user.address,
        walletAddress: user.walletAddress,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ message: 'Failed to complete profile' });
  }
});

// Complete creator-specific profile (stores same fields but ensures role=creator)
router.post('/creator-profile', auth, async (req,res)=>{
  try {
    const { 
      firstName, 
      lastName, 
      bio, 
      professionalTitle,
      profilePicture,
      skills,
      linkedin,
      github,
      website,
      address, 
      walletAddress 
    } = req.body;
    
    if(!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio;
    user.professionalTitle = professionalTitle;
    user.profilePicture = profilePicture;
    user.skills = skills || [];
    user.linkedin = linkedin;
    user.github = github;
    user.website = website;
    user.address = address;
    user.rating = user.rating || 0;

    // Generate unique slug from firstName + lastName + random suffix if not already set
    if (!user.profileSlug) {
      const baseSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/\s+/g, '-');
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      user.profileSlug = `${baseSlug}-${randomSuffix}`;
    }

    if (walletAddress) {
      const normalizedAddress = walletAddress.toLowerCase();
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!walletRegex.test(normalizedAddress)) {
        return res.status(400).json({ message: 'Invalid wallet address' });
      }

      const existingWalletUser = await User.findOne({ walletAddress: normalizedAddress, _id: { $ne: user._id } });
      if (existingWalletUser) {
        return res.status(409).json({ message: 'Wallet address already in use' });
      }

      user.walletAddress = normalizedAddress;
    }

    // mark as creator role and profile complete
    user.role = 'creator';
    user.profileCompleted = true;
    await user.save();

    const newToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        profileCompleted: user.profileCompleted 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    const profileUrl = `${appConfig.clientUrl}/profile/${user.profileSlug}`;

    res.json({ 
      token: newToken,
      user: {
        id: user.id, 
        email: user.email, 
        role: user.role, 
        profileCompleted: user.profileCompleted, 
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        address: user.address,
        walletAddress: user.walletAddress,
        rating: user.rating,
        profileSlug: user.profileSlug,
        profileUrl: profileUrl,
        professionalTitle: user.professionalTitle,
        profilePicture: user.profilePicture,
        skills: user.skills,
        linkedin: user.linkedin,
        github: user.github,
        website: user.website
      }
    });
  } catch (error) {
    console.error('Complete creator profile error:', error);
    res.status(500).json({ message: 'Failed to complete profile' });
  }
});

// Export helpers for server use will be at end after routes

// Get public profile by slug (shareable profile link)
router.get('/profile/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: 'Slug is required' });
    }

    const user = await User.findOne({ profileSlug: slug.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Return only public profile information
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      role: user.role,
      profileSlug: user.profileSlug,
      professionalTitle: user.professionalTitle,
      profilePicture: user.profilePicture,
      skills: user.skills,
      linkedin: user.linkedin,
      github: user.github,
      website: user.website,
      rating: user.rating,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Export helpers for server use will be at end after routes

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Check if user has password (not OAuth/wallet only)
    if (!user.passwordHash) {
      return res.status(400).json({ message: 'This account uses Google or wallet sign-in. Please use that method.' });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email, purpose: 'reset-password' });

    // Generate and save new OTP
    const otp = generateOTP();
    await OTP.create({ email, otp, purpose: 'reset-password' });

    // Send OTP email
    await sendEmail(email, emailTemplates.resetPassword(otp));

    res.json({ message: 'OTP sent to your email' });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP (for password reset)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp, purpose: 'reset-password' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (e) {
    console.error('Verify OTP error:', e);
    res.status(500).json({ message: 'OTP verification failed. Please try again.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    
    // Validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Password validation
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Confirm password validation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp, purpose: 'reset-password' });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete used OTP
    await OTP.deleteMany({ email, purpose: 'reset-password' });

    res.json({ message: 'Password reset successfully' });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ message: 'Password reset failed. Please try again.' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otpPurpose = purpose || 'reset-password';

    // For signup, check if there's a pending signup
    if (otpPurpose === 'signup') {
      const tempData = await SignupTemp.findOne({ email });
      if (!tempData) {
        return res.status(400).json({ message: 'No pending signup found. Please sign up again.' });
      }

      // Delete existing OTPs
      await OTP.deleteMany({ email, purpose: 'signup' });

      // Generate and save new OTP
      const otp = generateOTP();
      await OTP.create({ email, otp, purpose: 'signup' });
      tempData.otp = otp;
      await tempData.save();

      // Send OTP email
      await sendEmail(email, emailTemplates.signupVerification(otp, tempData.firstName));

      return res.json({ message: 'New verification code sent to your email' });
    }

    // For password reset
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ email, purpose: 'reset-password' });

    // Generate and save new OTP
    const otp = generateOTP();
    await OTP.create({ email, otp, purpose: 'reset-password' });

    // Send OTP email
    await sendEmail(email, emailTemplates.resetPassword(otp));

    res.json({ message: 'New OTP sent to your email' });
  } catch (e) {
    console.error('Resend OTP error:', e);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
});

// Export helpers for server use
export const authMiddleware = auth;
export const roleMiddleware = requireRole;
export default router;