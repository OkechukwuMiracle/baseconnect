# BaseConnect Smart Contract Flow - Comprehensive Guide

## Overview

BaseConnect uses a Solidity smart contract (`BaseflowTasksUSDC`) to handle task creation, assignment, completion, and payment distribution on the Base blockchain. The contract implements a secure escrow system with USDC token integration.

---

## Contract Architecture

### 1. **Contract Name & Address**
- **Contract:** `BaseflowTasksUSDC`
- **Network:** Base (Mainnet) & Base Sepolia (Testnet)
- **USDC Addresses:**
  - **Base Mainnet:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
  - **Base Sepolia Testnet:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

### 2. **Key Dependencies**
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";      // Owner management
import "@openzeppelin/contracts/utils/Counters.sol";      // Task ID generation
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // Reentrancy protection
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";  // USDC interface
```

---

## Workflow & Flow

### Step 1: Task Creation
```
Creator → createTask() → USDC escrowed in contract
```

**Function:** `createTask(string title, string description, uint256 deadline, uint256 reward)`

**What happens:**
1. Creator calls `createTask()` with task details and reward amount (in USDC, 6 decimals)
2. Contract transfers full reward amount from creator's wallet to contract (escrow)
3. Task is created with status `PENDING`
4. Event emitted: `TaskCreated(taskId, title, creator, reward)`

**Example:**
```javascript
// Creator creates a task with 1000 USDC reward
const reward = ethers.parseUnits("1000", 6); // USDC has 6 decimals
await contract.createTask(
  "Build Landing Page",
  "Create responsive landing page",
  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days deadline
  reward
);
```

**Security:**
- ✅ Requires USDC approval before calling
- ✅ Only future deadlines allowed
- ✅ Reward must be > 0
- ✅ Full amount held in escrow (no payment until completion)

---

### Step 2: Task Assignment
```
Contributor → assignTask() → Status: IN_PROGRESS
```

**Function:** `assignTask(uint256 taskId)`

**What happens:**
1. Contributor calls `assignTask()` with task ID
2. Status changes from `PENDING` → `IN_PROGRESS`
3. Contributor is recorded as assignee
4. Event emitted: `TaskAssigned(taskId, assignee)`

**Constraints:**
- ✅ Task must exist
- ✅ Task must be in `PENDING` status
- ✅ Creator cannot assign to themselves
- ✅ Only one contributor per task (first to assign wins)

---

### Step 3: Task Completion & Payment Distribution
```
Creator → completeTask() → 90% to Contributor + 10% to Platform
```

**Function:** `completeTask(uint256 taskId, address contributor)`

**Payment Split:**
```
Total Reward:     1000 USDC
Platform Fee:     100 USDC  (10%)  → Contract Owner
Contributor Pay:  900 USDC  (90%)  → Contributor
```

**Smart Logic:**
```solidity
uint256 platformFee = (task.reward * 10) / 100; // 10% platform fee
uint256 contributorReward = task.reward - platformFee; // 90%

// Transfer to contributor (90%)
usdcToken.transfer(contributor, contributorReward);

// Transfer to owner/platform (10%)
usdcToken.transfer(owner(), platformFee);
```

**What happens:**
1. Creator calls `completeTask()` to approve submission
2. Contract calculates: 10% platform fee, 90% contributor payment
3. USDC transferred to contributor (minus platform fee)
4. USDC transferred to contract owner (platform fee)
5. Task status changes to `COMPLETED`
6. Events emitted: `TaskCompleted()` and `SubmissionApproved()`

**Security:**
- ✅ Only creator can approve completion
- ✅ Reentrancy guard prevents double-payment
- ✅ Uses `nonReentrant` modifier for protection
- ✅ Verifies contributor address matches assignment

---

### Step 4: Task Cancellation (Optional)
```
Creator → cancelTask() → Refund to Creator
```

**Function:** `cancelTask(uint256 taskId)`

**What happens:**
1. Creator calls `cancelTask()` before task is in progress
2. Full reward refunded to creator
3. Task status changes to `CANCELLED`
4. Event emitted: `TaskCancelled(taskId)`

**Constraints:**
- ✅ Only creator can cancel
- ✅ Only `PENDING` tasks can be cancelled (not in progress)
- ✅ Full refund issued immediately

---

## Platform Fee Flow

### Who Receives the 10% Platform Fee?

**Answer:** The contract **owner** receives the platform fee.

```solidity
usdcToken.transfer(owner(), platformFee);
```

### How to Identify the Owner

1. **At Deployment:**
```javascript
const BaseflowTasksUSDC = await ethers.getContractFactory("BaseflowTasksUSDC");
const contract = await BaseflowTasksUSDC.deploy(usdcAddress);
const owner = await contract.owner();
```

2. **Check on-chain:**
```javascript
const ownerAddress = await contract.owner();
console.log("Platform fee receiver:", ownerAddress);
```

3. **In code:**
The owner is set during deployment. The default is the deployer's address.
To change owner later:
```solidity
transferOwnership(newAddress); // Only current owner can call
```

### Fee Distribution Example

| Item | Amount | Recipient |
|------|--------|-----------|
| Task Reward Posted | 1000 USDC | Escrowed in Contract |
| Contributor Payment | 900 USDC | Contributor Wallet |
| Platform Fee | 100 USDC | Contract Owner Wallet |

---

## Function Reference

### Creator Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `createTask(title, desc, deadline, reward)` | Post a new task | `uint256 taskId` |
| `cancelTask(taskId)` | Cancel a pending task | - |
| `completeTask(taskId, contributor)` | Approve & pay contributor | - |

### Contributor Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `assignTask(taskId)` | Apply to a task | - |

### View Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `getTask(taskId)` | Get task details | `Task struct` |
| `getUserTasks(user)` | Get user's task IDs | `uint256[] array` |
| `getContractBalance()` | Check USDC balance | `uint256 balance` |

---

## Events

The contract emits the following events for off-chain tracking:

```solidity
event TaskCreated(
    uint256 indexed taskId,
    string title,
    address indexed creator,
    uint256 reward
);

event TaskAssigned(uint256 indexed taskId, address indexed assignee);

event TaskCompleted(uint256 indexed taskId, address indexed assignee, uint256 reward);

event TaskCancelled(uint256 indexed taskId);

event SubmissionApproved(uint256 indexed taskId, address indexed contributor, uint256 reward);
```

---

## Security Features

### ✅ Protection Mechanisms

1. **Reentrancy Guard**
   - `nonReentrant` modifier on `completeTask()` and `cancelTask()`
   - Prevents attackers from calling payment functions recursively

2. **Input Validation**
   - Deadline must be in future
   - Reward must be positive
   - Wallet addresses validated

3. **Access Control**
   - Only creator can complete tasks
   - Only creator can cancel tasks
   - Only assignee recipient can be paid

4. **Escrow Model**
   - Funds held in contract until completion
   - No funds at risk until task started
   - Clear approval workflow

5. **OpenZeppelin Dependencies**
   - Battle-tested libraries from leading security auditors
   - Ownable for owner management
   - ERC20 standard for token safety

---

## Production Readiness Checklist

### ✅ Security Aspects

- [x] **Reentrancy Protection:** Using `nonReentrant` guard from OpenZeppelin
- [x] **Input Validation:** Checks for deadline, reward, wallet addresses
- [x] **Access Control:** Role-based restrictions (creator, assignee, owner)
- [x] **Escrow Model:** Safe fund handling
- [x] **Battle-tested Dependencies:** OpenZeppelin contracts v4+

### ⚠️ Recommended Before Mainnet Deployment

1. **Security Audit**
   - Get contract audited by professional security firm (e.g., OpenZeppelin, Audit Protocols, Trail of Bits)
   - Address any findings

2. **Test Coverage**
   - Write comprehensive tests for all functions
   - Test edge cases and error scenarios
   - Test fund transfer security

3. **Deployment Strategy**
   - Deploy to testnet first (Base Sepolia)
   - Run integration tests with frontend
   - Verify USDC contract integration
   - Test with small amounts first

4. **Owner Management**
   - Secure the owner private key (Hardware wallet recommended)
   - Consider multi-sig for owner (e.g., Gnosis Safe)
   - Plan fee withdrawal process

5. **Monitor & Upgrade Plan**
   - Set up event logging and monitoring
   - Plan for future upgrades (if needed)
   - Consider using OpenZeppelin Upgradeable Contracts

---

## Deployment Steps

### 1. Local/Testnet Deployment

```bash
cd contracts
npm install
npm run compile
npm run deploy:testnet
```

### 2. Verify Contract on Block Explorer

After deployment, verify on BaseScan:
```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <USDC_ADDRESS>
```

### 3. Mainnet Deployment

```bash
npm run deploy
```

---

## Integration with BaseConnect App

### Frontend (Client)
1. User selects role (creator/contributor)
2. Creator posts task → `createTask()` called
3. Contributor applies → `assignTask()` called
4. Creator reviews & approves → `completeTask()` called
5. Payments processed automatically

### Backend (Server)
1. Listen to contract events
2. Update task status in database
3. Send notifications to users
4. Track payment history

### Events to Monitor
```javascript
contract.on('TaskCreated', (taskId, title, creator, reward) => {
  // Update database
});

contract.on('TaskCompleted', (taskId, assignee, reward) => {
  // Notify users, update leaderboard
});
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "USDC transfer failed" | Insufficient USDC approval | Call `approve()` on USDC contract first |
| "Task does not exist" | Invalid task ID | Verify task ID is correct |
| "Creator cannot be assignee" | Creator trying to assign to self | Use different account for contributor |
| "Reentrancy detected" | Function called recursively | This should not happen; indicates attack |

---

## Gas Optimization Notes

- Task creation: ~250k gas (includes USDC transfer)
- Task assignment: ~100k gas
- Task completion: ~150k gas (includes 2 USDC transfers + reentrancy check)

Consider gas prices when setting task deadlines (users want fast confirmation).

---

## Future Enhancements

1. **Task Disputes:** Add arbitration for incomplete work
2. **Ratings System:** Store creator/contributor ratings on-chain
3. **Task Milestones:** Break tasks into multiple payments
4. **Governance:** DAO for platform fee decisions
5. **Multi-token Support:** Accept ETH, stablecoins beyond USDC

---

## Summary

The BaseConnect contract provides a **secure, escrow-based task marketplace** with:
- ✅ Automatic payment distribution (90% contributor, 10% platform)
- ✅ Clear owner-defined platform (contract owner receives fees)
- ✅ Reentrancy protection and access controls
- ✅ Production-ready OpenZeppelin dependencies

**Platform Fee Recipient:** The contract owner address (set at deployment, changeable via `transferOwnership()`)

**Production Status:** Ready for deployment after security audit and testnet validation.

