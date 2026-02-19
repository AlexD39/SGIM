const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "bad_request", message: "Faltan credenciales" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: process.env.JWT_EXPIRES || "8h" }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("🔴 ERROR EN LOGIN:", error);
    return res.status(500).json({ error: "server_error", message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "bad_request", message: "Faltan datos" });
    }

    // verifica si existe
    const exists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "conflict", message: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, role, password)
       VALUES ($1, $2, 'usuario', $3)
       RETURNING id, full_name, email, role`,
      [full_name, email, hashed]
    );

    const user = result.rows[0];

    // opcional: devolver token directo al registrar
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: process.env.JWT_EXPIRES || "8h" }
    );

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("🔴 ERROR EN REGISTER:", error);
    return res.status(500).json({ error: "server_error", message: error.message });
  }
};


module.exports = { login, register };
