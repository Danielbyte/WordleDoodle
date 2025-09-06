import { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const homePageRoute = Router();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

homePageRoute.get('/', (req, res) => {
  //Respond with the landing page
  res.sendFile(join(__dirname, '../public/views', 'landing-page.html'));
});

homePageRoute.get('/register', (req, res) => {
  res.sendFile(join(__dirname, '../public/views', 'user-registration.html'));
});

export default homePageRoute;