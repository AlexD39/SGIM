import { createContext, useState, useEffect } from "react";

/** Misma base que login/formulario (CRA: definir REACT_APP_API_URL en .env) */
const API_BASE =
  (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
  "http://localhost:3001";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // AJUSTE: Leemos el localStorage directamente en el inicio para evitar el "flash" de redirección
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);

  // Sincronizamos cambios por si acaso, pero el estado inicial ya es correcto
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken && !user) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, [user]);

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
  };

  const logoutAllSessions = async () => {
    // Validación de seguridad: si no hay token, no intentamos la petición
    if (!token) {
      setSessionError("No hay una sesión activa para realizar esta acción.");
      return;
    }

    setLoading(true);
    setSessionError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/logout-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      alert("Se han cerrado todas las sesiones externas correctamente.");
      
    } catch (error) {
      // Feedback amigable para el usuario (UX)
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