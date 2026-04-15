import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/login";
import { AuthContext } from "../context/authContext";
import * as swal from "../services/swal";

jest.mock("../services/swal");

describe("Login: teclado + estados accesibles", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    swal.mostrarError.mockResolvedValue({});
    swal.mostrarExito = jest.fn().mockResolvedValue({});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Correo o contraseña incorrectos." }),
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("credenciales incorrectas muestran error con SweetAlert2", async () => {
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
      await Promise.resolve();
    });

    expect(swal.mostrarError).toHaveBeenCalledWith(
      "Error al iniciar sesión",
      "Correo o contraseña incorrectos."
    );
  });
});
