import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.js';
import { OTP } from '../models/otp.js';
import { SignupTemp } from '../models/signupTemp.js';
import { sendEmail, emailTemplates } from '../config/email.js';

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

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/auth/google/callback`
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
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:8080'}/login?error=google_auth_failed` 
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
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8080'}/login?error=google_auth_failed`);
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
    bio: user.bio 
  });
});

// Profile setup - returns NEW TOKEN with updated role 
router.post('/profile', auth, async (req,res)=>{
  const { role, firstName, lastName, bio, address } = req.body;
  if(!role || ![ 'creator', 'contributor' ].includes(role)) return res.status(400).json({ message: 'invalid role' });
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({ message: 'User not found' });
  
  user.role = role;
  user.firstName = firstName;
  user.lastName = lastName;
  user.bio = bio;
  user.address = address;
  user.rating = 0;
  user.profileCompleted = true;
  
  await user.save();

  //  GENERATE NEW TOKEN with updated role
  const newToken = jwt.sign(
    { 
      id: user.id, 
      role: user.role, 
      profileCompleted: user.profileCompleted 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
  
  //  RETURN NEW TOKEN along with user data
  res.json({ 
    token: newToken,  // ← NEW TOKEN HERE
    user: {
      id: user.id, 
      email: user.email, 
      role: user.role, 
      profileCompleted: user.profileCompleted, 
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      address: user.address,
      rating: user.rating
    }
  });
});

// Export helpers for server use
export const authMiddleware = auth;
export const roleMiddleware = requireRole;
export default router;

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

    // Check if user has password (not Google OAuth only)
    if (!user.passwordHash) {
      return res.status(400).json({ message: 'This account uses Google sign-in. Please sign in with Google.' });
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