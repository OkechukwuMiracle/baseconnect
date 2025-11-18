import express from 'express';
import { waitlistController } from '../controllers/waitlistController.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Get all waitlist tasks (public)
router.get('/tasks', waitlistController.getAllTasks);

// Get user's progress (protected)
router.get('/progress', authMiddleware, waitlistController.getProgress);

// Verify a task completion (protected)
router.post('/tasks/:taskId/verify', authMiddleware, waitlistController.verifyTask);

export default router;

