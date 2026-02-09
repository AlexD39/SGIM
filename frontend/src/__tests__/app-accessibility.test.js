import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function renderRoute(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe("Navegación y accesibilidad", () => {
  test("renderiza navbar y links principales", () => {
    renderRoute("/");

    expect(screen.getByRole("link", { name: /crear cuenta/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ir al inicio/i })).toBeInTheDocument();
  });

  test("click en 'Iniciar sesión' navega a /login", async () => {
    const user = userEvent.setup();
    renderRoute("/");

    // ⚠️ Importante: buscamos SOLO el link del navbar
    const nav = screen.getByRole("navigation", {
      name: /navegación principal/i,
    });

    const loginLink = within(nav).getByRole("link", {
      name: /iniciar sesión/i,
    });

    await user.click(loginLink);

    // Ahora validamos el heading del Login (único y correcto)
    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  test("breadcrumbs muestra Inicio correctamente", () => {
    renderRoute("/");

    const breadcrumbs = screen.getByRole("navigation", {
      name: /ruta de navegación/i,
    });

    expect(
      within(breadcrumbs).getByRole("link", { name: /^inicio$/i })
    ).toBeInTheDocument();
  });
});
