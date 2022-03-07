import dbConnection from "../database/connection.js";

export async function getGames(req, res) {
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);

  try {
    const result = await dbConnection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games
        JOIN categories ON games."categoryId"=categories.id
      OFFSET $1 LIMIT $2;`,
      [offset ? offset : null, limit ? limit : null]
    );

    return res.send(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    const categoryResult = await dbConnection.query(
      `SELECT * FROM categories WHERE id=$1`,
      [categoryId]
    );

    if (categoryResult.rowCount === 0) {
      return res.status(400).send("Não existe categoria com o ID especificado");
    }

    const gamesResult = await dbConnection.query(
      `SELECT * FROM games WHERE name=$1`,
      [name]
    );

    if (gamesResult.rowCount > 0) {
      return res.status(409).send("Já existe um jogo com esse nome");
    }

    await dbConnection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Houve um erro interno no servidor");
  }
}
