import { Router } from "express";
//import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { validateWord } from '../controllers/wordValidator.js';

const wordValidationRouter = Router();

wordValidationRouter.post('/validate', validateWord);
//wordValidationRouter.post('/verify', verifyWord); //endpoint verifiies if guessed word is valid An overkill (Will do this verification on the client side for optimization)

export default wordValidationRouter;