const pool = require("../config/db");

const allowedStatus = new Set(["pendiente", "en_proceso", "resuelto"]);

const crearReporte = async (req, res) => {
  try {
    const { title, description } = req.body;
    const reporterId = req.user.sub;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "bad_request", message: "title es requerido (mínimo 3 caracteres)" });
    }

    const r = await pool.query(
      `INSERT INTO reports (title, description, reporter_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), description ?? null, reporterId]
    );

    const report = r.rows[0];

    // ✅ si viene evidencia, la guardamos en attachments
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;

      await pool.query(
        `INSERT INTO attachments (report_id, file_name, file_url, content_type)
         VALUES ($1, $2, $3, $4)`,
        [report.id, req.file.originalname, fileUrl, req.file.mimetype]
      );
    }

    return res.status(201).json({ status: "success", data: report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Error al guardar el reporte" });
  }
};

const misReportes = async (req, res) => {
  try {
    const reporterId = req.user.sub;

    const { rows } = await pool.query(
      `SELECT r.*,
              COALESCE(
                (SELECT json_agg(a.*) FROM attachments a WHERE a.report_id = r.id),
                '[]'::json
              ) AS attachments
       FROM reports r
       WHERE r.reporter_id = $1
       ORDER BY r.created_at DESC`,
      [reporterId]
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Error al obtener tus reportes" });
  }
};

const obtenerReporte = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.sub;
    const role = req.user.role;

    const r = await pool.query(
      `SELECT r.*,
              u.full_name AS reporter_name,
              u.email AS reporter_email,
              a.full_name AS assignee_name,
              COALESCE(
                (SELECT json_agg(at.*) FROM attachments at WHERE at.report_id = r.id),
                '[]'::json
              ) AS attachments
       FROM reports r
       JOIN users u ON u.id = r.reporter_id
       LEFT JOIN users a ON a.id = r.assignee_id
       WHERE r.id = $1`,
      [reportId]
    );

    const report = r.rows[0];
    if (!report) return res.status(404).json({ error: "not_found", message: "Reporte no encontrado" });

    const isOwner = report.reporter_id === userId;
    const isAdmin = role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden", message: "No autorizado" });

    return res.status(200).json({ status: "success", data: report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Error al obtener el reporte" });
  }
};

const listarAdmin = async (req, res) => {
  try {
    const { status, q } = req.query;

    const values = [];
    const where = [];

    if (status) {
      if (!allowedStatus.has(status)) {
        return res.status(400).json({ error: "bad_request", message: "status inválido" });
      }
      values.push(status);
      where.push(`r.status = $${values.length}`);
    }

    if (q) {
      values.push(`%${q}%`);
      where.push(`(r.title ILIKE $${values.length} OR r.description ILIKE $${values.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `SELECT r.*,
              u.full_name AS reporter_name,
              u.email AS reporter_email,
              a.full_name AS assignee_name,
              COALESCE(
                (SELECT json_agg(at.*) FROM attachments at WHERE at.report_id = r.id),
                '[]'::json
              ) AS attachments
       FROM reports r
       JOIN users u ON u.id = r.reporter_id
       LEFT JOIN users a ON a.id = r.assignee_id
       ${whereSql}
       ORDER BY r.created_at DESC`,
      values
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Error al listar reportes" });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body || {};

    if (!allowedStatus.has(status)) {
      return res.status(400).json({
        error: "bad_request",
        message: "status inválido",
        details: { allowed: Array.from(allowedStatus) },
      });
    }

    const { rows } = await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status, reportId]
    );

    if (!rows[0]) return res.status(404).json({ error: "not_found", message: "Reporte no encontrado" });

    return res.status(200).json({ status: "success", data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: "Error al actualizar estado" });
  }
};

module.exports = {
  crearReporte,
  misReportes,
  obtenerReporte,
  listarAdmin,
  cambiarEstado,
};