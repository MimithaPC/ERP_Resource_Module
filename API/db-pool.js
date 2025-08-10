
import pkg from "pg";
const { Pool } = pkg;

export const db_pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "Mimitha988@",
  database: "resource_module",
  port: 5432,
});
