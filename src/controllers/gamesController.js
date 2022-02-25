import db_connection from "../database/connection.js";

export async function getGames(_, res) {
  try {
    const result = await db_connection.query(`
      SELECT * FROM games;
    `);

    return res.send(result.rows);
  } catch (error) {
    return res.status(500).send("Houve um erro interno no servidor");
  }
}
