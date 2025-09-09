import { Router } from 'express';
import { verifyOTP } from '../controllers/otpController.js';

const otpRouter = Router();

otpRouter.post('/verify', verifyOTP);

export default otpRouter;