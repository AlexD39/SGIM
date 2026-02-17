import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section role="alert">
      <h1>Error 404</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}

export default NotFound;
