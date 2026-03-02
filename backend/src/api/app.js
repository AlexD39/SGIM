const cors = require("cors");
const express = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authRequired, requireRole } = require("../middleware/authJwt");
const upload = require("../middleware/upload");
const { login, register } = require("../modules/authController"); 

const {
  crearReporte,
  misReportes,
  obtenerReporte,
  listarAdmin,
  cambiarEstado,
} = require("../modules/reportsController");

function createApp() {
  const app = express();

const cors = require("cors");

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3003"];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET","POST","PATCH","PUT","DELETE","OPTIONS"],
}));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 🛠️ MÁXIMA IMPORTANCIA: Estas líneas deben ir ANTES de las rutas
  app.use(express.json()); // ✅ Permite leer JSON (Fundamental para el Login)
  app.use(express.urlencoded({ extended: true })); // ✅ Permite leer Form-data de texto

  // ✅ Health Check
  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  // Ruta solo para tests (500 con traceId)
  app.get("/__test__/boom", (req, res, next) => next(new Error("boom")));

  // ✅ LOGIN (Conectado a PostgreSQL)
  // Asegúrate que en Thunder Client envías un JSON con "email" y "password"
  app.post("/auth/register", register);
  app.post("/auth/login", login); 

  // ✅ PERFIL
  app.get("/me", authRequired, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  // Reports (usuario)
  app.post("/reports", authRequired, crearReporte);
  app.get("/reports/mine", authRequired, misReportes);
  app.get("/reports/:id", authRequired, obtenerReporte);

  // admin
  app.get("/admin/reports", authRequired, requireRole("admin"), listarAdmin);
  
  app.patch("/admin/reports/:id/status", authRequired, requireRole("admin"), cambiarEstado);



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