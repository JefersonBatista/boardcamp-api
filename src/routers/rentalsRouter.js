import { Router } from "express";

import { createRental, getRentals } from "../controllers/rentalsController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);

export default rentalsRouter;
