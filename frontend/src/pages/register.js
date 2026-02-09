import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function Register() { 

    useEffect(() => {
            document.title = "SGIM | Registro de usuario";
          }, []);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔹 Aquí después irá el fetch al backend
    // await fetch("/api/register", ...)

    setTimeout(() => {
      setLoading(false);
      alert("Cuenta creada correctamente. Inicia sesión.");
      navigate("/login");
    }, 1000);
    }
    
    
    return (
        <main style={{ padding: "2rem" }}>
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" required />
        <br />
        <input type="password" placeholder="Contraseña" required />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </main>
      );
}
export default Register;