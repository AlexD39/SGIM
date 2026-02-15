const pool = require('../config/db');

const crearReporte = async (req, res) => {
    const { titulo, descripcion, ubicacion, prioridad } = req.body;
    // El usuario_id viene del Token JWT
    const usuario_id = req.user.sub; 

    // ✅ Obtenemos la ruta del archivo si el usuario subió una foto
    // Si no subió nada, quedará como null
    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // ✅ Añadimos la columna foto_url al INSERT
        const nuevoReporte = await pool.query(
            'INSERT INTO incidencias (titulo, descripcion, ubicacion, prioridad, usuario_id, foto_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [titulo, descripcion, ubicacion, prioridad || 'media', usuario_id, foto_url]
        );
        
        res.status(201).json(nuevoReporte.rows[0]);
    } catch (err) {
        console.error("Error al guardar reporte:", err);
        res.status(500).json({ error: "Error al guardar el reporte en la base de datos" });
    }
};

module.exports = { crearReporte };