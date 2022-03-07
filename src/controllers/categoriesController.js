import dbConnection from "../database/connection.js";

export async function getCategories(req, res) {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);

  try {
    const result = await dbConnection.query(
      `SELECT * FROM categories OFFSET $1 LIMIT $2;`,
      [offset ? offset : null, limit ? limit : null]
    );

    return res.send(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;

  try {
    const categoriesResult = await dbConnection.query(
      `SELECT * FROM categories WHERE name=$1;`,
      [name]
    );

    if (categoriesResult.rowCount > 0) {
      return res.status(409).send("Já existe uma categoria com esse nome");
    }

    await dbConnection.query(`INSERT INTO categories (name) VALUES ($1);`, [
      name,
    ]);

    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}
