const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/mailer");

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "bad_request", message: "Faltan credenciales" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    // 🔒 Mensaje genérico
    if (!user) {
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });
    }

    // 🔥 NUEVO: generar jti (ID único de sesión)
    const jti = uuidv4();

    // Aqui se implementa el access token con JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, jti }, // 👈 agregamos jti
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: process.env.JWT_EXPIRES || "8h" }
    );

    // 🔥 NUEVO: guardar sesión en PostgreSQL
    await pool.query(
      `INSERT INTO sessions (user_id, jti, user_agent, ip)
       VALUES ($1, $2, $3, $4)`,
      [user.id, jti, req.headers["user-agent"], req.ip]
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("🔴 ERROR EN LOGIN:", error);
    return res.status(500).json({ error: "server_error", message: "Error interno" });
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: "bad_request",
        message: "Email requerido"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // 🔐 generar token
      const rawToken = crypto.randomBytes(32).toString("hex");

      // 🔐 hash
      const tokenHash = await bcrypt.hash(rawToken, 10);

      // ⏳ expiración 30 min
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      // 💾 guardar
      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, expiresAt]
      );

      // 📧 enviar correo
      await sendResetEmail(user.email, rawToken);
    }

    // 🔒 respuesta SIEMPRE igual
    return res.json({
      message:
        "Si el correo existe, recibirás instrucciones para restablecer tu contraseña."
    });

  } catch (error) {
    console.error("🔴 ERROR EN FORGOT PASSWORD:", error);
    return res.status(500).json({
      error: "server_error",
      message: "Error interno"
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
      return res.status(400).json({
        error: "bad_request",
        message: "Token y nueva contraseña requeridos"
      });
    }

    const tokensResult = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE used_at IS NULL
       AND expires_at > NOW()`
    );

    let validToken = null;

    for (const record of tokensResult.rows) {
      const match = await bcrypt.compare(token, record.token_hash);
      if (match) {
        validToken = record;
        break;
      }
    }

    if (!validToken) {
      return res.status(400).json({
        error: "invalid_token",
        message: "Token inválido o expirado"
      });
    }

    // 🔐 nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, validToken.user_id]
    );

    // 🔒 invalidar token
    await pool.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
      [validToken.id]
    );

    return res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error("🔴 ERROR EN RESET PASSWORD:", error);
    return res.status(500).json({
      error: "server_error",
      message: "Error interno"
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, jti, user_agent, ip, created_at
       FROM sessions
       WHERE user_id = $1 AND is_active = true`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: "Error interno" });
  }
};

const logout = async (req, res) => {
  try {
    await pool.query(
      `UPDATE sessions SET is_active = false WHERE jti = $1`,
      [req.session.jti]
    );

    return res.json({ message: "Sesión cerrada" });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: "Error interno" });
  }
};

const logoutAll = async (req, res) => {
  try {
    await pool.query(
      `UPDATE sessions SET is_active = false WHERE user_id = $1`,
      [req.user.id]
    );

    return res.json({ message: "Todas las sesiones cerradas" });
  } catch (error) {
    return res.status(500).json({ error: "server_error", message: "Error interno" });
  }
};

module.exports = { login, register, getSessions, logout, logoutAll, forgotPassword, resetPassword };
