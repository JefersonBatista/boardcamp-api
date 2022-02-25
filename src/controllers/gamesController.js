import db_connection from "../database/connection.js";

export async function getGames(_, res) {
  try {
    const result = await db_connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id;`
    );

    return res.send(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createGame(req, res) {
  const newGame = req.body;

  try {
    const category = await db_connection.query(
      `SELECT * FROM categories WHERE id=$1`,
      [newGame.categoryId]
    );

    if (category.rows.length === 0) {
      return res.status(400).send("Não existe categoria com o id especificado");
    }

    const games = await db_connection.query(
      `SELECT * FROM games WHERE name=$1`,
      [newGame.name]
    );

    if (games.rows.length > 0) {
      return res.status(409).send("Já existe um jogo com esse nome");
    }

    await db_connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)`,
      Object.values(newGame)
    );

    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}
