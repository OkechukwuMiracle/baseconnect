import mongoose from 'mongoose';

const questProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaitlistTask',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  completedAt: {
    type: Date,
    default: null
  },
  verificationData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Ensure one progress record per user per task
questProgressSchema.index({ user: 1, task: 1 }, { unique: true });

export const QuestProgress = mongoose.model('QuestProgress', questProgressSchema);

