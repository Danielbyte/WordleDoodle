import { Router } from 'express';
import { verifyOTP, resendOTP, serveOtpForm } from '../controllers/otpController.js';
import authorize from '../middlewares/authMiddleWare.js';

const otpRouter = Router();

otpRouter.post('/verify', verifyOTP);
otpRouter.post('/resend', resendOTP);
otpRouter.post('/form/serve', authorize, serveOtpForm);

export default otpRouter;