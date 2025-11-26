import { WaitlistTask } from '../models/waitlistTask.js';
import { QuestProgress } from '../models/questProgress.js';
import { User } from '../models/user.js';

export const waitlistController = {
  // Get all waitlist tasks
  getAllTasks: async (req, res) => {
    try {
      const tasks = await WaitlistTask.find({ isActive: true })
        .sort({ category: 1, order: 1 });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching waitlist tasks:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  },

  // Get user's progress on all tasks
  getProgress: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);

      const tasks = await WaitlistTask.find({ isActive: true })
        .sort({ category: 1, order: 1 });

      const progressRecords = await QuestProgress.find({ user: userId })
        .populate('task');
      
      const progressMap = {};
      progressRecords.forEach(record => {
        if (record.task && record.task._id) {
          progressMap[record.task._id.toString()] = record;
        }
      });

      const tasksWithProgress = tasks.map(task => {
        const progress = progressMap[task._id.toString()] || {
          status: 'not_started',
          progress: 0,
          completedAt: null
        };
        return {
          ...task.toObject(),
          userProgress: {
            status: progress.status,
            progress: progress.progress,
            completedAt: progress.completedAt
          }
        };
      });

      // Calculate overall progress
      const completedCount = tasksWithProgress.filter(
        t => t.userProgress.status === 'completed'
      ).length;
      const overallProgress = tasks.length > 0 
        ? Math.round((completedCount / tasks.length) * 100) 
        : 0;

      res.json({
        tasks: tasksWithProgress,
        overallProgress,
        completedCount,
        totalCount: tasks.length,
        points: user?.points || 0,
        activityLevel: user?.activityLevel || 0,
        referralCount: user?.referralCount || 0
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  },

  // Verify a task completion
  verifyTask: async (req, res) => {
    try {
      const userId = req.user.id;
      const { taskId } = req.params;
      
      const task = await WaitlistTask.findOne({ taskId });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Get or create progress record
      let progress = await QuestProgress.findOne({ 
        user: userId, 
        task: task._id 
      });

      if (!progress) {
        progress = await QuestProgress.create({
          user: userId,
          task: task._id,
          status: 'in_progress',
          progress: 0
        });
      }

      // Check verification status via the verification endpoint
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const wallet = user.walletAddress || '';
      
      // Call the verification endpoint logic
      const verificationResult = await verifyTaskCompletion(
        task.taskType,
        wallet,
        user,
        task.requiredValue
      );

      if (verificationResult.status) {
        // Only award points the first time the task becomes completed
        const wasCompleted = progress.status === 'completed';

        progress.status = 'completed';
        progress.progress = 100;
        progress.completedAt = new Date();
        progress.verificationData = verificationResult.metadata;
        await progress.save();

        if (!wasCompleted) {
          // Award 10 points for each waitlist task completion and increment activityLevel
          user.points = (user.points || 0) + 10;
          user.activityLevel = (user.activityLevel || 0) + 1;
          await user.save();
        }

        res.json({
          success: true,
          message: 'Task verified successfully',
          progress: progress,
          points: user.points,
          activityLevel: user.activityLevel,
          referralCount: user.referralCount || 0
        });
      } else {
        progress.status = 'in_progress';
        progress.progress = verificationResult.progress || 0;
        progress.verificationData = verificationResult.metadata;
        await progress.save();

        res.json({
          success: false,
          message: 'Task not yet completed',
          progress: progress,
          required: verificationResult.required
        });
      }
    } catch (error) {
      console.error('Error verifying task:', error);
      res.status(500).json({ message: 'Failed to verify task' });
    }
  }
};

// Helper function to verify task completion
async function verifyTaskCompletion(taskType, wallet, user, requiredValue = null) {
  switch (taskType) {
    case 'createProfile':
      return {
        status: user.profileCompleted || false,
        progress: user.profileCompleted ? 100 : 0,
        metadata: {}
      };

    case 'connectWallet':
      return {
        status: !!user.walletAddress && user.walletAddress.toLowerCase() === wallet.toLowerCase(),
        progress: user.walletAddress ? 100 : 0,
        metadata: { wallet: user.walletAddress }
      };

   
    case 'referrals':
      const referralRequired = requiredValue || 1;
      // Check both referralCount and referralLevel for level-based tasks
      const referralCount = user.referralCount || 0;
      const referralLevel = user.referralLevel || 0;
      // If requiredValue is 2 or 3, check referralLevel; otherwise check count
      const meetsRequirement = referralRequired >= 2 
        ? (referralLevel >= 2 && referralLevel <= 3)
        : referralCount >= referralRequired;
      return {
        status: meetsRequirement,
        progress: referralRequired >= 2
          ? Math.min((referralLevel / 3) * 100, 100)
          : Math.min((referralCount / referralRequired) * 100, 100),
        metadata: { 
          referralCount,
          referralLevel
        }
      };


    default:
      return {
        status: false,
        progress: 0,
        metadata: {}
      };
  }
}

