const { Pool } = require("pg");
require("dotenv").config();

function buildPoolConfig() {
  const rawUrl = (process.env.DATABASE_URL || "").trim();
  if (rawUrl && /^postgres(ql)?:\/\//i.test(rawUrl)) {
    return { connectionString: rawUrl };
  }

  const host = process.env.DB_HOST || "127.0.0.1";
  const port = parseInt(process.env.DB_PORT || "5432", 10);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ?? "";
  const database = process.env.DB_NAME || "sgim";

  if (!user) {
    console.error("\n❌ Falta configuración de PostgreSQL en backend/.env");
    console.error("   Crea el archivo copiando:  copy .env.example .env");
    console.error("   y define al menos: DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT");
    console.error("   O bien una DATABASE_URL válida (postgresql://...)\n");
    process.exit(1);
  }

  return { host, port, user, password, database };
}

const pool = new Pool(buildPoolConfig());

if (process.env.NODE_ENV !== "test") {
  pool.query("SELECT NOW()", (err) => {
    if (err) console.error("❌ Error conectando a PostgreSQL:", err.stack);
    else console.log("🐘 Conectado a PostgreSQL exitosamente");
  });
}

module.exports = pool;
