import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { mostrarError } from "../services/swal";
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

    //aquí luego va el login real
    setTimeout(() => {
      // Simulación básica de JWT
        if (formData.email === "admin@sgim.com" && formData.password === "123456") {
          login({
            id: 1,
            nombre: "Administrador",
            rol: "admin",
          });

          navigate("/admin/dashboard");
        } 
        else if (formData.email === "estudiante@sgim.com" && formData.password === "123456") {
          login({
            id: 2,
            nombre: "Estudiante",
            rol: "user",
            matricula: "20210001",
          });

          navigate("/tablero");
        } else if (formData.email === "estudiante2@sgim.com" && formData.password === "123456") {
          login({
            id: 3,
            nombre: "Estudiante 2",
            rol: "user",
            matricula: "20210002",
          });

          navigate("/tablero");
        } else {
          setLoading(false);
          mostrarError("Error al iniciar sesión", "Correo o contraseña incorrectos.");
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
