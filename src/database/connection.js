import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const db_connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default db_connection;
