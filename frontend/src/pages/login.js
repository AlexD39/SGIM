import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import "../styles/login.css";
const API = process.env.REACT_APP_API_URL;

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
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  const generalErrorRef = useRef(null);

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

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setGeneralError("");
      } 
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

  useEffect(() => {
  if (generalError && generalErrorRef.current) {
    generalErrorRef.current.focus();
  }
  }, [generalError]);


  const handleSubmit = async (e) => {
  e.preventDefault();
  setGeneralError("");
  setLoading(true);

  try {
    if (!API) {
      setGeneralError("Falta configurar REACT_APP_API_URL en el frontend.");
      setLoading(false);
      return;
    }

    const resp = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      setGeneralError(data?.message || "No se pudo iniciar sesión");
      setLoading(false);
      return;
    }

    login({ user: data.user, token: data.token });
    if (data.user.role === "admin") navigate("/admin/dashboard");
    else navigate("/tablero");
  } catch (err) {
    setGeneralError("Error de red. Intenta de nuevo.");
    setLoading(false);
  }
};
  
  return (
    <main className="login-container">

      <div className="login-card">
        <h2>Iniciar sesión</h2>

        {generalError && (
          <div ref={generalErrorRef} className="error-general" role="alert" aria-live="assertive" tabIndex="-1">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              ref={refs.email}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-correo" : undefined}
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
