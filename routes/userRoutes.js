import { Router } from 'express';
import { getUser, getUserStats } from '../controllers/userController.js';
import authorize from '../middlewares/authMiddleWare.js';

const userRouter = Router();

userRouter.get('/:id', authorize, getUser); //get user info

userRouter.get('/stats/:id', authorize, getUserStats);

userRouter.post('/', (req, res) => {
  res.send({title: 'CREATE new user'})
});

userRouter.put('/:id', (req, res) => {
  res.send({title: 'UPDATE user info'})
});

userRouter.delete('/:id', (req, res) => {
  res.send({title: 'DELETE user'})
});

export default userRouter;