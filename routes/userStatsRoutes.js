import { Router } from "express";
import authorize from '../middlewares/authMiddleWare.js';
import { getUserStats } from '../controllers/statisticsController.js';

const statisticsRouter = Router();

statisticsRouter.post('/', authorize, (req, res) => res.send({title: 'CREATE statistics'}));

statisticsRouter.get('/stats/:id', authorize, getUserStats);

export default statisticsRouter;