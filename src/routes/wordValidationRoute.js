import { Router } from "express";
import { getWordOfTheDay } from '../controllers/wordFetcher.js'

const wordValidationRouter = Router();

wordValidationRouter.get('/', getWordOfTheDay);

export default wordValidationRouter;