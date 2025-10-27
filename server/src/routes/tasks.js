import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { authMiddleware, roleMiddleware } from './auth.js';

const router = express.Router();

// Get all tasks (filter by query params)
router.get('/', taskController.getAllTasks);

// Get applicants for a task (creators only)
router.get('/:id/applicants', 
  authMiddleware,
  roleMiddleware(['creator']),
  taskController.getTaskApplicants
);

// Check if user has applied (contributors only)
router.get('/:id/check-application', 
  authMiddleware,
  roleMiddleware(['contributor']),
  taskController.checkApplication
);

// Get a single task - MUST come after specific routes
router.get('/:id', taskController.getTaskById);

// Create a task (only creators)
router.post('/', 
  authMiddleware,
  roleMiddleware(['creator']),
  taskController.createTask
);

// Apply for a task (contributors only)
router.post('/:id/apply', 
  authMiddleware,
  roleMiddleware(['contributor']),
  taskController.applyForTask
);

// Submit work for a task (contributors only)
router.post('/:id/submit', 
  authMiddleware,
  roleMiddleware(['contributor']),
  taskController.submitWork
);

// Accept an applicant (creators only)
router.post('/:id/accept', 
  authMiddleware,
  roleMiddleware(['creator']),
  taskController.acceptApplicant
);

// Update a task (must be authenticated)
router.put('/:id', authMiddleware, taskController.updateTask);

// Delete a task (must be authenticated)
router.delete('/:id', authMiddleware, taskController.deleteTask);

export default router;