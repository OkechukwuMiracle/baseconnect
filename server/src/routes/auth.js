import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { OTP } from '../models/otp.js';
import { sendEmail, emailTemplates } from '../config/email.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

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

// Signup - create user in DB and send welcome email
router.post('/signup', async (req,res)=>{
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, firstName, lastName });
    const token = jwt.sign({ id: user.id, role: user.role, profileCompleted: user.profileCompleted }, JWT_SECRET, { expiresIn: '7d' });
    
    // Send welcome email
    await sendEmail(email, emailTemplates.welcome(firstName));
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName
      } 
    });
  } catch (e) {
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login - verify credentials
router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, profileCompleted: user.profileCompleted }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName
      } 
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});

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
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Generate and save new OTP
    const otp = generateOTP();
    await OTP.create({ email, otp });

    // Send OTP email
    await sendEmail(email, emailTemplates.resetPassword(otp));

    res.json({ message: 'OTP sent to your email' });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified successfully' });
  } catch (e) {
    console.error('Verify OTP error:', e);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password required' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete used OTP
    await OTP.deleteMany({ email });

    res.json({ message: 'Password reset successfully' });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete existing OTPs
    await OTP.deleteMany({ email });

    // Generate and save new OTP
    const otp = generateOTP();
    await OTP.create({ email, otp });

    // Send OTP email
    await sendEmail(email, emailTemplates.resetPassword(otp));

    res.json({ message: 'New OTP sent to your email' });
  } catch (e) {
    console.error('Resend OTP error:', e);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
});