import { useEffect } from "react";

function Login() { 
    useEffect(() => {
        document.title = "SGIM | Iniciar sesión";
      }, []);

     return (
    <section>
      <h1>Iniciar sesión</h1>
      <p>Bienvenida al sistema</p>
    </section>
  );
}
export default Login;