import mongoose from 'mongoose';
import { WaitlistTask } from '../models/waitlistTask.js';
import { config } from '../config/index.js';

const waitlistTasks = [
  // MVP Scope - Identity Graph v1
  {
    taskId: 'identity-graph-wallet-linking',
    title: 'Wallet Linking',
    description: 'Link your wallet address to your Baseconnect profile',
    category: 'mvp-scope',
    subcategory: 'identity-graph',
    taskType: 'connectWallet',
    verificationEndpoint: '/api/task/check/connectWallet',
    requiredValue: null,
    order: 1
  },
  {
    taskId: 'identity-graph-social-linking',
    title: 'Social Linking',
    description: 'Link at least one social media account (Twitter, GitHub, Discord, etc.)',
    category: 'mvp-scope',
    subcategory: 'identity-graph',
    taskType: 'connectSocial',
    verificationEndpoint: '/api/task/check/connectSocial',
    requiredValue: 1,
    order: 2
  },
  {
    taskId: 'identity-graph-complete',
    title: 'Complete Identity Graph',
    description: 'Complete your identity graph with 3+ links (wallet + socials)',
    category: 'mvp-scope',
    subcategory: 'identity-graph',
    taskType: 'identityGraphComplete',
    verificationEndpoint: '/api/task/check/identityGraphComplete',
    requiredValue: 3,
    order: 3
  },
  {
    taskId: 'identity-graph-onchain-activity',
    title: 'Onchain Activity Mapping',
    description: 'Map your onchain activity to build your identity graph',
    category: 'mvp-scope',
    subcategory: 'identity-graph',
    taskType: 'connectWallet', // Using wallet as proxy for onchain activity
    verificationEndpoint: '/api/task/check/connectWallet',
    requiredValue: null,
    order: 4
  },

  // MVP Scope - Referral System v1
  {
    taskId: 'referral-user-to-user',
    title: 'User → User Referral',
    description: 'Refer a new user to Baseconnect',
    category: 'mvp-scope',
    subcategory: 'referral-system',
    taskType: 'referrals',
    verificationEndpoint: '/api/task/check/referrals',
    requiredValue: 1,
    order: 5
  },
  {
    taskId: 'referral-creator-follower',
    title: 'Creator → Follower Route',
    description: 'Build your creator referral network',
    category: 'mvp-scope',
    subcategory: 'referral-system',
    taskType: 'referrals',
    verificationEndpoint: '/api/task/check/referrals',
    requiredValue: 1,
    order: 6
  },
  {
    taskId: 'referral-partner-community',
    title: 'Partner → Community Route',
    description: 'Activate partner community referrals',
    category: 'mvp-scope',
    subcategory: 'referral-system',
    taskType: 'partnerQuest',
    verificationEndpoint: '/api/task/check/partnerQuest',
    requiredValue: null,
    order: 7
  },

  // MVP Scope - Profiles v1
  {
    taskId: 'profile-create',
    title: 'Create Baseconnect Profile',
    description: 'Create your base-level identity page on Baseconnect',
    category: 'mvp-scope',
    subcategory: 'profiles',
    taskType: 'createProfile',
    verificationEndpoint: '/api/task/check/createProfile',
    requiredValue: null,
    order: 8
  },
  {
    taskId: 'profile-interests',
    title: 'Build Interest Graph',
    description: 'Add interests to your profile (3+ interests)',
    category: 'mvp-scope',
    subcategory: 'profiles',
    taskType: 'interestGraphComplete',
    verificationEndpoint: '/api/task/check/interestGraphComplete',
    requiredValue: 3,
    order: 9
  },
  {
    taskId: 'profile-badges',
    title: 'Earn Onchain Badges',
    description: 'Claim at least one onchain badge',
    category: 'mvp-scope',
    subcategory: 'profiles',
    taskType: 'badgeClaim',
    verificationEndpoint: '/api/task/check/badgeClaim',
    requiredValue: 1,
    order: 10
  },

  // Rewards Quest - Identity & Profile Quests
  {
    taskId: 'quest-create-profile',
    title: 'Create Your Baseconnect Profile',
    description: 'Complete your profile setup',
    category: 'rewards-quest',
    subcategory: 'identity-profile-quests',
    taskType: 'createProfile',
    verificationEndpoint: '/api/task/check/createProfile',
    requiredValue: null,
    order: 1
  },
  {
    taskId: 'quest-complete-identity-graph',
    title: 'Complete Identity Graph (3+ Links)',
    description: 'Link wallet and social accounts to complete your identity graph',
    category: 'rewards-quest',
    subcategory: 'identity-profile-quests',
    taskType: 'identityGraphComplete',
    verificationEndpoint: '/api/task/check/identityGraphComplete',
    requiredValue: 3,
    order: 2
  },

  // Rewards Quest - Referral Graph Quests
  {
    taskId: 'quest-refer-user',
    title: 'Refer 1 New User',
    description: 'Invite a friend to join Baseconnect',
    category: 'rewards-quest',
    subcategory: 'referral-graph-quests',
    taskType: 'referrals',
    verificationEndpoint: '/api/task/check/referrals',
    requiredValue: 1,
    order: 3
  },
  {
    taskId: 'quest-referral-level',
    title: 'Reach Referral Level 2 or 3',
    description: 'Build your referral network to reach level 2 or 3',
    category: 'rewards-quest',
    subcategory: 'referral-graph-quests',
    taskType: 'referrals',
    verificationEndpoint: '/api/task/check/referrals',
    requiredValue: 2,
    order: 4
  },

  // Rewards Quest - Network Value Quests
  {
    taskId: 'quest-follow-profiles',
    title: 'Follow 5 Profiles',
    description: 'Follow 5 other users on Baseconnect',
    category: 'rewards-quest',
    subcategory: 'network-value-quests',
    taskType: 'followCount',
    verificationEndpoint: '/api/task/check/followCount',
    requiredValue: 5,
    order: 5
  },
  {
    taskId: 'quest-build-interest-graph',
    title: 'Build Your Interest Graph',
    description: 'Add interests to connect with like-minded users',
    category: 'rewards-quest',
    subcategory: 'network-value-quests',
    taskType: 'interestGraphComplete',
    verificationEndpoint: '/api/task/check/interestGraphComplete',
    requiredValue: 3,
    order: 6
  },

  // Token Utility Design (Documentation/Planning tasks)
  {
    taskId: 'token-utility-access',
    title: 'Token Utility: Access Gates',
    description: 'Understand token-powered identity gates and verification tiers',
    category: 'token-utility',
    subcategory: null,
    taskType: 'createProfile',
    verificationEndpoint: '/api/task/check/createProfile',
    requiredValue: null,
    order: 1
  },
  {
    taskId: 'token-utility-staking',
    title: 'Token Utility: Staking for Boosts',
    description: 'Learn about staking tokens for profile visibility boosts',
    category: 'token-utility',
    subcategory: null,
    taskType: 'badgeClaim',
    verificationEndpoint: '/api/task/check/badgeClaim',
    requiredValue: null,
    order: 2
  }
];

async function seedWaitlistTasks() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing tasks (optional - comment out if you want to keep existing)
    // await WaitlistTask.deleteMany({});

    // Insert tasks
    for (const task of waitlistTasks) {
      await WaitlistTask.findOneAndUpdate(
        { taskId: task.taskId },
        task,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded task: ${task.title}`);
    }

    console.log(`\n✅ Successfully seeded ${waitlistTasks.length} waitlist tasks`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    process.exit(1);
  }
}

seedWaitlistTasks();

