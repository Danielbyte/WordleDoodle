import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
const multiplayerMainRouter = Router();

//Get file path from the URL of the current module
const __fileName = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirname = dirname(__fileName);

//we want to display the multiplayer main route at default root folder
multiplayerMainRouter.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'mainMenu.html'));
})

export default multiplayerMainRouter;
