import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/protectedRoute";
import { AuthContext } from "../context/authContext";

function renderProtected({ user, allowedRoles = ["admin"], start = "/privado" }) {
  return render(
    <AuthContext.Provider value={{ user, login: jest.fn(), logout: jest.fn() }}>
      <MemoryRouter initialEntries={[start]}>
        <Routes>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/login" element={<h1>Iniciar sesión</h1>} />

          <Route
            path="/privado"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <h1>Zona Privada</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("ProtectedRoute", () => {
  test("sin user redirige a /login", async () => {
    renderProtected({ user: null });
    expect(await screen.findByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test("con user pero role NO permitido redirige a /", async () => {
    renderProtected({ user: { role: "usuario" }, allowedRoles: ["admin"] });
    expect(await screen.findByRole("heading", { name: /inicio/i })).toBeInTheDocument();
  });

  test("con user y role permitido muestra children", async () => {
    renderProtected({ user: { role: "admin" }, allowedRoles: ["admin"] });
    expect(await screen.findByRole("heading", { name: /zona privada/i })).toBeInTheDocument();
  });

  test("acepta rol legado (rol) si no hay role", async () => {
    renderProtected({ user: { rol: "admin" }, allowedRoles: ["admin"] });
    expect(await screen.findByRole("heading", { name: /zona privada/i })).toBeInTheDocument();
  });
});
