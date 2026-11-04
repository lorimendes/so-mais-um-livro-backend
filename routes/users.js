import { getLoggedUser } from "../controllers/users.js";
import express from "express";
const usersRouter = express.Router();

usersRouter.get("/me", getLoggedUser);

export default usersRouter;
