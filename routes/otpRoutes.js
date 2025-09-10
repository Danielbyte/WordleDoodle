import { Router } from 'express';
import { verifyOTP, resendOTP } from '../controllers/otpController.js';

const otpRouter = Router();

otpRouter.post('/verify', verifyOTP);
otpRouter.post('/resend', resendOTP);

export default otpRouter;