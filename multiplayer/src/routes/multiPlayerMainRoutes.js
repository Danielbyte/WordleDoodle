import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
const multiplayerMainRouter = Router();

//Get file path from the URL of the current module
const __fileName = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirname = dirname(__fileName);

multiplayerMainRouter.get('/', (req, res) => {
  res.send('Multiplayer route');
})

//Serve the main menu of multiplayer
multiplayerMainRouter.get('/multiplayerMain', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'mainMenu.html'));
});

multiplayerMainRouter.get('/player-board', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'board.html'))
})

export default multiplayerMainRouter;
