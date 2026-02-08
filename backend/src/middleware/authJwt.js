const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "unauthorized", message: "Falta token Bearer" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, role, email, iat, exp }
    return next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized", message: "Token inválido o expirado" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "forbidden", message: "No tienes permisos" });
    }
    return next();
  };
}

module.exports = { authRequired, requireRole };
