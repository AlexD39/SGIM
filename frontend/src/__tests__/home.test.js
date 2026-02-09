import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const renderRoute = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("Home", () => {
  test("muestra el título principal", () => {
    renderRoute("/");

    expect(
      screen.getByRole("heading", {
        name: /sistema de gestión de incidencias universitarias/i,
      })
    ).toBeInTheDocument();
  });

  test("muestra texto de bienvenida", () => {
    renderRoute("/");

    expect(
      screen.getByText(/bienvenido al sistema/i)
    ).toBeInTheDocument();
  });

  test("actualiza document.title", () => {
    renderRoute("/");
    expect(document.title).toBe("Gestión de Incidencias");
  });
});
