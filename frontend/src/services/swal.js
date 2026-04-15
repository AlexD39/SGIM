import Swal from "sweetalert2";

/**
 * Paleta SGIM: verde principal #008d71, hover #006651
 */
const CONFIRM_BUTTON_COLOR = "#008d71";

/**
 * Servicio centralizado de mensajes con SweetAlert2.
 * Usado para manejo de errores y éxitos (Semana 7 - comunicación asíncrona accesible).
 * SweetAlert2 es accesible (WAI-ARIA) y reemplaza alert() / mensajes inline en casos críticos.
 */

/**
 * Muestra un modal de error.
 * @param {string} titulo - Título del modal (ej. "Error al iniciar sesión")
 * @param {string} mensaje - Texto del error (ej. mensaje del API o genérico)
 */
export function mostrarError(titulo, mensaje) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return Swal.fire({
    icon: "error",
    title: titulo,
    text: mensaje || "Ha ocurrido un error. Intenta de nuevo.",
    confirmButtonText: "Entendido",
    confirmButtonColor: CONFIRM_BUTTON_COLOR,
    // Animación accesible: solo si el usuario NO pide reducir movimiento
    ...(reduceMotion
      ? {}
      : {
          showClass: { popup: "swal2-motion-in" },
          hideClass: { popup: "swal2-motion-out" },
        }),
  });
}

/**
 * Muestra un modal de éxito.
 * @param {string} titulo - Título (ej. "Listo")
 * @param {string} mensaje - Texto (ej. "Incidencia enviada correctamente")
 */
export function mostrarExito(titulo, mensaje) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return Swal.fire({
    icon: "success",
    iconColor: CONFIRM_BUTTON_COLOR,
    title: titulo,
    text: mensaje,
    confirmButtonText: "Continuar",
    confirmButtonColor: CONFIRM_BUTTON_COLOR,
    ...(reduceMotion
      ? {}
      : {
          showClass: { popup: "swal2-motion-in" },
          hideClass: { popup: "swal2-motion-out" },
        }),
  });
}

/**
 * Muestra error de conexión (red / timeout).
 */
export function mostrarErrorRed() {
  return mostrarError(
    "Error de conexión",
    "No se pudo conectar con el servidor. Revisa tu conexión a internet e intenta de nuevo."
  );
}
