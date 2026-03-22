const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
  }

  try {
    // Agregamos un "o secreto_para_el_mvp" por seguridad si el .env falla
    //Aqui se valida el accesstoken
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secreto_para_el_mvp');

    // 🔥 NUEVO: validar sesión en BD
    const result = await pool.query(
      `SELECT * FROM sessions 
       WHERE jti = $1 AND is_active = true`,
      [payload.jti]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
    }

    req.user = payload;
    req.session = result.rows[0]; // 👈 importante para logout

    return next();

  } catch (e) {
    return res.status(401).json({ error: "unauthorized", message: "No autorizado" });
  }
}

/**
 * requireRole ahora permite que pases uno o varios roles
 * Ejemplo: requireRole("admin") o requireRole("admin", "encargado")
 */
function requireRole(...roles) {
  return (req, res, next) => {
    // Nota: usamos req.user.role porque así lo configuramos en el authController
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