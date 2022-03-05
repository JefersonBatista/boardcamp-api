import dbConnection from "../database/connection.js";

export async function getRentals(req, res) {
  const customerId = parseInt(req.query.customerId);
  const gameId = parseInt(req.query.gameId);

  try {
    const rentalsResult = await dbConnection.query(
      `SELECT
        rentals.*,
        customers.name AS "customerName",
        games.name AS "gameName", "categoryId",
        categories.name AS "categoryName"
      FROM rentals
        JOIN customers ON rentals."customerId"=customers.id
        JOIN games ON rentals."gameId"=games.id
        JOIN categories ON games."categoryId"=categories.id;`
    );

    const rentals = rentalsResult.rows
      .filter((rental) => !customerId || rental.customerId === customerId)
      .filter((rental) => !gameId || rental.gameId === gameId)
      .map((rental) => {
        const {
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
        } = rental;
        const { customerName } = rental;
        const { gameName, categoryId, categoryName } = rental;

        return {
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          customer: {
            id: customerId,
            name: customerName,
          },
          game: {
            id: gameId,
            name: gameName,
            categoryId,
            categoryName,
          },
        };
      });

    res.send(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const returnDate = null;
  const delayFee = null;

  try {
    const customerResult = await dbConnection.query(
      `SELECT * FROM customers WHERE id=$1;`,
      [customerId]
    );

    if (customerResult.rowCount < 1) {
      return res
        .status(400)
        .send("Nenhum cliente cadastrado com o ID especificado");
    }

    const gameResult = await dbConnection.query(
      `SELECT * FROM games WHERE id=$1;`,
      [gameId]
    );

    if (gameResult.rowCount < 1) {
      return res
        .status(400)
        .send("Nenhum jogo cadastrado com o ID especificado");
    }

    const [game] = gameResult.rows;

    const openRentalsResult = await dbConnection.query(
      `SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`,
      [gameId]
    );

    if (openRentalsResult.rowCount === game.stockTotal) {
      return res
        .status(400)
        .send("Não há mais unidades disponíveis do jogo especificado");
    }

    const rentDate = new Date().toISOString().slice(0, 10);
    const originalPrice = game.pricePerDay * daysRented;

    await dbConnection.query(
      `INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate",
         "originalPrice", "delayFee")
        VALUES
        ($1, $2, $3, $4, $5, $6, $7);`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function finalizeRental(req, res) {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).send("O ID especificado não é válido");
  }

  try {
    const rentalResult = await dbConnection.query(
      `SELECT * FROM rentals WHERE id=$1`,
      [id]
    );

    if (rentalResult.rowCount < 1) {
      return res
        .status(404)
        .send("Nenhum aluguel registrado com o ID especificado");
    }

    const [rental] = rentalResult.rows;
    if (rental.returnDate) {
      return res.status(400).send("Este aluguel já foi finalizado");
    }

    const returnDate = new Date().toISOString().slice(0, 10);

    const rentalDaysResult = await dbConnection.query(
      `SELECT DATE_PART('day',$1::TIMESTAMP - $2::TIMESTAMP) AS days;`,
      [returnDate, rental.rentDate]
    );

    const rentalDays = rentalDaysResult.rows[0].days;
    const delayDays = rentalDays - rental.daysRented;
    const pricePerDay = rental.originalPrice / rental.daysRented;
    const delayFee = delayDays < 1 ? 0 : delayDays * pricePerDay;

    await dbConnection.query(
      `UPDATE rentals
        SET "returnDate"=$2, "delayFee"=$3
      WHERE id=$1`,
      [id, returnDate, delayFee]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}
