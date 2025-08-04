import { Router } from "express";
//import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { validateWord } from '../controllers/wordValidator.js'

const wordValidationRouter = Router();

wordValidationRouter.get('/', (req, res) => {res.send({word: 'Get word of the day'})});
wordValidationRouter.post('/validate', validateWord);

export default wordValidationRouter;