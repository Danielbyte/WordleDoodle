import { Router } from "express";
import { register, login, logout } from '../controllers/authController.js'

const authRouter = Router();

//Path: /api/v1/auth/register
authRouter.post('/register', register);

//Path: /api/v1/auth/login
authRouter.post('/login', login);

//Path: /api/v1/auth/logout
authRouter.post('/logout', logout);

export default authRouter;