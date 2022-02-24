import { Router } from "express";

import { hello } from "../controllers/helloController.js";

const helloRouter = Router();

helloRouter.get("/hello", hello);

export default helloRouter;
