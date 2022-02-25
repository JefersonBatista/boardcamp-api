import { Router } from "express";

import validateSchema from "../middlewares/schemaValidation.js";
import categorySchema from "../schemas/categorySchema.js";
import {
  getCategories,
  createCategory,
} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post(
  "/categories",
  validateSchema(categorySchema),
  createCategory
);

export default categoriesRouter;
