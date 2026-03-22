import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Para feedback de carga en UI
  const [sessionError, setSessionError] = useState(null); // Feedback de errores claro

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    setSessionError(null);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSessionError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Tip de Accesibilidad: Aquí podrías redirigir al login y mover el foco al input
  };

  // NUEVA FUNCIÓN: Cerrar otras sesiones (Logout Global)
  const logoutAllSessions = async () => {
    setLoading(true);
    setSessionError(null);

    try {
      // Reemplaza esta URL con la que te entregue el Backend
      const response = await fetch("https://tu-api.com/auth/logout-others", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cerrar las otras sesiones.");
      }

      // Feedback de éxito (puedes cambiarlo por un modal/toast después)
      alert("Se han cerrado todas las sesiones externas correctamente.");
      
    } catch (error) {
      // Feedback claro sin exponer datos técnicos sensibles del servidor
      setSessionError("Hubo un problema al intentar cerrar otras sesiones. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        logoutAllSessions, 
        loading, 
        sessionError,
        setSessionError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}