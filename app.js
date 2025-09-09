import express from 'express'
import { PORT } from './config/env.js';
import { dirname, join} from 'path';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';

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

//Load routes/modules
import singlePlayerRouter from './single-player/src/routes/singlePlayerMainRoutes.js';
import multiplayerRouter from './multiplayer/src/routes/multiPlayerRoutes.js';
import wordRouter from './single-player/src/routes/wordValidationRoute.js';
import handleSocketEvent from './sockets/webSocketServer.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import homePageRoute from './routes/homePageRoutes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleWare from './middlewares/errorMiddleWare.js';
import arcjetMiddleware from './middlewares/arcjetMiddleware.js';
import statisticsRoute from './routes/userStatsRoutes.js';
import otpRouter from './routes/otpRoutes.js';


//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(arcjetMiddleware)

//Tell express to serve the files from the public directory as static files
app.use('/cdn',express.static(join(__dirname, './single-player/src/public')));
app.use('/cdn',express.static(join(__dirname, './public')));

//Tell Express to serve files in ./multiplayer/client/public as static files
app.use('/cdn',express.static(join(__dirname, './multiplayer/client/public')));

//Mount routes
app.use('/', homePageRoute); //Display the landing page when app is opened
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/singleplayer', singlePlayerRouter);
app.use('/', multiplayerRouter);
app.use('/api/v1/word', wordRouter);
app.use('/api/v1/statistics', statisticsRoute);
app.use('/api/v1/otp', otpRouter);


app.use(errorMiddleWare);

//Handle web socket events
io.on('connection', (socket) => {
  handleSocketEvent(io, socket);
});

server.listen(PORT, async () => {
  console.log(`Server listening on PORT: ${PORT}`);

  await connectToDatabase();
});

export default app;
