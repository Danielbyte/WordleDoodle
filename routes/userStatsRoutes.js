import { Router } from "express";
import authorize from '../middlewares/authMiddleWare.js';
import { createUserStats, getUserStats } from '../controllers/statisticsController.js';

const statisticsRouter = Router();

statisticsRouter.post('/', authorize, createUserStats);

statisticsRouter.get('/stats/:id', authorize, getUserStats);

statisticsRouter.put('/:id', (req, res) => res.send({title: 'UPDATE statistics'}));

statisticsRouter.delete('/:id', (req, res) => res.send({title: 'DELETE user statistics'}));

export default statisticsRouter;