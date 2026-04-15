import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { mostrarError } from "../services/swal";
import "../styles/tablero.css";

function Tablero() {
  const { user, logoutAllSessions, loading, sessionError, setSessionError } = useContext(AuthContext);
  const [misIncidencias, setMisIncidencias] = useState([]);

  useEffect(() => {
    document.title = "SGIM | Tablero de incidencias";
  }, []);

  useEffect(() => {
    // PROTECCIÓN: Si el usuario cierra sesión, no intentamos cargar nada
    if (!user) return;

    try {
      const raw = localStorage.getItem("incidencias");
      const todas = raw ? JSON.parse(raw) : [];
      const filtradas = (Array.isArray(todas) ? todas : []).filter(
        (inc) => inc.userId === user.id
      );
      const ordenadas = [...filtradas].sort((a, b) => (b.id || 0) - (a.id || 0));
      setMisIncidencias(ordenadas);
    } catch (e) {
      mostrarError("Error al cargar datos", "No se pudieron cargar tus incidencias. Intenta recargar la página.");
    }
  }, [user]);

  // Si el estado de usuario se limpia (logout), evitamos renderizar el resto
  if (!user) return null;

  return (
    <main className="tablero-container">
      <header className="tablero-header">
        <h2>Mis Incidencias</h2>
      </header>

      {misIncidencias.length === 0 ? (
        <div className="tablero-empty" role="status">
          <p>No has reportado incidencias todavía.</p>
          <Link to="/formulario" className="tablero-cta-link">
            Reportar una incidencia
          </Link>
        </div>
      ) : (
        <section className="grid-incidencias" aria-label="Listado de incidencias del usuario">
          {misIncidencias.map((inc) => (
            <article key={inc.id} className="card-incidencia">
              <header className="card-header">
                <h3>{inc.titulo}</h3>
                <span className={`estado estado-${inc.estado ? inc.estado.replace(/\s+/g, '-').toLowerCase() : 'pendiente'}`}>
                  {inc.estado}
                </span>
              </header>
              <p>{inc.descripcion}</p>
              {inc.imagen && <img src={inc.imagen} alt={`Imagen asociada a la incidencia ${inc.titulo}`} />}
              {inc.comentarios && inc.comentarios.length > 0 && (
                <section className="comentarios-usuario" aria-label="Comentarios del administrador">
                  <h4>Seguimiento de la incidencia</h4>
                  <div className="lista-comentarios">
                    {inc.comentarios.map((com, index) => (
                      <div key={index} className="comentario-item">{com}</div>
                    ))}
                  </div>
                </section>
              )}
              <footer className="card-footer">
                <small>Reportada el {inc.fecha}</small>
              </footer>
            </article>
          ))}
        </section>
      )}

      {/* SECCIÓN DE SEGURIDAD (REQUISITO DE TAREA) */}
      <hr style={{ margin: '3rem 0', opacity: '0.2' }} />
      <section className="session-management-section">
        <h3>Seguridad de la cuenta</h3>
        <p className="session-help-text">Si sospechas que alguien más tiene acceso o dejaste tu cuenta abierta, puedes cerrar todas las demás sesiones activas.</p>
        
        {sessionError && (
          <div className="auth-error-msg" role="alert" aria-live="assertive">
            <span>{sessionError}</span>
            <button 
              onClick={() => setSessionError(null)} 
              aria-label="Cerrar error" 
              style={{background:'none', border:'none', marginLeft:'auto', cursor:'pointer', color: 'inherit', fontWeight: 'bold'}}
            >
              ✕
            </button>
          </div>
        )}

        <button 
          className="btn-logout-others" 
          onClick={logoutAllSessions} 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Procesando..." : "Cerrar otras sesiones activas"}
        </button>
      </section>
    </main>
  );
}

export default Tablero;