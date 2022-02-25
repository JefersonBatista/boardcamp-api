import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().uri().required(),
  stockTotal: joi.number().integer().min(1),
  categoryId: joi.number().integer().min(1),
  pricePerDay: joi.number().integer().min(1),
});

export default gameSchema;
