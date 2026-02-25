# Animaciones accesibles en SGIM (Semana de animaciones)

## Objetivo

Usar animaciones **solo cuando aportan valor**, respetando:

- `prefers-reduced-motion`
- navegación con teclado
- foco y lectores de pantalla

## ¿Dónde se aplicaron animaciones?

- **Botones principales**
  - `Login` (`login.css`), `Register` (`register.css`), botones de formularios y comentarios (`formulario.css`, `dashboard.css`).
  - Pequeñas transiciones en `background-color` y `transform` para dar feedback al usuario al hacer hover / focus / click.

- **Modal de SweetAlert2**
  - Archivo: `Frontend/src/services/swal.js` + estilos en `App.css`.
  - Animación corta de entrada/salida (`motion-fade-in-up` / `motion-fade-out-down`) aplicada a `swal2-popup`.

- **Mensajes de estado**
  - En `App.css` se añadió una transición suave de opacidad para elementos con `role="status"` (por ejemplo, mensajes vacíos o de carga).

## Respeto a prefers-reduced-motion

- En `Frontend/src/index.css` se añadió:
  - Media query `@media (prefers-reduced-motion: reduce)` que reduce al mínimo la duración de animaciones y transiciones globales.
  - Desactiva el scroll suave global cuando el usuario pide menos movimiento.

- En `swal.js`:
  - Antes de mostrar el modal se evalúa `window.matchMedia("(prefers-reduced-motion: reduce)")`.
  - Si el usuario pide **reducir movimiento**, **no** se aplican las clases de animación (`swal2-motion-in` / `swal2-motion-out`).
  - Si no, se aplica una animación corta y discreta sobre el popup.

## ¿Por qué estas animaciones?

- **Botones**
  - Comunican de forma rápida que el botón es interactivo (hover/focus) y que se ha presionado (pequeño movimiento).
  - La animación es sutil, no bloquea el foco ni cambia el layout de forma brusca.

- **Modal de errores/éxito (SweetAlert2)**
  - Hace más evidente el mensaje crítico (error de login, éxito al enviar un reporte).
  - La animación es corta y se desactiva automáticamente si el usuario prefiere menos movimiento.

- **Mensajes de estado**
  - Un leve cambio de opacidad ayuda a percibir que algo nuevo apareció (por ejemplo, “No hay incidencias”).
  - Sigue siendo legible para lectores de pantalla gracias a `role="status"` y `aria-live` donde aplica.

En conjunto, estas animaciones mejoran la comprensión de cambios de estado sin sobre-animar la interfaz, ni romper accesibilidad ni rendimiento.

