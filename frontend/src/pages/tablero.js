import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import "../styles/tablero.css";

function Tablero() {
  const { user } = useContext(AuthContext);
  const [misIncidencias, setMisIncidencias] = useState([]);

  useEffect(() => {
    const todas =
      JSON.parse(localStorage.getItem("incidencias")) || [];

    const filtradas = todas.filter(
      (inc) => inc.userId === user.id
    );

    setMisIncidencias(filtradas);
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
                <span className="estado">
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