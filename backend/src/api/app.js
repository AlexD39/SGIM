const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authRequired, requireRole } = require("../middleware/authJwt");

function createApp() {
  const app = express();
  app.use(express.json());

  // ✅ Health
  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  /**
   * Demo users (en real: DB)
   * user: reporta incidencias
   * admin: encargado valida/cambia estatus
   */
  const users = [
    {
      id: 1,
      email: "user@sgim.com",
      role: "user",
      passwordHash: bcrypt.hashSync("123456", 10),
    },
    {
      id: 2,
      email: "admin@sgim.com",
      role: "admin",
      passwordHash: bcrypt.hashSync("123456", 10),
    },
  ];

  // ✅ Login (pública)
  app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "bad_request", message: "email y password son requeridos" });
    }

    const u = users.find((x) => x.email === email);
    if (!u) return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: "unauthorized", message: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: u.id, email: u.email, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    return res.status(200).json({ token, token_type: "Bearer" });
  });

  // ✅ Perfil (privada)
  app.get("/me", authRequired, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  // ✅ Dashboard (privada)
  app.get("/dashboard/summary", authRequired, (req, res) => {
    res.status(200).json({
      total: 0,
      pendientes: 0,
      en_proceso: 0,
      resueltos: 0,
      user: req.user,
    });
  });

  // ✅ Reportes (privadas) - stub
  app.post("/reports", authRequired, (req, res) => {
    const { titulo, descripcion } = req.body || {};
    if (!titulo || !descripcion) {
      return res.status(400).json({ error: "bad_request", message: "titulo y descripcion son requeridos" });
    }
    // En real: guardar en DB
    return res.status(201).json({ id: 1, titulo, descripcion, status: "pendiente" });
  });

  app.get("/reports/mine", authRequired, (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.get("/reports/:id", authRequired, (req, res) => {
    res.status(200).json({ id: req.params.id, status: "pendiente" });
  });

  // ✅ Admin/Encargado (privadas + rol)
  app.get("/admin/reports", authRequired, requireRole("admin"), (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.patch("/admin/reports/:id/status", authRequired, requireRole("admin"), (req, res) => {
    const { status } = req.body || {};
    const allowed = ["pendiente", "en_proceso", "resuelto"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "bad_request", message: `status inválido. Usa: ${allowed.join(", ")}` });
    }
    return res.status(200).json({ id: req.params.id, status });
  });

  app.get("/admin/history", authRequired, requireRole("admin"), (req, res) => {
    res.status(200).json({ data: [] });
  });

  // ✅ Ruta 500 solo en test (para tu entrega)
  if (process.env.NODE_ENV === "test") {
    app.get("/__test__/boom", () => {
      throw new Error("boom");
    });
  }

  // ✅ 404
  app.use((req, res) => {
    res.status(404).json({ error: "not_found", message: "Ruta no encontrada", path: req.originalUrl });
  });

  // ✅ 500
  app.use((err, req, res, next) => {
    const traceId = req.headers["x-trace-id"] || "no-trace";
    res.status(500).json({
      error: "internal_error",
      message: "Ocurrió un error interno. Intenta más tarde.",
      traceId,
    });
  });

  return app;
}

module.exports = { createApp };