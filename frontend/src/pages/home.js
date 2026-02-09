import { useEffect, useRef, useState } from "react";

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
    <main style={{ padding: "2rem" }}>
      <h1>Sistema de Gestión de Incidencias Universitarias</h1>

      <p>
        Bienvenido a SGIM. Esta plataforma te permite reportar incidencias
        universitarias y darles seguimiento de manera sencilla.
      </p>

      <p>
        Para comenzar, crea una cuenta o inicia sesión desde el menú superior.
      </p>

      <button onClick={() => setShowInfo((prev) => !prev)}>
        {showInfo ? "Ocultar información" : "¿Qué es SGIM?"}
      </button>

      {showInfo && (
        <section
          ref={infoRef}
          tabIndex="-1"
          aria-labelledby="info-title"
          style={{ marginTop: "1.5rem" }}
        >
          <h2 id="info-title">¿Qué es SGIM?</h2>
          <p>
            SGIM es un sistema diseñado para mejorar la comunicación entre
            estudiantes y la universidad, permitiendo reportar incidencias
            relacionadas con infraestructura y servicios.
          </p>
        </section>
      )}
    </main>
  );
}

export default Home;
