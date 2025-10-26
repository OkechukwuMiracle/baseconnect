import express from 'express';
import { taskController } from '../controllers/taskController.js';

const router = express.Router();

// Get all tasks (filter by query params)
router.get('/', taskController.getAllTasks);

// Get a single task
router.get('/:id', taskController.getTaskById);

// Create a task (only creators)
router.post('/', (req,res,next)=>{
  if(req.user?.role !== 'creator') return res.status(403).json({ message: 'Only creators can create tasks' });
  next();
}, taskController.createTask);

// Update a task (must be owner or admin)
router.put('/:id', taskController.updateTask);

// Delete a task (must be owner or admin)
router.delete('/:id', taskController.deleteTask);

export default router;