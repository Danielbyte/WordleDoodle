import { Router } from "express";

const wordValidationRouter = Router();

wordValidationRouter.post('/validate', (req, res) => res.send({title: 'Word validation'}));

export default wordValidationRouter;