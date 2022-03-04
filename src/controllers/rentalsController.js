import dbConnection from "../database/connection.js";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

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
