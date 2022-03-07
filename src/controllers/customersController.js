import dbConnection from "../database/connection.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);
  const { order, desc } = req.query;

  const orderColumn = ["id", "name", "phone", "cpf", "birthday"].includes(order)
    ? `"${order}"`
    : "id";

  const descStr = desc && desc !== "false" && desc !== "0" ? " DESC" : "";
  const orderStr = orderColumn + descStr;

  try {
    if (!cpf) {
      const result = await dbConnection.query(
        `SELECT * FROM customers ORDER BY ${orderStr} OFFSET $1 LIMIT $2;`,
        [offset ? offset : null, limit ? limit : null]
      );

      res.send(result.rows);
    } else {
      const result = await dbConnection.query(
        `SELECT * FROM customers WHERE cpf LIKE $1 ORDER BY ${orderStr} OFFSET $2 LIMIT $3;`,
        [`${cpf}%`, offset ? offset : null, limit ? limit : null]
      );

      res.send(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}

export async function getCustomerById(req, res) {
  const id = parseInt(req.params.id);

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
    const customersResult = await dbConnection.query(
      `SELECT * FROM customers WHERE cpf=$1;`,
      [cpf]
    );

    if (customersResult.rowCount > 0) {
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

export async function updateCustomer(req, res) {
  const id = parseInt(req.params.id);
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customerResult = await dbConnection.query(
      `SELECT * FROM customers WHERE id=$1;`,
      [id]
    );

    if (customerResult.rowCount < 1) {
      return res
        .status(404)
        .send("Nenhum cliente foi encontrado com o ID especificado");
    }

    const customersWithSameCpfResult = await dbConnection.query(
      `SELECT * FROM customers WHERE cpf=$1;`,
      [cpf]
    );

    const numCustomersWithSameCpf = customersWithSameCpfResult.rowCount;
    if (
      numCustomersWithSameCpf === 1 &&
      customersWithSameCpfResult.rows[0].id !== id
    ) {
      return res
        .status(409)
        .send("Já existe um cliente cadastrado com esse CPF");
    }

    await dbConnection.query(
      `UPDATE customers
        SET name=$2, phone=$3, cpf=$4, birthday=$5
      WHERE id=$1`,
      [id, name, phone, cpf, birthday]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Houve um erro interno no servidor");
  }
}
