import { useEffect } from "react";

function Home() {
  useEffect(() => {
    document.title = "Gestión de Incidencias";
  }, []);

  return (
    <section>
      <h1>Inicio</h1>
      <p>Bienvenida al sistema</p>
    </section>
  );
}

export default Home;
