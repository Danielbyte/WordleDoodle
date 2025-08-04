import { Router } from "express";
import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { validateWord } from '../controllers/wordValidator.js'

const wordValidationRouter = Router();

wordValidationRouter.get('/', getWordOfTheDay);
wordValidationRouter.post('/validate', validateWord);

export default wordValidationRouter;