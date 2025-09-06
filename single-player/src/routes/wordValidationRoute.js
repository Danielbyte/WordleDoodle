import { Router } from "express";
//import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { validateWord, verifyWord, resetWordOfTheDay } from '../controllers/wordValidator.js';

const wordRouter = Router();

wordRouter.post('/validate', validateWord);
wordRouter.post('/verify', verifyWord); //endpoint verifiies if guessed word is valid..
wordRouter.post('/reset', resetWordOfTheDay);

export default wordRouter;