import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  creator: {
    type: String,
    required: true
  },
  assignee: {
    type: String,
    required: true
  },
  reward: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);