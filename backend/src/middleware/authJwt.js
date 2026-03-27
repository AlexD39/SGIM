const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
  }

  try {
    // 🔥 Validación de entorno (DevOps correcto)
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en el entorno");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Validar sesión en BD
    const result = await pool.query(
      `SELECT * FROM sessions 
       WHERE jti = $1 AND is_active = true`,
      [payload.jti]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
    }

    req.user = payload;
    req.session = result.rows[0];

    return next();

  } catch (e) {
    return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ 
        error: "forbidden", 
        message: `No tienes permisos. Se requiere uno de estos roles: ${roles.join(", ")}` 
      });
    }
    return next();
  };
}

module.exports = { authRequired, requireRole };