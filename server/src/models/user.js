import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  bio: { type: String },
  role: { type: String, enum: ['creator', 'contributor', null], default: null },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
