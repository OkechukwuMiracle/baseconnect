import mongoose from 'mongoose';

const waitlistTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['mvp-scope', 'verification'],
    required: true
  },
  // subcategory: {
  //   type: String,
  //   enum: ['identity-graph', 'referral-system', 'profiles', null],
  //   default: null
  // },
  taskType: {
    type: String,
    enum: ['createProfile', 'connectWallet', 'referrals', 
           ],
    required: true
  },
  verificationEndpoint: {
    type: String,
    required: true
  },
  requiredValue: {
    type: Number,
    default: null // e.g., 3 for "3+ links", 5 for "Follow 5 profiles"
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const WaitlistTask = mongoose.model('WaitlistTask', waitlistTaskSchema);

