import { useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { mostrarError } from "../services/swal";
import { API_BASE } from "../config/api";
import "../styles/login.css";

function Login() {
  useEffect(() => {
    document.title = "SGIM | Iniciar sesión";
  }, []);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "El correo es obligatorio";
      else if (!value.includes("@")) error = "El correo debe contener un @";
    }

    if (name === "password") {
      if (!value) error = "La contraseña es obligatoria";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    const hasEmptyFields = Object.values(formData).some(
      (value) => value.trim() === ""
    );

    setIsFormValid(!hasErrors && !hasEmptyFields);
  }, [errors, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ MISMO DELAY / MISMA ANIMACIÓN QUE ANTES
    setTimeout(async () => {
      try {
        const resp = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        // ✅ Si el backend no manda JSON, no revienta
        const data = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          setLoading(false);
          mostrarError(
            "Error al iniciar sesión",
            data?.message || "Correo o contraseña incorrectos."
          );
          return;
        }

        // ✅ Aquí depende de tu backend:
        // Esperado: data = { token, user: { id, nombre, role/rol, ... } }
        // Si tu backend manda distinto, lo ajustamos.
        const user = data.user ?? data.usuario ?? data;
        const token = data.token ?? data.accessToken ?? data.jwt;

        // ✅ Mantén tu AuthContext como lo estés usando:
        // Si tu AuthContext esperaba SOLO user, usa: login(user)
        // Si esperaba user+token, usa esto:
        login({ user, token });

        const role = user?.role || user?.rol;
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/tablero");
      } catch (err) {
        setLoading(false);
        mostrarError("Error de red", "No se pudo conectar al servidor.");
      }
    }, 1000);
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              ref={refs.email}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <span id="error-email" className="error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              ref={refs.password}
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "error-password" : undefined}
            />
            {errors.password && (
              <span id="error-password" className="error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <p className="form-hint" style={{ marginBottom: "0.75rem" }}>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </p>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            aria-disabled={!isFormValid || loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {!isFormValid && (
            <p className="form-hint" aria-live="polite">
              Ingresa tu correo y contraseña para continuar
            </p>
          )}
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;