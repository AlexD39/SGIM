import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to="/" aria-label="Ir al inicio">
           <img src = "/logoUTT.png" alt="Logo de la universidad" className="navbar-logo"/>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/register" className="navbar-button">
          Crear cuenta
        </Link>
        <Link to="/login" className="navbar-button">
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
