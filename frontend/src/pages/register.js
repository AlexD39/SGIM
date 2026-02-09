import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./register.css";

function Register() {
  useEffect(() => {
    document.title = "SGIM | Registro de usuario";
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    matricula: "",
    telefono: "",
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // refs para manejo de foco
  const refs = {
    nombre: useRef(null),
    apellido: useRef(null),
    matricula: useRef(null),
    telefono: useRef(null),
    correo: useRef(null),
    password: useRef(null),
  };

  const validateField = (name, value) => {
  let error = "";

  switch (name) {
    case "nombre":
      if (!value.trim()) error = "El nombre es obligatorio";
      break;

    case "apellido":
      if (!value.trim()) error = "El apellido es obligatorio";
      break;

    case "matricula":
      if (!value) {
        error = "La matrícula es obligatoria";
      } else if (value.length !== 10) {
        error = "La matrícula debe tener exactamente 10 números";
      }
      break;

    case "telefono":
      if (!value) {
        error = "El teléfono es obligatorio";
      } else if (value.length !== 10) {
        error = "El teléfono debe tener exactamente 10 números";
      }
      break;

    case "correo":
      if (!value) {
        error = "El correo es obligatorio";
      } else if (!value.includes("@")) {
        error = "El correo debe contener un @";
      }
      break;

    case "password":
      if (!value) error = "La contraseña es obligatoria";
      break;

    default:
      break;
  }

  return error;
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "matricula" || name === "telefono") {
    newValue = value.replace(/\D/g, "").slice(0, 10);
  }
    
    setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  // 🔹 feedback en tiempo real
  const fieldError = validateField(name, newValue);

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


  const validate = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";

    if (!formData.matricula) {
    newErrors.matricula = "La matrícula es obligatoria";
    } else if (formData.matricula.length < 10) {
    newErrors.matricula = "La matrícula debe tener exactamente 10 números";
    }
    
    if (!formData.telefono) {
    newErrors.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.length < 10) {
    newErrors.telefono = "El teléfono debe tener exactamente 10 números";
    }

    if (!formData.correo) {
    newErrors.correo = "El correo es obligatorio";
    } else if (!formData.correo.includes("@")) {
    newErrors.correo = "El correo debe contener un @";
    }

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // mover foco al primer error
      const firstErrorField = Object.keys(validationErrors)[0];
      refs[firstErrorField].current.focus();
      return;
    }

    setLoading(true);

    // 🔹 Aquí luego va el fetch real
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <main className="register-container">

      {/* Error general */}
      {generalError && (
        <div className="error-general" role="alert" aria-live="assertive">
          {generalError}
        </div>
      )}

      <div className="register-card">
         <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            ref={refs.nombre}
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? "error-nombre" : undefined}
          />
          {errors.nombre && (
            <span id="error-nombre" className="error" role="alert">
              {errors.nombre}
            </span>
          )}
        </div>

        {/* Apellido */}
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            ref={refs.apellido}
            id="apellido"
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            aria-invalid={!!errors.apellido}
            aria-describedby={errors.apellido ? "error-apellido" : undefined}
          />
          {errors.apellido && (
            <span id="error-apellido" className="error" role="alert">
              {errors.apellido}
            </span>
          )}
        </div>

        {/* Matrícula */}
        <div className="form-group">
          <label htmlFor="matricula">Matrícula</label>
          <input
            ref={refs.matricula}
            id="matricula"
            name="matricula"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.matricula}
            onChange={handleChange}
            aria-invalid={!!errors.matricula}
            aria-describedby={errors.matricula ? "error-matricula" : undefined}
          />
          {errors.matricula && (
            <span id="error-matricula" className="error" role="alert">
              {errors.matricula}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            ref={refs.telefono}
            id="telefono"
            name="telefono"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.telefono}
            onChange={handleChange}
            aria-invalid={!!errors.telefono}
            aria-describedby={errors.telefono ? "error-telefono" : undefined}
          />
          {errors.telefono && (
            <span id="error-telefono" className="error" role="alert">
              {errors.telefono}
            </span>
          )}
        </div>

        {/* Correo */}
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

        {/* Contraseña */}
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
        </div>

        <button type="submit" disabled={!isFormValid || loading} aria-disabled={!isFormValid || loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      </div>
    </main>
  );
}

export default Register;
