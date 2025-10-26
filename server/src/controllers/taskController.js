import { Task } from '../models/task.js';

export const taskController = {
  // Get all tasks
  async getAllTasks(req, res) {
    try {
      const filter = {};
      if (req.query.creator) filter.creator = req.query.creator;
      if (req.query.assignee) filter.assignee = req.query.assignee;
      if (req.query.status) filter.status = req.query.status;
      const tasks = await Task.find(filter);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single task
  async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a task
  async createTask(req, res) {
    const task = new Task(req.body);
    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a task
  async updateTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      Object.assign(task, req.body);
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      await task.remove();
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};