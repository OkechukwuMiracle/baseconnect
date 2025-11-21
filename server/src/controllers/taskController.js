import { Task } from '../models/task.js';
import { Application } from '../models/application.js';
import { Submission } from '../models/submission.js';

export const taskController = {

  // Enhanced Get all tasks with proper sorting and filtering
async getAllTasks(req, res) {
  try {
    console.log('GET /api/tasks - Query params:', req.query);
    
    const filter = {};
    
    // Apply filters from query params
    if (req.query.creator) filter.creator = req.query.creator;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.status) filter.status = req.query.status;
    
    console.log('Filter applied:', filter);

    // Fetch tasks with creator info
    const tasks = await Task.find(filter)
      .populate("creator", "name email rating address")
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects

    console.log(`Found ${tasks.length} tasks`);

    // Ensure all tasks have necessary fields
    const formattedTasks = tasks.map(task => ({
      ...task,
      _id: task._id.toString(),
      creator: task.creator?._id ? {
        ...task.creator,
        _id: task.creator._id.toString()
      } : task.creator,
      tags: task.tags || [],
      applicants: task.applicants || 0,
      hasSubmission: task.hasSubmission || false,
      reward: task.reward || 0,
      status: task.status || 'pending',
      createdAt: task.createdAt || new Date(),
      deadline: task.deadline || new Date()
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: error.message });
  }
},

  // Get a single task
  async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id)
        .populate("creator", "name email rating address");

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a task
  // async createTask(req, res) {
  //   const task = new Task(req.body);
  //   try {
  //     const newTask = await task.save();
  //     res.status(201).json(newTask);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },

  async createTask(req, res) {
  try {
    const { title, description, category, reward, deadline, duration, tags, status } = req.body;

    // Ensure authenticated user exists and use as creator
    const creatorId = req.user && req.user.id ? req.user.id : null;
    if (!creatorId) return res.status(401).json({ message: 'Unauthorized' });

    const attachmentUrl = req.file ? req.file.path : null; // Cloudinary URL

    // Parse tags - may be JSON string from client
    let parsedTags = [];
    try {
      if (typeof tags === 'string' && tags.length > 0) {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (e) {
      parsedTags = [];
    }

    const rewardNum = Number(reward);
    if (isNaN(rewardNum)) {
      return res.status(400).json({ message: 'Invalid reward amount' });
    }

    const deadlineDate = deadline ? new Date(deadline) : null;

    const task = new Task({
      title,
      description,
      category,
      reward: rewardNum,
      deadline: deadlineDate,
      duration,
      tags: parsedTags,
      creator: creatorId,
      status: status || 'pending',
      attachment: attachmentUrl,
      escrowAmount: rewardNum,
      // If client provided a transactionHash (on-chain funding), record it and mark funded
      transactionHash: req.body.transactionHash || null,
      escrowFunded: !!req.body.transactionHash,
    });

    const saved = await task.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(400).json({ message: error.message });
  }
},


  // Update a task
  async updateTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      Object.assign(task, req.body);
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      await task.deleteOne();
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Apply for a task - UPDATED 
  async applyForTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const applicantId = req.user.id; // From auth middleware
      console.log('Applicant ID:', applicantId);
      console.log('Task ID:', req.params.id);

      // Check if user already applied
      const existingApplication = await Application.findOne({
        task: req.params.id,
        applicant: applicantId
      });

      if (existingApplication) {
        console.log('Existing application found:', existingApplication);
        return res.status(400).json({ message: 'You have already applied for this task' });
      }

      // Create application record
      const application = new Application({
        task: req.params.id,
        applicant: applicantId,
        coverLetter: req.body.coverLetter || ''
      });

      await application.save();
      console.log('Application created:', application);

      // Increment applicants count
      task.applicants = (task.applicants || 0) + 1;
      await task.save();

      res.json({ message: 'Application submitted successfully', application });
    } catch (error) {
      console.error('Apply error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Submit work for a task
  async submitWork(req, res) {
    try {
      const { submission } = req.body;
      const contributorId = req.user.id;
      
      const task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if user is the assignee
      if (task.assignee?.toString() !== contributorId) {
        return res.status(403).json({ message: 'You are not assigned to this task' });
      }

      // Check if already submitted
      const existingSubmission = await Submission.findOne({
        task: req.params.id,
        contributor: contributorId,
        status: 'pending'
      });

      if (existingSubmission) {
        return res.status(400).json({ message: 'You have already submitted work for this task' });
      }

      // Create submission
      const newSubmission = new Submission({
        task: req.params.id,
        contributor: contributorId,
        content: submission
      });

      await newSubmission.save();

      // Update task to indicate there's a submission
      task.hasSubmission = true;
      await task.save();

      res.json({ message: 'Work submitted successfully', submission: newSubmission });
    } catch (error) {
      console.error('Submit work error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get applicants for a task - UPDATED
  async getTaskApplicants(req, res) {
    try {
      console.log('Getting applicants for task:', req.params.id);
      
      const applications = await Application.find({ 
        task: req.params.id 
      })
      .populate('applicant', 'name email bio rating address')
      .sort({ createdAt: -1 });

      console.log('Found applications:', applications.length);

      // Transform to match frontend expectations
      const applicants = applications.map(app => ({
        id: app.applicant._id.toString(),
        name: app.applicant.name,
        email: app.applicant.email,
        bio: app.applicant.bio,
        rating: app.applicant.rating || 0,
        address: app.applicant.address,
        appliedAt: app.createdAt,
        status: app.status,
        applicationId: app._id.toString()
      }));

      console.log('Transformed applicants:', applicants);

      // Disable caching
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.json(applicants);
    } catch (error) {
      console.error('Get applicants error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Accept an applicant - UPDATED
  async acceptApplicant(req, res) {
    try {
      const { applicantId } = req.body;
      const task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update the application status
      const application = await Application.findOne({
        task: req.params.id,
        applicant: applicantId
      });

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      application.status = 'accepted';
      await application.save();

      // Update task with assignee
      task.assignee = applicantId;
      task.status = 'in-progress';
      await task.save();

      // Optionally reject other applications
      await Application.updateMany(
        { 
          task: req.params.id, 
          applicant: { $ne: applicantId },
          status: 'pending'
        },
        { status: 'rejected' }
      );

      res.json({ message: 'Applicant accepted', task });
    } catch (error) {
      console.error('Accept applicant error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Check if user has applied for a task
  async checkApplication(req, res) {
    try {
      const application = await Application.findOne({
        task: req.params.id,
        applicant: req.user.id
      });

      res.json({ hasApplied: !!application });
    } catch (error) {
      console.error('Check application error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get submission for a task (for creator to review)
  async getTaskSubmission(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if user is the creator
      if (task.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only task creator can view submissions' });
      }

      const submission = await Submission.findOne({
        task: req.params.id,
        status: 'pending'
      }).populate('contributor', 'name email address rating');

      if (!submission) {
        return res.status(404).json({ message: 'No submission found' });
      }

      res.json(submission);
    } catch (error) {
      console.error('Get submission error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Approve submission and release payment
  async approveSubmission(req, res) {
    try {
      const { submissionId, transactionHash } = req.body;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      const task = await Task.findById(submission.task);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if user is the creator
      if (task.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only task creator can approve submissions' });
      }

      // Update submission status
      submission.status = 'approved';
      submission.reviewedAt = new Date();
      await submission.save();

      // Update task status
      task.status = 'completed';
      task.hasSubmission = false;
  task.transactionHash = transactionHash;
  // Compute platform fee (10%) and record it; escrowAmount should reflect remaining after fee
  const fee = typeof task.reward === 'number' ? Number((task.reward * 0.1).toFixed(6)) : 0;
  task.platformFee = fee;
  task.escrowAmount = (task.escrowAmount || task.reward || 0) - fee;
      await task.save();

      res.json({ 
        message: 'Submission approved and payment released', 
        task,
        submission 
      });
    } catch (error) {
      console.error('Approve submission error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Reject submission
  async rejectSubmission(req, res) {
    try {
      const { submissionId, reviewNote } = req.body;
      
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      const task = await Task.findById(submission.task);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if user is the creator
      if (task.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only task creator can reject submissions' });
      }

      // Update submission status
      submission.status = 'rejected';
      submission.reviewedAt = new Date();
      submission.reviewNote = reviewNote || 'Submission rejected';
      await submission.save();

      // Update task - allow resubmission
      task.hasSubmission = false;
      await task.save();

      res.json({ 
        message: 'Submission rejected', 
        task,
        submission 
      });
    } catch (error) {
      console.error('Reject submission error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get contributor's own submission (for checking revision requests)
async getMySubmission(req, res) {
  try {
    const contributorId = req.user.id;
    
    const submission = await Submission.findOne({
      task: req.params.id,
      contributor: contributorId
    }).sort({ createdAt: -1 }); // Get latest submission

    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get my submission error:', error);
    res.status(500).json({ message: error.message });
  }
},
};




