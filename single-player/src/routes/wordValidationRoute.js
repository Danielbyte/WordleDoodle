import { Router } from "express";
//import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { validateWord, verifyWord, resetWordOfTheDay } from '../controllers/wordValidator.js';

const wordValidationRouter = Router();

wordValidationRouter.post('/validate', validateWord);
wordValidationRouter.post('/verify', verifyWord); //endpoint verifiies if guessed word is valid..
wordValidationRouter.post('/reset', resetWordOfTheDay);

export default wordValidationRouter;