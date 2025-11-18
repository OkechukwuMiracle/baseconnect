// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BaseflowTasksUSDC is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _taskIds;

    // USDC contract addresses
    IERC20 public immutable usdcToken;

    struct Task {
        uint256 id;
        string title;
        string description;
        address creator;
        address assignee;
        uint256 reward; // in USDC (6 decimals)
        uint256 deadline;
        TaskStatus status;
        bool exists;
    }

    enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userTasks;

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

    constructor(address _usdcAddress) Ownable() {
        usdcToken = IERC20(_usdcAddress);
    }

    /**
     * @notice Create a new task with USDC escrow
     * @param title Task title
     * @param description Task description
     * @param deadline Task deadline timestamp
     * @param reward Amount of USDC to escrow (in USDC's 6 decimals)
     */
    function createTask(
        string memory title,
        string memory description,
        uint256 deadline,
        uint256 reward
    ) external returns (uint256) {
        require(reward > 0, "Task must have a reward");
        require(deadline > block.timestamp, "Deadline must be in the future");

        // Transfer USDC from creator to contract (escrow)
        require(
            usdcToken.transferFrom(msg.sender, address(this), reward),
            "USDC transfer failed"
        );

        _taskIds.increment();
        uint256 taskId = _taskIds.current();

        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: address(0),
            reward: reward,
            deadline: deadline,
            status: TaskStatus.PENDING,
            exists: true
        });

        userTasks[msg.sender].push(taskId);
        emit TaskCreated(taskId, title, msg.sender, reward);
        return taskId;
    }

    function assignTask(uint256 taskId) external {
        require(tasks[taskId].exists, "Task does not exist");
        require(tasks[taskId].status == TaskStatus.PENDING, "Task not available");
        require(tasks[taskId].creator != msg.sender, "Creator cannot be assignee");

        tasks[taskId].assignee = msg.sender;
        tasks[taskId].status = TaskStatus.IN_PROGRESS;
        userTasks[msg.sender].push(taskId);

        emit TaskAssigned(taskId, msg.sender);
    }

    /**
     * @notice Complete task and release USDC payment
     * @param taskId Task ID
     * @param contributor Contributor address to receive payment
     */
    function completeTask(uint256 taskId, address contributor) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.exists, "Task does not exist");
        require(task.status == TaskStatus.IN_PROGRESS, "Task not in progress");
        require(task.creator == msg.sender, "Only creator can approve completion");
        require(task.assignee == contributor, "Invalid contributor");

        uint256 platformFee = (task.reward * 10) / 100; // 10% platform fee
        uint256 contributorReward = task.reward - platformFee;

        task.status = TaskStatus.COMPLETED;
        
        // Transfer USDC reward to contributor (minus platform fee)
        require(
            usdcToken.transfer(contributor, contributorReward),
            "Contributor payment failed"
        );
        
        // Transfer platform fee to contract owner
        require(
            usdcToken.transfer(owner(), platformFee),
            "Platform fee transfer failed"
        );

        emit TaskCompleted(taskId, contributor, contributorReward);
        emit SubmissionApproved(taskId, contributor, contributorReward);
    }

    function cancelTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.exists, "Task does not exist");
        require(task.creator == msg.sender, "Not the creator");
        require(task.status == TaskStatus.PENDING, "Task already in progress");

        task.status = TaskStatus.CANCELLED;
        
        // Refund USDC to creator
        require(
            usdcToken.transfer(msg.sender, task.reward),
            "Refund failed"
        );

        emit TaskCancelled(taskId);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        require(tasks[taskId].exists, "Task does not exist");
        return tasks[taskId];
    }

    function getUserTasks(address user) external view returns (uint256[] memory) {
        return userTasks[user];
    }

    /**
     * @notice Get USDC balance of this contract
     */
    function getContractBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
}