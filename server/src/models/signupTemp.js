import mongoose from 'mongoose';

const signupTempSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

export const SignupTemp = mongoose.model('SignupTemp', signupTempSchema);

