const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authRequired, requireRole } = require("../middleware/authJwt");
const upload = require("../middleware/upload");
const { login, register } = require("../modules/authController"); 
const { crearReporte } = require("../modules/reportsController");
const cors = require("cors");

function createApp() {
  const app = express();

const cors = require("cors");

const ALLOWED_ORIGINS = ["http://localhost:3003", "http://localhost:3000"];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
}));
  
  app.use(express.json()); // ✅ Permite leer JSON (Fundamental para el Login)
  app.use(express.urlencoded({ extended: true })); // ✅ Permite leer Form-data de texto
  
  app.get("/health", (req, res) => res.status(200).json({ ok: true }));  
  app.get("/__test__/boom", (req, res, next) => next(new Error("boom")));

  // ✅ LOGIN (Conectado a PostgreSQL)  
  app.post("/auth/register", register);
  app.post("/auth/login", login); 

  // ✅ PERFIL
  app.get("/me", authRequired, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  // ✅ REPORTES (MODIFICADO PARA IMÁGENES)
  // Añadimos 'upload.single('evidencia')' para que acepte la foto
  app.post("/reports", authRequired, upload.single('evidencia'), crearReporte);

  // ✅ OTRAS RUTAS DE REPORTES
  app.get("/reports/mine", authRequired, (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.get("/reports/:id", authRequired, (req, res) => {
    res.status(200).json({ id: req.params.id, status: "pendiente" });
  });

  // ✅ RUTAS DE ADMINISTRADOR
  app.get("/admin/reports", authRequired, requireRole("admin"), (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.patch("/admin/reports/:id/status", authRequired, requireRole("admin"), (req, res) => {
    const { status } = req.body || {};
    const allowed = ["pendiente", "en_proceso", "resuelto"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "bad_request", message: `status inválido` });
    }
    return res.status(200).json({ id: req.params.id, status });
  });

  // ✅ Manejo de errores 404
  app.use((req, res) => {
    res.status(404).json({
      error: "not_found",
      message: "Ruta no encontrada",
      path: req.originalUrl || req.path,
    });
  });

  // ✅ Manejo de errores 500
  app.use((err, req, res, next) => {
    console.error("🔴 Error en el servidor:", err.message);
    const traceId = req.headers["x-trace-id"] || null;
    res.status(500).json({
      error: "internal_error",
      message: "Algo salió mal en el servidor.",
      ...(traceId && { traceId }),
    });
  });

  return app;
}

module.exports = { createApp };