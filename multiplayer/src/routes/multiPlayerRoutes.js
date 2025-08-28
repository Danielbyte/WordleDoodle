import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
const multiplayerRouter = Router();

//Get file path from the URL of the current module
const __fileName = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirname = dirname(__fileName);

multiplayerRouter.get('/', (req, res) => {
  res.send('Multiplayer route');
})

//Serve the main menu of multiplayer
multiplayerRouter.get('/guest-board', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'guestBoard.html'));
});

multiplayerRouter.get('/host-board', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'host-board.html'))
})

export default multiplayerRouter;
