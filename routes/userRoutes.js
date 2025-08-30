import { Router } from "express";

const userRouter = Router();

userRouter.get('/:id', (req, res) => {
  res.send({title: 'GET user stats'}) //User stats
});

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