import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthContext } from "../context/authContext";

describe("Interacciones por teclado: navegación", () => {
  test("permite llegar por Tab al link de Iniciar sesión y activarlo con Enter", async () => {
    render(
      <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn() }}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const loginLink = await screen.findByRole("link", { name: /iniciar sesión/i });

    // Tab hasta llegar al link
    for (let i = 0; i < 30; i++) {
  await userEvent.tab();
  if (loginLink.matches(":focus")) break;
}
expect(loginLink).toHaveFocus();


    expect(loginLink).toHaveFocus();

    const onClick = jest.fn();
    loginLink.addEventListener("click", onClick);

    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });
});
