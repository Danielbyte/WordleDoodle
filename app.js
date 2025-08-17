import express from 'express'
import { PORT } from './config/env.js';
import { dirname, join} from 'path';
import http from 'http';
import { Server } from 'socket.io';

import { fileURLToPath } from 'url';

// Recreate __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);//Create an HTTP server from Express

//Attach Socket.IO to HTTP server above
const io = new Server(server, {
  cors: {
    origin: PORT //For now, allow the PORT as an origin(should add the application domain)
  }
});

//Load routes
import singlePlayerRouter from './single-player/src/routes/singlePlayerMainRoutes.js';
import multiplayerMainRouter from './multiplayer/src/routes/multiPlayerMainRoutes.js';
import wordValidationRouter from './single-player/src/routes/wordValidationRoute.js';
import handleSocketEvent from './sockets/webSocketServer.js';


//MIDDLEWARE
app.use(express.json());
//Tell express to serve the files from the public directory as static files
app.use('/cdn',express.static(join(__dirname, './single-player/src/public')));

//Tell Express to serve files in ./multiplayer/client/public as static files
app.use('/cdn',express.static(join(__dirname, './multiplayer/client/public')));

//Mount routes
app.use('/',singlePlayerRouter); //We want to call the landing page instead (but for now will just serve the single player router)
app.use('/', multiplayerMainRouter);
app.use('/api/v1', wordValidationRouter);
app.use('/api/v1/validate', wordValidationRouter);
app.use('/api/v1/verify', wordValidationRouter);
app.use('/api/v1/reset', wordValidationRouter);

//Handle web socket events
io.on('connection', (socket) => {
  handleSocketEvent(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

export default app;
