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
multiplayerRouter.get('/guest/board', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'guest-board.html'));
});

multiplayerRouter.get('/host/board', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'host-board.html'))
});

multiplayerRouter.get('/menu/create-room', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'create-room-menu.html'));
});

multiplayerRouter.get('/menu/join-room', (req, res) => {
  res.sendFile(join(__dirname, '../../client/public/views', 'join-room-menu.html'));
});

multiplayerRouter.post('/username/create', (req, res) => {
  try {
    const { username } = req.body;

    if (!username) return res.status(400).json({message: 'Username not found'});

    req.session.username = username;

    res.status(201).json({
      success: true,
      message: 'Username created successfully',
      redirectUrl: '/multiplayer/host/board'
    });

  } catch (error) {res.status(500).json({message: 'Error creating username', error});}
});

multiplayerRouter.get('/username', (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(400).json({message: 'Username not found'});

    req.session.username = username;

    res.status(201).json({
      success: true,
      username: username,
      message: 'Username retrieved successfully',
    });

  } catch (error) {res.status(500).json({message: 'Error getting username', error});}
});

export default multiplayerRouter;
