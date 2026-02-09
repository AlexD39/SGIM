import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Breadcrumbs from "./components/breadcrumbs";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import ServerError from "./pages/serverError";
import Login from "./pages/login";
import Formulario from "./pages/formulario";
import Register from "./pages/register";
import "./App.css";

function App() {
  return (
    <>
      {/* Región para mensajes accesibles */}
      <div aria-live="polite" aria-atomic="true" />

      <Navbar />
      <Breadcrumbs />

      <main id="contenido-principal" className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
