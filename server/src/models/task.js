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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignee: {
    type: String,
    required: false,
    default: ""
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
  }],
  applicants: {  // 
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);