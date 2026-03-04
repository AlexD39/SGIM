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

async function assertCanAccessReport({ reportId, userId, role }) {
  const r = await pool.query(`SELECT * FROM reports WHERE id = $1`, [reportId]);
  const report = r.rows[0];
  if (!report) return { ok: false, status: 404, body: { error: "not_found", message: "Reporte no encontrado" } };

  const isOwner = report.reporter_id === userId;
  const isAdmin = role === "admin";
  if (!isOwner && !isAdmin) {
    return { ok: false, status: 403, body: { error: "forbidden", message: "No autorizado" } };
  }

  return { ok: true, report };
}

// ✅ Subir 1 imagen y guardarla como attachment en DB
const subirAttachment = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.sub;
    const role = req.user.role;

    const access = await assertCanAccessReport({ reportId, userId, role });
    if (!access.ok) return res.status(access.status).json(access.body);

    if (!req.file) {
      return res.status(400).json({ error: "bad_request", message: "Archivo requerido (field: file)" });
    }

    // Cloudinary (multer-storage-cloudinary):
    // req.file.path => URL pública
    // req.file.filename => public_id
    const fileUrl = req.file.path;
    const publicId = req.file.filename; // lo guardamos como "file_name" para poder borrar después si quieres
    const contentType = req.file.mimetype;

    const ins = await pool.query(
      `INSERT INTO attachments (report_id, file_name, file_url, content_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reportId, publicId, fileUrl, contentType]
    );

    return res.status(201).json({ status: "success", data: ins.rows[0] });
  } catch (err) {
    console.error("Error subirAttachment:", err);
    return res.status(500).json({ error: "server_error", message: "Error al subir archivo" });
  }
};

const listarAttachments = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.sub;
    const role = req.user.role;

    const access = await assertCanAccessReport({ reportId, userId, role });
    if (!access.ok) return res.status(access.status).json(access.body);

    const { rows } = await pool.query(
      `SELECT * FROM attachments WHERE report_id = $1 ORDER BY uploaded_at DESC`,
      [reportId]
    );

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("Error listarAttachments:", err);
    return res.status(500).json({ error: "server_error", message: "Error al listar attachments" });
  }
};


module.exports = { crearReporte, misReportes, obtenerReporte, listarAdmin, cambiarEstado, subirAttachment, listarAttachments};