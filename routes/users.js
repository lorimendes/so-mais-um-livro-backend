import express from 'express';
import { getLoggedUser } from '../controllers/users.js';

const usersRouter = express.Router();

usersRouter.get('/me', getLoggedUser);

export default usersRouter;
