import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // 1. Si no hay usuario, directo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Backend devuelve `role` (JWT /login). Compatibilidad con `rol` por si acaso.
  const role = user.role ?? user.rol;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !role) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si todo está ok, mostramos el contenido
  return children;
}

export default ProtectedRoute;