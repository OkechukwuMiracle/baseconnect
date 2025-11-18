import mongoose from 'mongoose';

const verificationRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  taskType: {
    type: String,
    enum: ['createProfile', 'connectWallet', 'connectSocial', 'identityGraphComplete', 'referrals', 
           'followCount', 'interestGraphComplete', 'badgeClaim', 'partnerQuest'],
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    referralCount: { type: Number, default: 0 },
    platform: { type: String, default: null },
    badgeId: { type: String, default: null },
    partnerId: { type: String, default: null },
    followCount: { type: Number, default: 0 },
    linkCount: { type: Number, default: 0 },
    interestCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for efficient queries
verificationRecordSchema.index({ wallet: 1, taskType: 1 });
verificationRecordSchema.index({ user: 1, taskType: 1 });

export const VerificationRecord = mongoose.model('VerificationRecord', verificationRecordSchema);

