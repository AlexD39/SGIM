const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🕵️ LOG DE DIAGNÓSTICO (Mira esto en tu terminal)
    console.log("--- DIAGNÓSTICO DE LOGIN ---");
    console.log(`Email recibido: [${email}]`);
    console.log(`Password recibido: [${password}]`);

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    // Buscar el usuario en PostgreSQL
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      console.log("❌ Usuario no encontrado en DB");
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    console.log(`Password en DB: [${user.password}]`);

    // 🛠️ PRUEBA DE COMPAÑERISMO (Bcrypt o Texto Plano)
    let validPassword = false;
    
    if (user.password.startsWith('$2b$')) {
      // Si parece un hash, usamos bcrypt
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      // Si no, comparamos texto plano
      validPassword = (password === user.password);
    }

    if (!validPassword) {
      console.log("❌ El password NO coincide");
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    // Generar el Token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "8h" }
    );

    console.log("✅ ¡LOGIN EXITOSO!");
    
    return res.json({
      token,
      user: { id: user.id, email: user.email, rol: user.rol }
    });

  } catch (error) {
    console.error("🔴 ERROR EN LOGIN:", error);
    res.status(500).json({ error: "server_error" });
  }
};

module.exports = { login };