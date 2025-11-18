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
  checkConnectSocial: async (req, res) => {
    try {
      const { wallet, platform } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      let status = false;
      let platformData = null;

      if (user?.socialLinks) {
        if (platform) {
          const socialLink = user.socialLinks.find(s => s.platform === platform);
          status = !!socialLink;
          platformData = socialLink?.platform || null;
        } else {
          status = user.socialLinks.length > 0;
          platformData = user.socialLinks[0]?.platform || null;
        }
      }

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'connectSocial' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'connectSocial',
            status,
            timestamp: new Date(),
            metadata: {
              platform: platformData,
              socialCount: user.socialLinks?.length || 0
            }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: {
          platform: platformData,
          socialCount: user?.socialLinks?.length || 0
        }
      });
    } catch (error) {
      console.error('Error checking connectSocial:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check identityGraphComplete
  checkIdentityGraphComplete: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const linkCount = (user?.socialLinks?.length || 0) + (user?.walletAddress ? 1 : 0);
      const status = linkCount >= 3;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'identityGraphComplete' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'identityGraphComplete',
            status,
            timestamp: new Date(),
            metadata: { linkCount }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: { linkCount }
      });
    } catch (error) {
      console.error('Error checking identityGraphComplete:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

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

  // Check followCount
  checkFollowCount: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const followCount = user?.following?.length || 0;
      const status = followCount >= 5;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'followCount' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'followCount',
            status,
            timestamp: new Date(),
            metadata: { followCount }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: { followCount }
      });
    } catch (error) {
      console.error('Error checking followCount:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check interestGraphComplete
  checkInterestGraphComplete: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const interestCount = user?.interests?.length || 0;
      const status = interestCount >= 3;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'interestGraphComplete' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'interestGraphComplete',
            status,
            timestamp: new Date(),
            metadata: { interestCount }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: { interestCount }
      });
    } catch (error) {
      console.error('Error checking interestGraphComplete:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check badgeClaim
  checkBadgeClaim: async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      const badgeCount = user?.badges?.length || 0;
      const status = badgeCount > 0;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'badgeClaim' },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'badgeClaim',
            status,
            timestamp: new Date(),
            metadata: {
              badgeCount,
              badgeId: user.badges?.[0]?.badgeId || null
            }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: {
          badgeCount,
          badgeId: user?.badges?.[0]?.badgeId || null
        }
      });
    } catch (error) {
      console.error('Error checking badgeClaim:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  },

  // Check partnerQuest
  checkPartnerQuest: async (req, res) => {
    try {
      const { wallet, partner } = req.query;
      if (!wallet) {
        return res.status(400).json({ message: 'Wallet address required' });
      }

      const user = await User.findOne({ walletAddress: wallet.toLowerCase() });
      // This would need partner-specific logic - placeholder for now
      const status = false;

      if (user) {
        await VerificationRecord.findOneAndUpdate(
          { user: user._id, taskType: 'partnerQuest', 'metadata.partnerId': partner },
          {
            user: user._id,
            wallet: wallet.toLowerCase(),
            taskType: 'partnerQuest',
            status,
            timestamp: new Date(),
            metadata: {
              partnerId: partner || null
            }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status,
        timestamp: new Date(),
        metadata: {
          partnerId: partner || null
        }
      });
    } catch (error) {
      console.error('Error checking partnerQuest:', error);
      res.status(500).json({ message: 'Verification failed' });
    }
  }
};

