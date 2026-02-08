import { Link, useLocation } from "react-router-dom";
import "./breadcrumbs.css";

function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Ruta de navegación">
      <ol>
        <li>
          <Link to="/">Inicio</Link>
        </li>

        {paths.map((path, index) => {
          const url = "/" + paths.slice(0, index + 1).join("/");
          return (
            <li key={url}>
              <Link to={url}>{path}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
