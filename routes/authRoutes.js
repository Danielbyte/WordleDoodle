import { Router } from "express";
import { register, login, logout, mainMenu } from '../controllers/authController.js'
import authorize from "../middlewares/authMiddleWare.js";

const authRouter = Router();

//Path: /api/v1/auth/register
authRouter.post('/register', register);

//Path: /api/v1/auth/login
authRouter.post('/login', login);

//Path: /api/v1/auth/logout
authRouter.post('/logout', logout);

authRouter.post('/menu', authorize, mainMenu);

export default authRouter;