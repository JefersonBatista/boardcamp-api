import db_connection from "../db.js";

export async function getCategories(_, res) {
  const result = await db_connection.query(`
    SELECT * FROM categories;
  `);

  return res.send(result.rows);
}
