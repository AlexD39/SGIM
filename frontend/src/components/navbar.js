import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const { user, logout, loading, sessionError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-left">
        <Link to="/" aria-label="Ir al inicio">
          <img src="/logoUTT.png" alt="Logo de la universidad" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-right">
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
            {/* Se cambió .role por .rol para consistencia */}
            {user.rol === "usuario" && (
              <>
                <Link to="/formulario" className="navbar-button">Reportar incidencia</Link>
                <Link to="/tablero" className="navbar-button">Mis incidencias</Link>
              </>
            )}

            {user.rol === "admin" && (
              <Link to="/admin/dashboard" className="navbar-button">Gestionar incidencias</Link>
            )}

            <button 
              onClick={handleLogout} 
              className={`navbar-button ${loading ? "btn-disabled" : ""}`}
              disabled={loading}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              aria-busy={loading}
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