import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';

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

// Signup - create user in DB
router.post('/signup', async (req,res)=>{
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = jwt.sign({ id: user.id, role: user.role, profileCompleted: user.profileCompleted }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, profileCompleted: user.profileCompleted } });
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
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, profileCompleted: user.profileCompleted } });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Return current user
router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, email: user.email, role: user.role, profileCompleted: user.profileCompleted, name: user.name, bio: user.bio });
});

// Profile setup
// router.post('/profile', auth, (req,res)=>{
//   const { role, name, bio } = req.body;
//   if(!role || ![ 'creator', 'contributor' ].includes(role)) return res.status(400).json({ message: 'invalid role' });
//   const user = USERS.get(req.user.id);
//   if(!user) return res.status(404).json({ message: 'User not found' });
//   user.role = role;
//   user.name = name;
//   user.bio = bio;
//   user.profileCompleted = true;
//   USERS.set(user.id, user);
//   res.json(user);
// });


// Profile setup - returns new token with updated info
router.post('/profile', auth, async (req,res)=>{
  const { role, name, bio } = req.body;
  if(!role || ![ 'creator', 'contributor' ].includes(role)) return res.status(400).json({ message: 'invalid role' });
  const user = await User.findById(req.user.id);
  if(!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  user.name = name;
  user.bio = bio;
  user.profileCompleted = true;
  await user.save();
  res.json({ id: user.id, email: user.email, role: user.role, profileCompleted: user.profileCompleted, name: user.name, bio: user.bio });
});

// Export helpers for server use
export const authMiddleware = auth;
export const roleMiddleware = requireRole;
export default router;
