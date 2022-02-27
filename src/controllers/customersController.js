import dbConnection from "../database/connection.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (!cpf) {
      const result = await dbConnection.query(`
      SELECT * FROM customers;`);

      res.send(result.rows);
    } else {
      const result = await dbConnection.query(
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
    const result = await dbConnection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [id]
    );

    const [customer] = result.rows;

    if (!customer) {
      return res.status(404).send("Não há cliente com esse ID");
    }

    res.send(customer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customers = await dbConnection.query(
      `SELECT * FROM customers WHERE cpf=$1;`,
      [cpf]
    );

    if (customers.rows.length > 0) {
      return res
        .status(409)
        .send("Já existe um cliente cadastrado com esse CPF");
    }

    await dbConnection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}
