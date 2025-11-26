import express from 'express';
import { verificationController } from '../controllers/verificationController.js';
import { authMiddleware } from '../routes/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All verification endpoints (public, but wallet-based)
router.get('/check/createProfile', verificationController.checkCreateProfile);
router.get('/check/connectWallet', verificationController.checkConnectWallet);
router.get('/check/referrals', verificationController.checkReferrals);

// POST to mark a verification complete and award points (requires auth)
router.post('/complete', authMiddleware, verificationController.completeVerification);

// POST to submit proof (screenshot/file) for manual verification
router.post('/submit', authMiddleware, upload.single('proof'), verificationController.submitProof);
router.get('/pending', authMiddleware, verificationController.getPendingRecords);

export default router;

