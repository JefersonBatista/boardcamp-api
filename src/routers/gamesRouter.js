import { Router } from "express";

import validateSchema from "../middlewares/schemaValidation.js";
import gameSchema from "../schemas/gameSchema.js";
import { createGame, getGames } from "../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), createGame);

export default gamesRouter;
