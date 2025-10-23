// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BaseflowTasks is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _taskIds;

    struct Task {
        uint256 id;
        string title;
        string description;
        address creator;
        address assignee;
        uint256 reward;
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
    event TaskCompleted(uint256 indexed taskId, address indexed assignee);
    event TaskCancelled(uint256 indexed taskId);

    constructor() Ownable(msg.sender) {}

    function createTask(
        string memory title,
        string memory description,
        uint256 deadline
    ) external payable returns (uint256) {
        require(msg.value > 0, "Task must have a reward");
        require(deadline > block.timestamp, "Deadline must be in the future");

        _taskIds.increment();
        uint256 taskId = _taskIds.current();

        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: address(0),
            reward: msg.value,
            deadline: deadline,
            status: TaskStatus.PENDING,
            exists: true
        });

        userTasks[msg.sender].push(taskId);
        emit TaskCreated(taskId, title, msg.sender, msg.value);
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

    function completeTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.exists, "Task does not exist");
        require(task.status == TaskStatus.IN_PROGRESS, "Task not in progress");
        require(task.assignee == msg.sender, "Not the assignee");

        task.status = TaskStatus.COMPLETED;
        payable(msg.sender).transfer(task.reward);

        emit TaskCompleted(taskId, msg.sender);
    }

    function cancelTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.exists, "Task does not exist");
        require(task.creator == msg.sender, "Not the creator");
        require(task.status == TaskStatus.PENDING, "Task already in progress");

        task.status = TaskStatus.CANCELLED;
        payable(msg.sender).transfer(task.reward);

        emit TaskCancelled(taskId);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        require(tasks[taskId].exists, "Task does not exist");
        return tasks[taskId];
    }

    function getUserTasks(address user) external view returns (uint256[] memory) {
        return userTasks[user];
    }
}