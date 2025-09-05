import { Router } from "express";
import { register, login, logout } from '../controllers/authController.js'

const authRouter = Router();

//Path: /api/v1/auth/register
authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', logout);

export default authRouter;