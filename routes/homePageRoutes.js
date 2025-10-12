import { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import authorizePage from "../middlewares/formMiddleware.js";

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

homePageRoute.get('/register/otp/verify', authorizePage, (req, res) => {
  res.sendFile(join(__dirname, '../public/views', 'otp-verification.html'));
});

homePageRoute.get('/menu', authorizePage, (req, res) => {
  res.sendFile(join(__dirname, '../public/views', 'main-menu.html'));
});

homePageRoute.get('/guest-menu', (req, res) => {
  res.sendFile(join(__dirname, '../public/views', 'guest-page.html'));
});

export default homePageRoute;