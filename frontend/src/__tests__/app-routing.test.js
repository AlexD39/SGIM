import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const renderRoute = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("Rutas principales", () => {
  test("ruta / muestra Home y cambia document.title", () => {
    renderRoute("/");

    expect(
      screen.getByRole("heading", {
        name: /sistema de gestión de incidencias universitarias/i,
      })
    ).toBeInTheDocument();

    expect(document.title).toBe("Gestión de Incidencias");
  });

  test("ruta /register muestra el formulario", () => {
    renderRoute("/register");

    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();

    // inputs accesibles por label
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

    // title de Register
    expect(document.title).toBe("SGIM | Registro de usuario");
  });

  test("ruta desconocida muestra NotFound", () => {
    renderRoute("/no-existe");

    // Ajusta esto al texto real de tu NotFound:
    expect(
      screen.getByText(/no encontrado|404|not found/i)
    ).toBeInTheDocument();
  });
});
