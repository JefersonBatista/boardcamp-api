import { Router } from "express";

import helloRouter from "./helloRouter.js";

const routes = Router();

routes.use(helloRouter);

export default routes;
