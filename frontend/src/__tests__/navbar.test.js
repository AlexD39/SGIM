import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const renderRoute = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("Navbar", () => {
  test("tiene región de navegación con nombre accesible", () => {
    renderRoute("/");

    const nav = screen.getByRole("navigation", { name: /navegación principal/i });
    expect(nav).toBeInTheDocument();
  });

  test("muestra logo con alt y link de regreso al inicio", () => {
    renderRoute("/");

    const nav = screen.getByRole("navigation", { name: /navegación principal/i });

    // Imagen accesible
    expect(within(nav).getByRole("img", { name: /logo de la universidad/i })).toBeInTheDocument();

    // Link accesible por aria-label
    const homeLink = within(nav).getByRole("link", { name: /ir al inicio/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("muestra links: Crear cuenta y Iniciar sesión con href correcto", () => {
    renderRoute("/");

    const nav = screen.getByRole("navigation", { name: /navegación principal/i });

    const registerLink = within(nav).getByRole("link", { name: /crear cuenta/i });
    const loginLink = within(nav).getByRole("link", { name: /iniciar sesión/i });

    expect(registerLink).toHaveAttribute("href", "/register");
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
