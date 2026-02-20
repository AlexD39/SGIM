const express = require("express");
const { authRequired, requireRole } = require("../middleware/authJwt");
const upload = require("../middleware/upload");
const { login, register } = require("../modules/authController");
const { crearReporte } = require("../modules/reportsController");
const cors = require("cors");

function createApp() {
  const app = express();

  const ALLOWED_ORIGINS = [
    "http://localhost:3003",
    "http://localhost:3000",
    "https://sgim-psi.vercel.app", // tu prod
  ];

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // Postman / server-to-server
        if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        // ✅ permite previews de Vercel
        if (origin.endsWith(".vercel.app")) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // static uploads
  app.use("/uploads", express.static("uploads"));

  // health
  app.get("/health", (req, res) => res.status(200).json({ ok: true }));

  // auth
  app.post("/auth/register", register);
  app.post("/auth/login", login);

  // profile
  app.get("/me", authRequired, (req, res) => {
    res.status(200).json({ user: req.user });
  });

  // reports
  app.post("/reports", authRequired, upload.single("evidencia"), crearReporte);

  app.get("/reports/mine", authRequired, (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.get("/reports/:id", authRequired, (req, res) => {
    res.status(200).json({ id: req.params.id, status: "pendiente" });
  });

  // admin
  app.get("/admin/reports", authRequired, requireRole("admin"), (req, res) => {
    res.status(200).json({ data: [] });
  });

  app.patch("/admin/reports/:id/status", authRequired, requireRole("admin"), (req, res) => {
    const { status } = req.body || {};
    const allowed = ["pendiente", "en_proceso", "resuelto"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "bad_request", message: "status inválido" });
    }
    return res.status(200).json({ id: req.params.id, status });
  });

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "not_found", message: "Ruta no encontrada" });
  });

  // 500
  app.use((err, req, res, next) => {
    console.error("🔴 Error en el servidor:", err.message);
    res.status(500).json({ error: "internal_error", message: "Algo salió mal en el servidor." });
  });

  return app;
}

module.exports = { createApp };