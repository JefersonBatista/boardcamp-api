import { Router } from "express";

import {
  getCustomers,
  getCustomerById,
} from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);

export default customersRouter;
