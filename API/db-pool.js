import pkg from "pg";

const { Pool } = pkg;

export const db_pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Mimitha988@",
    database: "cerp",
});

