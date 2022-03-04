import joi from "joi";

const rentalSchema = joi.object({
  customerId: joi.number().integer().min(1),
  gameId: joi.number().integer().min(1),
  daysRented: joi.number().integer().min(1),
});

export default rentalSchema;
