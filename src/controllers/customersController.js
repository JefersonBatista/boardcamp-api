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

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const result = await db_connection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [id]
    );

    const [customer] = result.rows;

    if (!customer) {
      return res.status(404).send("Não há cliente com esse id");
    }

    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}
