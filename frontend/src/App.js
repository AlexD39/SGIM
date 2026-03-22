import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Breadcrumbs from "./components/breadcrumbs";
import ProtectedRoute from "./routes/protectedRoute";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import ServerError from "./pages/serverError";
import Login from "./pages/login";
import Formulario from "./pages/formulario";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Tablero from "./pages/tablero";
import "./App.css";

function App() {
  return (
    <>
      {/* Contenedor para anuncios de lectores de pantalla (A11y) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" />

      <Navbar />
      <Breadcrumbs />

      <main id="contenido-principal" className="main-content">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/500" element={<ServerError />} />

          {/* Rutas Protegidas - Usuario */}
          <Route 
            path="/formulario" 
            element={
              <ProtectedRoute allowedRoles={["usuario"]}>
                <Formulario />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tablero" 
            element={
              <ProtectedRoute allowedRoles={["usuario"]}>
                <Tablero />
              </ProtectedRoute>
            } 
          />

          {/* Rutas Protegidas - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Ruta 404 - Siempre al final */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;