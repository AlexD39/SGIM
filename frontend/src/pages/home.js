import { useEffect, useRef, useState } from "react";
import "./home.css";

function Home() {
  useEffect(() => {
    document.title = "SGIM | Inicio";
  }, []);

  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef(null);

  useEffect(() => {
    if (showInfo && infoRef.current) {
      infoRef.current.focus();
    }
  }, [showInfo]);

  return (
    <main className="home-container">
      <div className="home-card">
      <h1>Sistema de Gestión de Incidencias Universitarias</h1>

      <p>
        Bienvenido a SGIM. Esta plataforma te permite reportar incidencias
        universitarias y darles seguimiento de manera sencilla.
      </p>

      <p>
        Para comenzar, crea una cuenta o inicia sesión desde el menú superior.
      </p>

      <button onClick={() => setShowInfo((prev) => !prev)} aria-expanded={showInfo}
  aria-controls="info-section">
        {showInfo ? "Ocultar información" : "¿Qué es SGIM?"}
      </button>

      {showInfo && (
        <section
          id="info-section"
          ref={infoRef}
          tabIndex="-1"
          aria-labelledby="info-title"
          className="info-section"
        >
          <h2 id="info-title">¿Qué es SGIM?</h2>
          <p>
            SGIM es un sistema diseñado para mejorar la comunicación entre
            estudiantes y la universidad, permitiendo reportar incidencias
            relacionadas con infraestructura y servicios.
          </p>
        </section>
      )}
      </div>
    </main>
  );
}

export default Home;
