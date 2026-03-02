const pool = require("../config/db");

const allowedStatus = new Set(["pendiente", "en_proceso", "resuelto"]);

const crearReporte = async (req, res) => {
  try {
    const { title, description } = req.body || {};
    const reporterId = req.user.sub;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "bad_request", message: "title es requerido" });
    }

    const r = await pool.query(
      `INSERT INTO reports (title, description, reporter_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), description ?? null, reporterId]
    );

    return res.status(201).json({ status: "success", data: r.rows[0] });
  } catch (err) {
    console.error("Error al crear reporte:", err);
    return res.status(500).json({ error: "server_error", message: "Error al guardar reporte" });
  }
};

const misReportes = async (req, res) => {
  try {
    const reporterId = req.user.sub;

    const { rows } = await pool.query(
      `SELECT * FROM reports
       WHERE reporter_id = $1
       ORDER BY created_at DESC`,
      [reporterId]
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error misReportes:", err);
    return res.status(500).json({ error: "server_error", message: "Error al obtener tus reportes" });
  }
};

const obtenerReporte = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.sub;
    const role = req.user.role;

    const r = await pool.query(`SELECT * FROM reports WHERE id = $1`, [reportId]);
    const report = r.rows[0];

    if (!report) return res.status(404).json({ error: "not_found", message: "Reporte no encontrado" });

    const isOwner = report.reporter_id === userId;
    const isAdmin = role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden", message: "No autorizado" });

    return res.status(200).json({ status: "success", data: report });
  } catch (err) {
    console.error("Error obtenerReporte:", err);
    return res.status(500).json({ error: "server_error", message: "Error al obtener reporte" });
  }
};

const listarAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*,
              u.full_name AS reporter_name,
              u.email AS reporter_email
       FROM reports r
       JOIN users u ON u.id = r.reporter_id
       ORDER BY r.created_at DESC`
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error listarAdmin:", err);
    return res.status(500).json({ error: "server_error", message: "Error al listar reportes" });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body || {};

    if (!allowedStatus.has(status)) {
      return res.status(400).json({ error: "bad_request", message: "status inválido" });
    }

    const r = await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status, reportId]
    );

    if (!r.rows[0]) return res.status(404).json({ error: "not_found", message: "Reporte no encontrado" });

    return res.status(200).json({ status: "success", data: r.rows[0] });
  } catch (err) {
    console.error("Error cambiarEstado:", err);
    return res.status(500).json({ error: "server_error", message: "Error al actualizar estado" });
  }
};

module.exports = { crearReporte, misReportes, obtenerReporte, listarAdmin, cambiarEstado };