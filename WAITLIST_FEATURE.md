# Baseconnect Waitlist Feature

## Overview

A comprehensive waitlist system that tracks user progress on MVP scope tasks, rewards quests, and token utility features. All progress is saved in the database and verified through dedicated API endpoints.

## Features Implemented

### 1. Database Models

- **WaitlistTask**: Stores all waitlist tasks with categories, subcategories, and verification requirements
- **QuestProgress**: Tracks individual user progress on each task
- **VerificationRecord**: Records verification results for audit purposes
- **User Model Extended**: Added fields for identity graph (wallet, social links), referrals, interests, badges, and following system

### 2. Server Endpoints

#### Waitlist Endpoints
- `GET /api/waitlist/tasks` - Get all active waitlist tasks (public)
- `GET /api/waitlist/progress` - Get user's progress on all tasks (protected)
- `POST /api/waitlist/tasks/:taskId/verify` - Verify task completion (protected)

#### Verification Endpoints (All Public, Wallet-Based)
- `GET /api/task/check/createProfile?wallet=`
- `GET /api/task/check/connectWallet?wallet=`
- `GET /api/task/check/connectSocial?wallet=&platform=`
- `GET /api/task/check/identityGraphComplete?wallet=`
- `GET /api/task/check/referrals?wallet=`
- `GET /api/task/check/followCount?wallet=`
- `GET /api/task/check/interestGraphComplete?wallet=`
- `GET /api/task/check/badgeClaim?wallet=`
- `GET /api/task/check/partnerQuest?wallet=&partner=`

Each verification endpoint returns:
```json
{
  "status": boolean,
  "timestamp": "ISO date string",
  "metadata": {
    // Task-specific metadata (referralCount, platform, badgeId, etc.)
  }
}
```

### 3. Client UI

The Waitlist page (`/waitlist`) includes:

- **Overall Progress Bar**: Shows completion percentage across all tasks
- **Category Organization**: Tasks grouped by:
  - MVP Scope (Identity Graph, Referral System, Profiles, Partner Activation, Supershard Integration)
  - Rewards Quest (Identity & Profile, Referral Graph, Network Value)
  - Token Utility
- **Task Cards**: Each task shows:
  - Title and description
  - Progress bar with percentage
  - Status indicator (not started, in progress, completed)
  - Verify button to check completion
  - Completion timestamp when done
- **Real-time Updates**: Progress refreshes after verification

### 4. Task Categories

#### MVP Scope Tasks
1. **Identity Graph v1**
   - Wallet Linking
   - Social Linking
   - Complete Identity Graph (3+ links)
   - Onchain Activity Mapping

2. **Referral System v1**
   - User → User Routes
   - Creator → Follower Routes
   - Partner → Community Routes

3. **Profiles v1**
   - Create Baseconnect Profile
   - Build Interest Graph
   - Earn Onchain Badges

#### Rewards Quest Tasks
1. **Identity & Profile Quests**
   - Create your Baseconnect profile
   - Complete identity graph (3+ links)

2. **Referral Graph Quests**
   - Refer 1 new user
   - Reach referral level 2 or 3

3. **Network Value Quests**
   - Follow 5 profiles
   - Build your interest graph

#### Token Utility
- Token utility documentation and engagement tasks

## Setup Instructions

### 1. Seed Waitlist Tasks

Run the seed script to populate the database with all waitlist tasks:

```bash
cd server
npm run seed:waitlist
```

This will create all the tasks defined in the requirements.

### 2. Access the Waitlist

Navigate to `/waitlist` in the client application. Users can:
- View all tasks (even without login)
- See their progress (requires login)
- Verify task completion (requires login)

### 3. Verification Flow

1. User completes actions (links wallet, adds socials, etc.)
2. User clicks "Verify Task" button
3. System checks user's current state against task requirements
4. Progress is updated and saved to database
5. UI refreshes to show updated status

## Database Schema

### WaitlistTask
```javascript
{
  taskId: String (unique),
  title: String,
  description: String,
  category: 'mvp-scope' | 'rewards-quest' | 'token-utility',
  subcategory: String | null,
  taskType: String (enum),
  verificationEndpoint: String,
  requiredValue: Number | null,
  order: Number,
  isActive: Boolean
}
```

### QuestProgress
```javascript
{
  user: ObjectId (ref: User),
  task: ObjectId (ref: WaitlistTask),
  status: 'not_started' | 'in_progress' | 'completed',
  progress: Number (0-100),
  completedAt: Date | null,
  verificationData: Object
}
```

### User Extensions
```javascript
{
  // Identity Graph
  walletAddress: String,
  socialLinks: [{
    platform: String,
    username: String,
    verified: Boolean
  }],
  onchainActivity: {
    transactions: Number,
    nfts: Number,
    tokens: Number
  },
  
  // Referrals
  referralCode: String,
  referredBy: ObjectId,
  referralLevel: Number,
  referralCount: Number,
  
  // Profile
  interests: [String],
  badges: [{
    badgeId: String,
    earnedAt: Date
  }],
  
  // Social
  following: [ObjectId],
  followers: [ObjectId]
}
```

## Verification Logic

Each task type has specific verification logic:

- **createProfile**: Checks if `user.profileCompleted === true`
- **connectWallet**: Checks if `user.walletAddress` exists and matches
- **connectSocial**: Checks if user has linked social accounts (counts against requiredValue)
- **identityGraphComplete**: Counts wallet + social links (requires 3+ by default)
- **referrals**: Checks `referralCount` or `referralLevel` based on requiredValue
- **followCount**: Checks `following.length` (requires 5 by default)
- **interestGraphComplete**: Checks `interests.length` (requires 3 by default)
- **badgeClaim**: Checks if user has any badges
- **partnerQuest**: Placeholder for partner-specific logic

## Progress Tracking

- Progress is calculated as a percentage based on current value vs required value
- Status updates automatically when verification runs
- Completed tasks show green badge and completion timestamp
- In-progress tasks show progress bar with percentage

## Next Steps

To fully activate the waitlist system:

1. **Seed the database**: Run `npm run seed:waitlist` in the server directory
2. **Update user data**: Ensure users can link wallets, add socials, etc. through your existing UI
3. **Implement referral system**: Add logic to track referrals and update `referralCount` and `referralLevel`
4. **Add following system**: Implement follow/unfollow functionality
5. **Badge system**: Create badge awarding logic
6. **Partner quests**: Implement partner-specific verification logic

## API Usage Examples

### Get All Tasks
```bash
curl http://localhost:3000/api/waitlist/tasks
```

### Get User Progress (requires auth)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/waitlist/progress
```

### Verify Task
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/waitlist/tasks/identity-graph-wallet-linking/verify
```

### Check Verification Status
```bash
curl "http://localhost:3000/api/task/check/connectWallet?wallet=0x..."
```

