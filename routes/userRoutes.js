import { Router } from "express";
import { getUser} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/:id', getUser); //get user stats

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