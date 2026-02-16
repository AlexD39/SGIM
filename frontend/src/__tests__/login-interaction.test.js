import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/login";
import { AuthContext } from "../context/authContext";

describe("Login: teclado + estados accesibles", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("credenciales incorrectas -> role=alert y focus", async () => {
    render(
      <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "x@x.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "mal");

    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    // Avanzar el setTimeout(1000)
    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/correo o contraseña incorrectos/i);
    expect(alert).toHaveFocus();
  });

  test("Escape limpia el error general", async () => {
    render(
      <AuthContext.Provider value={{ user: null, login: jest.fn(), logout: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "x@x.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "mal");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
