import { Server } from 'socket.io';
import { createServer } from 'https';
const httpsServer = createServer();
import { PORT } from '../../config/env.js'; //The port from environment variables

const io = new Server(httpsServer, {
  cors: {
    //In the event that the website url is know, will have multiple cors here => origin [PORT, https://appDomainUrl.com]
    //For now, the following environment variable is enough
    origin: PORT
  }
});

//Some event listeners for the server
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`); //Id of the connected socket
});