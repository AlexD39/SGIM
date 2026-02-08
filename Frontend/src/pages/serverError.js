import { Link } from "react-router-dom";

function ServerError() {
  return (
    <section role="alert">
      <h1>Error 500</h1>
      <p>Ocurrió un problema interno. Intenta nuevamente más tarde.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}

export default ServerError;
