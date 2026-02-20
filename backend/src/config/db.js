const { Pool } = require("pg");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({ connectionString });

// Prueba de conexión inicial
pool.query("SELECT NOW()", (err) => {
  if (err) console.error("❌ Error conectando a PostgreSQL:", err.stack);
  else console.log("🐘 Conectado a PostgreSQL exitosamente");
});

module.exports = pool;
