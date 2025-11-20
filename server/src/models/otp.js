import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'reset-password'], default: 'reset-password' },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

export const OTP = mongoose.model('OTP', otpSchema);