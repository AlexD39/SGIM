const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "unauthorized", message: "Falta token Bearer" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secreto_para_el_mvp");

    // ✅ Normalizamos: siempre tener sub
    req.user = {
      ...payload,
      sub: payload.sub || payload.id, // 👈 clave
    };

    return next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized", message: "Token inválido o expirado" });
  }
}


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