import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // Si no está logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
