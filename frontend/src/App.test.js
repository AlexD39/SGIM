import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthContext } from "./context/authContext";

test("renderiza la navegación principal", () => {
  render(
    <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn() }}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // algo real que exista en tu UI
  expect(screen.getByRole("navigation", { name: /navegación principal/i })).toBeInTheDocument();
});
