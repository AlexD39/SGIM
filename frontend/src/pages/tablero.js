import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { mostrarError } from "../services/swal";
import "../styles/tablero.css";

function Tablero() {
  useEffect(() => {
    document.title = "SGIM | Tablero de incidencias";
  }, []);

  const { user } = useContext(AuthContext);
  const [misIncidencias, setMisIncidencias] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("incidencias");
      const todas = raw ? JSON.parse(raw) : [];
      const filtradas = (Array.isArray(todas) ? todas : []).filter(
        (inc) => inc.userId === user?.id
      );
      const ordenadas = [...filtradas].sort((a, b) => (b.id || 0) - (a.id || 0));
      setMisIncidencias(ordenadas);
    } catch (e) {
      mostrarError("Error al cargar datos", "No se pudieron cargar tus incidencias. Intenta recargar la página.");
    }
  }, [user]);

  return (
    <main className="tablero-container">
      <header className="tablero-header">
        <h2>Mis Incidencias</h2>
      </header>

      {misIncidencias.length === 0 ? (
        <p role="status">
          No has reportado incidencias todavía.
        </p>
      ) : (
        <section
          className="grid-incidencias"
          aria-label="Listado de incidencias del usuario"
        >
          {misIncidencias.map((inc) => (
            <article
              key={inc.id}
              className="card-incidencia"
            >
              <header className="card-header">
                <h3>{inc.titulo}</h3>
                <span className={`estado estado-${inc.estado.replace(" ", "-").toLowerCase()}`}>
                  {inc.estado}
                </span>
              </header>

              <p>{inc.descripcion}</p>

              {inc.imagen && (
                <img
                  src={inc.imagen}
                  alt={`Imagen asociada a la incidencia ${inc.titulo}`}
                />
              )}

              {inc.comentarios && inc.comentarios.length > 0 && (
                <section
                  className="comentarios-usuario"
                  aria-label="Comentarios del administrador"
                >
                  <h4>Seguimiento de la incidencia</h4>

                  <div className="lista-comentarios">
                    {inc.comentarios.map((com, index) => (
                      <div key={index} className="comentario-item">
                        {com}
                      </div>
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
    </main>
  );
}

export default Tablero;