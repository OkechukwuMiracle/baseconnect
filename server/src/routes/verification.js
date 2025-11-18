import express from 'express';
import { verificationController } from '../controllers/verificationController.js';

const router = express.Router();

// All verification endpoints (public, but wallet-based)
router.get('/check/createProfile', verificationController.checkCreateProfile);
router.get('/check/connectWallet', verificationController.checkConnectWallet);
router.get('/check/connectSocial', verificationController.checkConnectSocial);
router.get('/check/identityGraphComplete', verificationController.checkIdentityGraphComplete);
router.get('/check/referrals', verificationController.checkReferrals);
router.get('/check/followCount', verificationController.checkFollowCount);
router.get('/check/interestGraphComplete', verificationController.checkInterestGraphComplete);
router.get('/check/badgeClaim', verificationController.checkBadgeClaim);
router.get('/check/partnerQuest', verificationController.checkPartnerQuest);

export default router;

