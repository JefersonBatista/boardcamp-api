import { Router } from "express";

import categoriesRouter from "./categoriesRouter.js";

const routes = Router();

routes.use(categoriesRouter);

export default routes;
