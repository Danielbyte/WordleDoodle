import { Router } from "express";
import authorize from '../middlewares/authMiddleWare.js';
import { createUserStats, getUserStats } from '../controllers/statisticsController.js';

const statisticsRouter = Router();

statisticsRouter.post('/', authorize, createUserStats);

statisticsRouter.get('/stats/:id', authorize, getUserStats);

export default statisticsRouter;