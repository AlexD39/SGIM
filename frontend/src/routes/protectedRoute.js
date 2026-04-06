import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // 1. Si no hay usuario, directo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles permitidos definidos, verificamos el acceso
  // IMPORTANTE: Usamos 'rol' para coincidir con tu authContext y tests
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está ok, mostramos el contenido
  return children;
}

export default ProtectedRoute;