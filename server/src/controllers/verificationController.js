import { VerificationRecord } from '../models/verificationRecord.js';
import { User } from '../models/user.js';

export const verificationController = {
  // Check createProfile
  checkCreateProfile: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const status = user?.profileCompleted || false;

      // Save verification record
      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'createProfile' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'createProfile',
            status,
            timestamp: new Date(),
            metadata: {}
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: {}
      });
    } catch (error) {
      console.error('Error checking createProfile:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check connectWallet
  checkConnectWallet: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const status = !!user?.walletAddress;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'connectWallet' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'connectWallet',
            status,
            timestamp: new Date(),
            metadata: { wallet: user.walletAddress }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: { wallet: user?.walletAddress || null }
      });
    } catch (error) {
      console.error('Error checking connectWallet:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check connectSocial
  

  // Check referrals
  checkReferrals: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const referralCount = user?.referralCount || 0;
      const status = referralCount >= 1;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'referrals' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'referrals',
            status,
            timestamp: new Date(),
            metadata: { referralCount }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: { referralCount }
      });
    } catch (error) {
      console.error('Error checking referrals:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },
  // Submit proof (screenshot/file) for manual verification
  submitProof: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { taskType } = req.body;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      if (!taskType) return res.status(400).json({ message: 'taskType is required' });

      const fileUrl = req.file ? req.file.path || req.file.filename || null : null;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Create a verification record with pending status
      const record = await VerificationRecord.findOneAndUpdate(
        { user: user._id, taskType },
        {
          user: user._id,
          wallet: user.walletAddress || '',
          taskType,
          status: false,
          timestamp: new Date(),
          metadata: { proofUrl: fileUrl, proofSubmittedAt: new Date() }
        },
        { upsert: true, new: true }
      );

      res.json({ message: 'Proof submitted for review', record });
    } catch (error) {
      console.error('Error submitting proof:', error);
      res.status(500).json({ message: 'Failed to submit proof' });
    }
  }
  ,

  // Get pending verification records for a wallet (auth)
  getPendingRecords: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { wallet } = req.query;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const query = { status: false };
      if (wallet) query.wallet = wallet.toLowerCase();
      else {
        const user = await User.findById(userId);
        if (user?.walletAddress) query.wallet = user.walletAddress.toLowerCase();
      }

      const records = await VerificationRecord.find(query).sort({ timestamp: -1 }).limit(50);
      res.json({ records });
    } catch (error) {
      console.error('Error fetching pending records:', error);
      res.status(500).json({ message: 'Failed to fetch pending records' });
    }
  }
  ,

  // Complete verification and award points (authenticated)
  completeVerification: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { taskType, wallet } = req.body;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      if (!taskType) return res.status(400).json({ message: 'taskType is required' });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Determine verification status from current user state
      let status = false;
      let metadata = {};
      switch (taskType) {
        case 'connectWallet':
          status = !!user.walletAddress;
          metadata = { wallet: user.walletAddress };
          break;
        case 'createProfile':
          status = !!user.profileCompleted;
          break;
        case 'referrals':
          status = (user.referralCount || 0) >= 1;
          metadata = { referralCount: user.referralCount || 0 };
          break;
        default:
          return res.status(400).json({ message: 'Unsupported taskType' });
      }

      if (!status) {
        return res.status(400).json({ message: 'Task not yet satisfied' });
      }

      // Upsert verification record
      await VerificationRecord.findOneAndUpdate(
        { user: user._id, taskType },
        {
          user: user._id,
          wallet: (wallet || user.walletAddress || '').toLowerCase(),
          taskType,
          status: true,
          timestamp: new Date(),
          metadata,
        },
        { upsert: true, new: true }
      );

      // Points mapping
      // All three core tasks award 10 points each per requirement
      const pointsMap = {
        connectWallet: 10,
        createProfile: 10,
        referrals: 10
      };

      const addPoints = pointsMap[taskType] || 0;
      user.points = (user.points || 0) + addPoints;
      user.activityLevel = (user.activityLevel || 0) + 1;
      await user.save();

      res.json({ message: 'Verified', points: user.points, activityLevel: user.activityLevel, referralCount: user.referralCount || 0 });
    } catch (error) {
      console.error('Error completing verification:', error);
      res.status(500).json({ message: 'Verification complete failed' });
    }
  }
};

