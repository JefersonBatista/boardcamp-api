export default function validateSchema(schema) {
  return (req, res, next) => {
    const object = req.body;

    const validation = schema.validate(object);
    if (validation.error) {
      return res
        .status(400)
        .send("Por favor, preencha todos os campos corretamente");
    }

    next();
  };
}
