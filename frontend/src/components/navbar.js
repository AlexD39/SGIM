import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to="/" aria-label="Ir al inicio">
           <img src = "/logoUTT.png" alt="Logo de la universidad" className="navbar-logo"/>
        </Link>
      </div>

      <div className="navbar-right">
        
        {!user && (
          <>
            <Link to="/register" className="navbar-button">
              Crear cuenta
            </Link>
            <Link to="/login" className="navbar-button">
              Iniciar sesión
            </Link>
          </>
        )}

        {user?.rol === "user" && (
          <>
            <Link to="/formulario" className="navbar-button">
              Reportar incidencia
            </Link>
            <Link to="/tablero" className="navbar-button">
              Mis incidencias
            </Link>
            <Link onClick={logout} to="/" className="navbar-button">
              Cerrar sesión
            </Link>
          </>
        )}

        {user?.rol === "admin" && (
          <>
            <Link to="/admin/dashboard" className="navbar-button">
              Gestionar incidencias
            </Link>
            <Link onClick={logout} to="/" className="navbar-button">
              Cerrar sesión
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
