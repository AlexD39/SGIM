const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "unauthorized", message: "Falta token Bearer" });
  }

  try {
    // Agregamos un "o secreto_para_el_mvp" por seguridad si el .env falla
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secreto_para_el_mvp');
    req.user = { ...payload, sub: payload.sub || payload.id };
    return next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized", message: "Token inválido o expirado" });
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