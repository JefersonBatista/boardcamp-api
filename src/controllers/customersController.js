import db_connection from "../database/connection.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (!cpf) {
      const result = await db_connection.query(`
      SELECT * FROM customers;`);

      res.send(result.rows);
    } else {
      const result = await db_connection.query(
        `SELECT * FROM customers WHERE cpf LIKE '${cpf}%';`
      );

      res.send(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}
