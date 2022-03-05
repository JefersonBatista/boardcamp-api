import { Router } from "express";

import {
  createRental,
  deleteRental,
  finalizeRental,
  getRentals,
} from "../controllers/rentalsController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);
rentalsRouter.post("/rentals/:id/return", finalizeRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
