import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { mostrarError, mostrarExito } from "../services/swal";
import { API_BASE } from "../config/api";
import "../styles/login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token") || "";

  useEffect(() => {
    document.title = "SGIM | Nueva contraseña";
  }, []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      mostrarError("Contraseña débil", "Usa al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      mostrarError("No coinciden", "Las contraseñas deben ser iguales.");
      return;
    }
    if (!tokenFromUrl) {
      mostrarError("Enlace inválido", "Falta el token. Abre el enlace completo del correo o la consola del servidor.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, newPassword: password }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        mostrarError("No se pudo restablecer", data?.message || "Token inválido o expirado.");
        return;
      }
      await mostrarExito("Listo", data?.message || "Contraseña actualizada. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch {
      mostrarError("Error de red", "No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <h2>Nueva contraseña</h2>
        {!tokenFromUrl && (
          <p className="error-general" role="alert">
            Este enlace no incluye el token de recuperación. Usa el enlace completo del correo o el que
            muestra la consola del servidor en desarrollo.
          </p>
        )}
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="new-password">Nueva contraseña</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
        <p className="login-footer">
          <Link to="/login">Ir al inicio de sesión</Link>
        </p>
      </div>
    </main>
  );
}

export default ResetPassword;
