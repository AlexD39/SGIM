import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { mostrarError } from "../services/swal";
import "../styles/dashboard.css";

function Dashboard() {
  const { user, logoutAllSessions, loading, sessionError, setSessionError } = useContext(AuthContext);
  const [incidencias, setIncidencias] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    document.title = "SGIM | Incidencias reportadas";
  }, []);

  useEffect(() => {
    // Si no hay usuario (ej. logout), no intentamos acceder al localStorage
    if (!user) return;

    try {
      const raw = localStorage.getItem("incidencias");
      const todas = raw ? JSON.parse(raw) : [];
      const ordenadas = [...(Array.isArray(todas) ? todas : [])].sort(
        (a, b) => (b.id || 0) - (a.id || 0)
      );
      setIncidencias(ordenadas);
    } catch (e) {
      mostrarError("Error al cargar datos", "No se pudieron cargar las incidencias. Intenta recargar la página.");
    }
  }, [user]);

  const handleEstadoChange = (id, nuevoEstado) => {
    const actualizadas = incidencias.map((inc) =>
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc
    );
    setIncidencias(actualizadas);
    localStorage.setItem("incidencias", JSON.stringify(actualizadas));
  };

  const handleComentario = (id, comentario) => {
    const actualizadas = incidencias.map((inc) => {
      if (inc.id === id) {
        const nuevosComentarios = inc.comentarios ? [...inc.comentarios, comentario] : [comentario];
        return { ...inc, comentarios: nuevosComentarios };
      }
      return inc;
    });
    setIncidencias(actualizadas);
    localStorage.setItem("incidencias", JSON.stringify(actualizadas));
  };

  const incidenciasFiltradas = filtro === "Todos" ? incidencias : incidencias.filter((inc) => inc.estado === filtro);

  // PROTECCIÓN DE RENDER: Si el usuario no existe, evitamos que React intente renderizar el resto del DOM
  if (!user) return null;

  return (
    <main className="admin-container">
      <header>
        <h2>Panel de Administración</h2>
        <p>Bienvenido, {user?.nombre}</p>
      </header>

      {/* SECCIÓN DE SEGURIDAD PARA ADMIN */}
      <section className="session-management-section" style={{ marginBottom: '2rem' }}>
        <p className="session-help-text">Sesión administrativa activa. Puedes cerrar otras sesiones abiertas vinculadas a tu cuenta.</p>
        
        {sessionError && (
          <div className="auth-error-msg" role="alert" aria-live="assertive">
            <span>{sessionError}</span>
            <button 
              onClick={() => setSessionError(null)} 
              aria-label="Cerrar error" 
              style={{background:'none', border:'none', marginLeft:'auto', cursor:'pointer', color: 'inherit'}}
            >✕</button>
          </div>
        )}

        <button 
          className="btn-logout-others" 
          onClick={logoutAllSessions} 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Cerrando..." : "Cerrar sesiones globales"}
        </button>
      </section>

      <div className="filtro-container">
        <label htmlFor="filtroEstado">Filtrar por estado:</label>
        <select id="filtroEstado" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
      </div>

      <section className="resumen-estados">
        <div className="resumen-card pendiente">Pendientes: {incidencias.filter(i => i.estado === "Pendiente").length}</div>
        <div className="resumen-card proceso">En proceso: {incidencias.filter(i => i.estado === "En proceso").length}</div>
        <div className="resumen-card resuelto">Resueltos: {incidencias.filter(i => i.estado === "Resuelto").length}</div>
      </section>

      <section aria-label="Listado completo de incidencias" className="admin-grid">
        {incidencias.length === 0 ? (
          <p role="status">No hay incidencias registradas.</p>
        ) : (
          incidenciasFiltradas.map((inc) => (
            <article key={inc.id} className="admin-card">
              <header>
                <h3>{inc.titulo}</h3>
                <span className={`estado estado-${inc.estado ? inc.estado.replace(/\s+/g, '-').toLowerCase() : 'pendiente'}`}>
                  {inc.estado}
                </span>
              </header>
              <p>{inc.descripcion}</p>
              {inc.imagen && <img src={inc.imagen} alt={`Imagen de la incidencia ${inc.titulo}`} />}
              <p className="matricula"><strong>Reporta la matricula:</strong> {inc.matricula}</p>
              <p><strong>Fecha:</strong> {inc.fecha}</p>
              
              <label htmlFor={`estado-${inc.id}`}>Cambiar estado:</label>
              <select id={`estado-${inc.id}`} value={inc.estado} onChange={(e) => handleEstadoChange(inc.id, e.target.value)}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Resuelto">Resuelto</option>
              </select>

              <div className="comentarios">
                <h4>Comentarios</h4>
                <div className="lista-comentarios">
                  {inc.comentarios && inc.comentarios.length > 0 ? (
                    inc.comentarios.map((com, index) => <div key={index} className="comentario-item">{com}</div>)
                  ) : (
                    <p className="sin-comentarios">No hay comentarios aún.</p>
                  )}
                </div>
                <form className="form-comentario" onSubmit={(e) => {
                  e.preventDefault();
                  const comentario = e.target.comentario.value.trim();
                  if (!comentario) return;
                  handleComentario(inc.id, comentario);
                  e.target.reset();
                }}>
                  <label htmlFor={`comentario-${inc.id}`} className="sr-only">Agregar comentario</label>
                  <input type="text" name="comentario" id={`comentario-${inc.id}`} placeholder="Escribir comentario..." required />
                  <button type="submit">Agregar comentario</button>
                </form>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Dashboard;