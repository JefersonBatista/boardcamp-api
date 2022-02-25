import db_connection from "../database/connection.js";

export async function getCategories(_, res) {
  try {
    const result = await db_connection.query(`
      SELECT * FROM categories;
    `);

    return res.send(result.rows);
  } catch (error) {
    return res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;

  try {
    const categories = await db_connection.query(
      `
      SELECT * FROM categories WHERE name=$1;
    `,
      [name]
    );

    if (categories.rows.length > 0) {
      return res.status(409).send("Já existe uma categoria com esse nome");
    }

    await db_connection.query(
      `
      INSERT INTO categories (name) VALUES ($1);
    `,
      [name]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send("Houve um erro interno no servidor");
  }
}
