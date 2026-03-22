import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  // Añadimos loading y sessionError para dar feedback en el Navbar
  const { user, logout, loading, sessionError } = useContext(AuthContext);

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to="/" aria-label="Ir al inicio">
          <img src="/logoUTT.png" alt="Logo de la universidad" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {/* Muestra un error visual si el logout falla, usando accesibilidad aria-live */}
        {sessionError && (
          <span className="sr-only" role="alert" aria-live="polite">
            {sessionError}
          </span>
        )}

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

        {user?.role === "usuario" && (
          <>
            <Link to="/formulario" className="navbar-button">
              Reportar incidencia
            </Link>
            <Link to="/tablero" className="navbar-button">
              Mis incidencias
            </Link>
            <Link 
              onClick={logout} 
              to="/" 
              className={`navbar-button ${loading ? "btn-disabled" : ""}`}
              aria-disabled={loading}
            >
              {loading ? "Saliendo..." : "Cerrar sesión"}
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="navbar-button">
              Gestionar incidencias
            </Link>
            <Link 
              onClick={logout} 
              to="/" 
              className={`navbar-button ${loading ? "btn-disabled" : ""}`}
              aria-disabled={loading}
            >
              {loading ? "Saliendo..." : "Cerrar sesión"}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;