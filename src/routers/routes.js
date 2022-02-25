import { Router } from "express";

import categoriesRouter from "./categoriesRouter.js";
import gamesRouter from "./gamesRouter.js";

const routes = Router();

routes.use(categoriesRouter);
routes.use(gamesRouter);

export default routes;
