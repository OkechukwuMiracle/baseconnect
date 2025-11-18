import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  role: { type: String, enum: ['creator', 'contributor', null], default: null },
  profileCompleted: { type: Boolean, default: false },
  address: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  // Identity Graph fields
  walletAddress: { type: String, default: null, trim: true, lowercase: true },
  socialLinks: [{
    platform: { type: String, enum: ['twitter', 'github', 'discord', 'telegram', 'linkedin'], required: true },
    username: { type: String, required: true },
    verified: { type: Boolean, default: false }
  }],
  onchainActivity: {
    transactions: { type: Number, default: 0 },
    nfts: { type: Number, default: 0 },
    tokens: { type: Number, default: 0 }
  },
  // Referral system
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralLevel: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  // Profile fields
  interests: [{ type: String }],
  badges: [{
    badgeId: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now }
  }],
  // Following system
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Generate referral code before save
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = randomCode;
  }
  next();
});

export const User = mongoose.model('User', userSchema);