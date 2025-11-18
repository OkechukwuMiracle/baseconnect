import express from 'express';
import { User } from '../models/user.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Update wallet address
router.post('/wallet', authMiddleware, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // Basic validation - should be a valid Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address format' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if wallet is already linked to another user
    const existingUser = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      _id: { $ne: user._id }
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Wallet address already linked to another account' });
    }

    user.walletAddress = walletAddress.toLowerCase();
    await user.save();

    res.json({
      message: 'Wallet address updated successfully',
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ message: 'Failed to update wallet address' });
  }
});

// Add social link
router.post('/social', authMiddleware, async (req, res) => {
  try {
    const { platform, username } = req.body;
    if (!platform || !username) {
      return res.status(400).json({ message: 'Platform and username are required' });
    }

    const validPlatforms = ['twitter', 'github', 'discord', 'telegram', 'linkedin'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove existing link for this platform if exists
    user.socialLinks = user.socialLinks?.filter(
      link => link.platform !== platform
    ) || [];

    // Add new link
    user.socialLinks.push({
      platform,
      username: username.trim(),
      verified: false
    });

    await user.save();

    res.json({
      message: 'Social link added successfully',
      socialLinks: user.socialLinks
    });
  } catch (error) {
    console.error('Error adding social link:', error);
    res.status(500).json({ message: 'Failed to add social link' });
  }
});

// Remove social link
router.delete('/social/:platform', authMiddleware, async (req, res) => {
  try {
    const { platform } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.socialLinks = user.socialLinks?.filter(
      link => link.platform !== platform
    ) || [];

    await user.save();

    res.json({
      message: 'Social link removed successfully',
      socialLinks: user.socialLinks
    });
  } catch (error) {
    console.error('Error removing social link:', error);
    res.status(500).json({ message: 'Failed to remove social link' });
  }
});

// Update interests
router.post('/interests', authMiddleware, async (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove duplicates and trim - FIXED: Removed TypeScript type annotation
    user.interests = [...new Set(interests.map(i => i.trim()).filter(Boolean))];
    await user.save();

    res.json({
      message: 'Interests updated successfully',
      interests: user.interests
    });
  } catch (error) {
    console.error('Error updating interests:', error);
    res.status(500).json({ message: 'Failed to update interests' });
  }
});

// Follow a user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(currentUserId);
    const userToFollow = await User.findById(userId);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (user.following?.includes(userToFollow._id)) {
      return res.status(409).json({ message: 'Already following this user' });
    }

    // Add to following list
    if (!user.following) {
      user.following = [];
    }
    user.following.push(userToFollow._id);

    // Add to user's followers list
    if (!userToFollow.followers) {
      userToFollow.followers = [];
    }
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();

    res.json({
      message: 'User followed successfully',
      followingCount: user.following.length
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Failed to follow user' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const user = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(userId);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following list
    user.following = user.following?.filter(
      id => id.toString() !== userId
    ) || [];

    // Remove from user's followers list
    userToUnfollow.followers = userToUnfollow.followers?.filter(
      id => id.toString() !== currentUserId
    ) || [];

    await user.save();
    await userToUnfollow.save();

    res.json({
      message: 'User unfollowed successfully',
      followingCount: user.following.length
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Failed to unfollow user' });
  }
});

// Get user profile data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      walletAddress: user.walletAddress,
      socialLinks: user.socialLinks || [],
      interests: user.interests || [],
      following: user.following || [],
      followers: user.followers || [],
      referralCode: user.referralCode,
      referralCount: user.referralCount || 0,
      referralLevel: user.referralLevel || 0,
      badges: user.badges || []
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Claim a badge
router.post('/badges/claim', authMiddleware, async (req, res) => {
  try {
    const { badgeId } = req.body;
    if (!badgeId) {
      return res.status(400).json({ message: 'Badge ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if badge already claimed
    const hasBadge = user.badges?.some(b => b.badgeId === badgeId);
    if (hasBadge) {
      return res.status(409).json({ message: 'Badge already claimed' });
    }

    // Add badge
    if (!user.badges) {
      user.badges = [];
    }
    user.badges.push({
      badgeId,
      earnedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Badge claimed successfully',
      badges: user.badges
    });
  } catch (error) {
    console.error('Error claiming badge:', error);
    res.status(500).json({ message: 'Failed to claim badge' });
  }
});

// Search users (for following)
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude current user
    })
    .select('email firstName lastName walletAddress')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Apply referral code
router.post('/referral/apply', authMiddleware, async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referredBy) {
      return res.status(409).json({ message: 'Referral code already applied' });
    }

    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    if (referrer._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Cannot use your own referral code' });
    }

    user.referredBy = referrer._id;
    referrer.referralCount = (referrer.referralCount || 0) + 1;
    
    // Calculate referral level (simple logic - can be enhanced)
    if (referrer.referralCount >= 10) {
      referrer.referralLevel = 3;
    } else if (referrer.referralCount >= 5) {
      referrer.referralLevel = 2;
    } else if (referrer.referralCount >= 1) {
      referrer.referralLevel = 1;
    }

    await user.save();
    await referrer.save();

    res.json({
      message: 'Referral code applied successfully',
      referredBy: referrer.email
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    res.status(500).json({ message: 'Failed to apply referral code' });
  }
});

export default router;

