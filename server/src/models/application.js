import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure a user can only apply once per task
applicationSchema.index({ task: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);