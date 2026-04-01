import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mostrarError, mostrarExito } from "../services/swal";
import { API_BASE } from "../config/api";
import "../styles/login.css";

function ForgotPassword() {
  useEffect(() => {
    document.title = "SGIM | Recuperar contraseña";
  }, []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      mostrarError("Datos inválidos", "Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        mostrarError("Error", data?.message || "No se pudo procesar la solicitud.");
        return;
      }
      await mostrarExito(
        "Solicitud enviada",
        data?.message ||
          "Si el correo existe, recibirás instrucciones para restablecer tu contraseña."
      );
    } catch {
      mostrarError("Error de red", "No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <h2>Recuperar contraseña</h2>
        <p className="form-hint" style={{ marginBottom: "1rem" }}>
          Escribe el correo de tu cuenta. Si está registrado, te enviaremos un enlace
          (en desarrollo también aparece en la consola del servidor).
        </p>
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="forgot-email">Correo electrónico</label>
            <input
              id="forgot-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Enviando…" : "Enviar enlace"}
          </button>
        </form>
        <p className="login-footer">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
