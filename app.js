import express from 'express'
import { PORT } from './config/env.js';
import { dirname, join} from 'path'

import { fileURLToPath } from 'url';

// Recreate __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//Load routes
import singlePlayerRouter from './single-player/src/routes/singlePlayerMainRoutes.js';
import multiplayerMainRouter from './multiplayer/src/routes/multiPlayerMainRoutes.js';
import wordValidationRouter from './single-player/src/routes/wordValidationRoute.js';


//MIDDLEWARE
app.use(express.json());
//Tell express to serve the files from the public directory as static files
app.use('/cdn',express.static(join(__dirname, './single-player/src/public')));

//Tell Express to serve files in ./multiplayer/client/public as static files
app.use('/cdn',express.static(join(__dirname, './multiplayer/client/public')));

//Mount routes
app.use('/',singlePlayerRouter); //We want to call the landing page instead (but for now will just serve the single player router)
app.use('/mainMenu', multiplayerMainRouter);
app.use('/api/v1', wordValidationRouter);
app.use('/api/v1/validate', wordValidationRouter);
app.use('/api/v1/verify', wordValidationRouter);
app.use('/api/v1/reset', wordValidationRouter);

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

export default app;
