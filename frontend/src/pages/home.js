import { useEffect } from "react";

function Home() {
  useEffect(() => {
    document.title = "Gestión de Incidencias";
  }, []);

  return (
        <main style={{ padding: "2rem" }}>
      <h1>Sistema de Gestión de Incidencias Universitarias</h1>
      <p>
        Bienvenido al sistema. Aquí podrás reportar incidencias y dar seguimiento
        a tus reportes de forma sencilla.
      </p>
    </main>

  );
}

export default Home;
