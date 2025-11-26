import mongoose from 'mongoose';
import { WaitlistTask } from '../models/waitlistTask.js';
import { config } from '../config/index.js';

const waitlistTasks = [
  // Keep only the three canonical MVP tasks
  {
    taskId: 'identity-graph-wallet-linking',
    title: 'Conect Wallet',
    description: 'Link your wallet address to your Baseconnect profile',
    category: 'mvp-scope',
    subcategory: 'identity-graph',
    taskType: 'connectWallet',
    verificationEndpoint: '/api/task/check/connectWallet',
    requiredValue: null,
    order: 1
  },
  {
    taskId: 'referral-user-to-user',
    title: 'Refer New User',
    description: 'Invite a friend to join Baseconnect',
    category: 'mvp-scope',
    subcategory: 'referral-system',
    taskType: 'referrals',
    verificationEndpoint: '/api/task/check/referrals',
    requiredValue: 1,
    order: 2
  },
  {
    taskId: 'profile-create',
    title: 'Create Baseconnect Profile',
    description: 'Create your base-level identity page on Baseconnect',
    category: 'mvp-scope',
    subcategory: 'profiles',
    taskType: 'createProfile',
    verificationEndpoint: '/api/task/check/createProfile',
    requiredValue: null,
    order: 3
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

