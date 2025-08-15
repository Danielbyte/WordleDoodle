import {dirname, join} from 'path'
import { fileURLToPath } from 'url';
import { Router } from 'express';
const singlePlayerMainRouter = Router();

//Get file path from the URL of the current module
const __fileName = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirname = dirname(__fileName);

singlePlayerMainRouter.get('/', (req, res) => {
  res.send('Single player routes');
});

singlePlayerMainRouter.get('/gameBoard', (req, res) => {
  res.sendFile(join(__dirname, '../public/views', 'gameBoard.html')); //Display the game board
});

export default singlePlayerMainRouter;