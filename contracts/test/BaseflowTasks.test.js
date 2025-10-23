const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BaseflowTasks", function () {
  let BaseflowTasks;
  let baseflowTasks;
  let owner;
  let creator;
  let worker;

  beforeEach(async function () {
    [owner, creator, worker] = await ethers.getSigners();
    BaseflowTasks = await ethers.getContractFactory("BaseflowTasks");
    baseflowTasks = await BaseflowTasks.deploy();
    await baseflowTasks.deployed();
  });

  describe("Task Creation", function () {
    it("Should create a task with correct parameters", async function () {
      const title = "Test Task";
      const description = "Test Description";
      const reward = ethers.utils.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

      await expect(
        baseflowTasks.connect(creator).createTask(title, description, deadline, {
          value: reward,
        })
      )
        .to.emit(baseflowTasks, "TaskCreated")
        .withArgs(1, title, creator.address, reward);

      const task = await baseflowTasks.getTask(1);
      expect(task.title).to.equal(title);
      expect(task.description).to.equal(description);
      expect(task.reward).to.equal(reward);
      expect(task.creator).to.equal(creator.address);
      expect(task.status).to.equal(0); // PENDING
    });
  });

  describe("Task Assignment", function () {
    beforeEach(async function () {
      await baseflowTasks.connect(creator).createTask(
        "Test Task",
        "Test Description",
        Math.floor(Date.now() / 1000) + 86400,
        { value: ethers.utils.parseEther("1") }
      );
    });

    it("Should allow a worker to accept a task", async function () {
      await expect(baseflowTasks.connect(worker).assignTask(1))
        .to.emit(baseflowTasks, "TaskAssigned")
        .withArgs(1, worker.address);

      const task = await baseflowTasks.getTask(1);
      expect(task.assignee).to.equal(worker.address);
      expect(task.status).to.equal(1); // IN_PROGRESS
    });
  });
});