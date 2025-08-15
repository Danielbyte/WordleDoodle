import express from 'express'
import { PORT } from './config/env.js';
import path from 'path'

import { fileURLToPath } from 'url';

// Recreate __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Load routes
import singlePlayerRouter from './single-player/src/routes/singlePlayerMainRoutes.js';
import wordValidationRouter from './single-player/src/routes/wordValidationRoute.js';


//MIDDLEWARE
app.use(express.json());
//Tell express to serve the files from the public directory as static files
app.use(express.static(path.join(__dirname, './single-player/src/public')));

//Mount routes
app.use('/',singlePlayerRouter); //We want to call the landing page instead (but for now will just serve the single player router)
app.use('/api/v1', wordValidationRouter);
app.use('/api/v1/validate', wordValidationRouter);
app.use('/api/v1/verify', wordValidationRouter);

app.listen(PORT, () => {
  console.log(`Server started on: http://localhost:${PORT}`);
});

export default app;
