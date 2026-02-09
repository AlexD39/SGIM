import { useEffect } from "react";

function Formulario() { 
     useEffect(() => {
            document.title = "SGIM | Formulario de reporte";
          }, []);

    return (        
    <section>
      <h1>Formulario de reporte</h1>
      <p>Complete los datos del reporte</p>
    </section>
  );
}
export default Formulario;