const express = require("express");

function createApp() {
  const app = express();

  app.use(express.json());

  // Healthcheck para Docker/CI
  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
  });

  // ✅ Ruta que provoca 500 SOLO en tests  
  if (process.env.NODE_ENV === "test") {
    app.get("/__test__/boom", (req, res) => {
      throw new Error("boom");
    });
  }

  // ✅ 404 handler (rutas no existentes)
  app.use((req, res) => {
    res.status(404).json({
      error: "not_found",
      message: "Ruta no encontrada",
      path: req.originalUrl,
    });
  });

  // ✅ 500 handler global (error interno)
  app.use((err, req, res, next) => {
    const traceId = req.headers["x-trace-id"] || "test-trace";

    // En real: aquí el BE loguea err + traceId
    res.status(500).json({
      error: "internal_error",
      message: "Ocurrió un error interno. Intenta más tarde.",
      traceId,
    });
  });

  return app;
}

module.exports = { createApp };
