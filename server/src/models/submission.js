import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedAt: {
    type: Date
  },
  reviewNote: {
    type: String
  }
}, {
  timestamps: true
});

// Ensure a contributor can only submit once per task (or multiple times if rejected)
submissionSchema.index({ task: 1, contributor: 1 });

export const Submission = mongoose.model('Submission', submissionSchema);
