import { Router } from "express";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const authRouter = Router();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

authRouter.get('/', (req, res) => {
  //Respond with the landing page
  res.sendFile(join(__dirname, '../public/views/landingPage.html'));
});

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