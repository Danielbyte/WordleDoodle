import { Router } from "express";

const authRouter = Router();

authRouter.post('/register', (req, res) => {
  res.send({title: 'resgister'})
});

authRouter.post('/login', (req, res) => {
  res.send({title: 'login'})
});

authRouter.post('/logout', (req, res) => {
  res.send({title: 'logout'})
});

export default authRouter;