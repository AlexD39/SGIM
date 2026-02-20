const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Falta DATABASE_URL en variables de entorno.");
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  const sqlPath = path.join(__dirname, "..", "database", "sgim_init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    await client.connect();
    console.log("✅ Conectado a Postgres");

    await client.query(sql);
    console.log("✅ SQL ejecutado: tablas y seed listos");
  } catch (err) {
    console.error("❌ Error ejecutando SQL:", err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();