import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate
import "./navbar.css";

function Navbar() {
  const { user, logout, loading, sessionError } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para navegar programáticamente

  // Función para manejar el logout de forma segura
  const handleLogout = (e) => {
    e.preventDefault(); // Evitamos que el Link actúe antes de tiempo
    logout();
    navigate("/"); // Navegamos después de limpiar el estado
  };

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to="/" aria-label="Ir al inicio">
          <img src="/logoUTT.png" alt="Logo de la universidad" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {/* Accesibilidad: Aria-live para errores de sesión */}
        {sessionError && (
          <span className="sr-only" role="alert" aria-live="polite">
            {sessionError}
          </span>
        )}

        {!user && (
          <>
            <Link to="/register" className="navbar-button">Crear cuenta</Link>
            <Link to="/login" className="navbar-button">Iniciar sesión</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "usuario" && (
              <>
                <Link to="/formulario" className="navbar-button">Reportar incidencia</Link>
                <Link to="/tablero" className="navbar-button">Mis incidencias</Link>
              </>
            )}

            {user.role === "admin" && (
              <Link to="/admin/dashboard" className="navbar-button">Gestionar incidencias</Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="navbar-button"
              disabled={loading}
              aria-busy={loading}
              aria-label={loading ? "Cerrando sesión" : "Cerrar sesión"}
            >
              {loading ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;