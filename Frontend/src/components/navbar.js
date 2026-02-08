import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      {/* Lado izquierdo: logo */}
      <div className="navbar-left">
        {/* Reemplaza el texto por <img /> cuando tengas el logo */}
        <Link to="/">
           <img src = "/logoUTT.png" alt="Logo de la escuela" className="navbar-logo"/>
        </Link>
      </div>

      {/* Lado derecho: acciones */}
      <div className="navbar-right" aria-label="Volver al inicio">
        <Link to="/reporteNuevo" className="navbar-button">
          Nuevo reporte
        </Link>
        <Link to="/login" className="navbar-button">
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
