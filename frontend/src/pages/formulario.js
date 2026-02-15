import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/formulario.css";

function Formulario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: null,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  

  // 🔎 Validaciones
  const validateField = (name, value) => {
    let error = "";

    if (name === "titulo") {
      if (!value.trim()) error = "El título es obligatorio";
      else if (value.trim().length < 10)
        error = "El título debe tener al menos 10 caracteres";
    }

    if (name === "descripcion") {
      if (!value.trim()) error = "La descripción es obligatoria";
      else if (value.trim().length < 20)
        error = "La descripción debe tener al menos 20 caracteres";
    }

    if (name === "imagen") {
      if (!value) error = "La imagen es obligatoria";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));

      const fieldError = validateField(name, file);

      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));

      return;
    }

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

  // 🔄 Validación global
  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    const hasEmptyFields =
      !formData.titulo ||
      !formData.descripcion ||
      !formData.imagen;

    setIsFormValid(!hasErrors && !hasEmptyFields);
  }, [errors, formData]);

  // Submit simulado
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de envío
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Incidencia enviada correctamente");

      setTimeout(() => {
        navigate("/tablero");
      }, 3000);
    }, 1500);
  };

  return (
    <main className="form-container">
      <div className="form-card">
        <h2>Reportar Incidencia</h2>

        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              aria-invalid={!!errors.titulo}
            />
            {errors.titulo && (
              <span className="error">{errors.titulo}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              aria-invalid={!!errors.descripcion}
            />
            {errors.descripcion && (
              <span className="error">{errors.descripcion}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen</label>

            <div className="custom-file-container">
              <input
                id="imagen"
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                aria-invalid={!!errors.imagen}
                aria-describedby="file-name"
                className="file-input-hidden"
              />

              <label htmlFor="imagen" className="custom-file-button">
                Seleccionar imagen
              </label>

              <span id="file-name" className="file-name">
                {formData.imagen
                  ? formData.imagen.name
                  : "Ningún archivo seleccionado"}
              </span>
            </div>

            {errors.imagen && (
              <span className="error">{errors.imagen}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
          >
            {loading ? "Enviando..." : "Enviar incidencia"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Formulario;