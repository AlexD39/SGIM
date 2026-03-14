const pool = require("../config/db");
const { uploadBufferToCloudinary } = require("./cloudinaryHelper");

const crearReporte = async (req, res) => {
  const client = await pool.connect();

  try {
    const { title, description } = req.body;
    const reporter_id = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "bad_request",
        message: "El campo title es obligatorio"
      });
    }

    await client.query("BEGIN");

    const reportResult = await client.query(
      `INSERT INTO reports (title, description, reporter_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), description || null, reporter_id]
    );

    const report = reportResult.rows[0];
    let attachment = null;

    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer);

      const attachmentResult = await client.query(
        `INSERT INTO attachments (report_id, file_name, file_url, content_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          report.id,
          uploadedImage.public_id,
          uploadedImage.secure_url,
          req.file.mimetype
        ]
      );

      attachment = attachmentResult.rows[0];
    }

    await client.query("COMMIT");

    return res.status(201).json({
      ok: true,
      report,
      attachment
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al crear reporte:", err);

    return res.status(500).json({
      error: "internal_error",
      message: "Error al guardar el reporte"
    });
  } finally {
    client.release();
  }
};

module.exports = { crearReporte };