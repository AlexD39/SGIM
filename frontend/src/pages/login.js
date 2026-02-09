import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./login.css";

function Login() {
  useEffect(() => {
    document.title = "SGIM | Iniciar sesión";
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const refs = {
    correo: useRef(null),
    password: useRef(null),
  };

  const submitButtonRef = useRef(null);

  const validateField = (name, value) => {
    let error = "";

    if (name === "correo") {
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
    if (isFormValid && submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }, [isFormValid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError("");
    setLoading(true);

    // 🔹 aquí luego va el login real
    setTimeout(() => {
      setLoading(false);

      // simular error
      setGeneralError("Correo o contraseña incorrectos");
      refs.correo.current.focus();
    }, 1000);
  };

  return (
    <main className="login-container">

      <div className="login-card">
        <h2>Iniciar sesión</h2>

        {generalError && (
          <div className="error-general" role="alert" aria-live="assertive">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              ref={refs.correo}
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              aria-invalid={!!errors.correo}
              aria-describedby={errors.correo ? "error-correo" : undefined}
            />
            {errors.correo && (
              <span id="error-correo" className="error" role="alert">
                {errors.correo}
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
            ref={submitButtonRef}
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
