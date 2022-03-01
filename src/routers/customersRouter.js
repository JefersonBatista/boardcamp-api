import { Router } from "express";

import validateSchema from "../middlewares/schemaValidation.js";
import customerSchema from "../schemas/customerSchema.js";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post(
  "/customers",
  validateSchema(customerSchema),
  createCustomer
);
customersRouter.put(
  "/customers/:id",
  validateSchema(customerSchema),
  updateCustomer
);

export default customersRouter;
