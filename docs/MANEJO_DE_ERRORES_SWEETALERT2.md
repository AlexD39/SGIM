# Manejo de errores con SweetAlert2 (Semana 7)

## Objetivo

Centralizar el feedback de **éxitos** y **errores** en la interfaz usando **SweetAlert2**, para cumplir con el entregable de Semana 7: *Manejo de errores documentado* y comunicación asíncrona accesible.

SweetAlert2 es accesible (WAI-ARIA) y sustituye `alert()` y mensajes inline en casos críticos (errores de login, envío de formularios, fallos al cargar datos).

---

## Dónde está implementado

| Archivo | Uso |
|--------|-----|
| `Frontend/src/services/swal.js` | Servicio central: `mostrarError`, `mostrarExito`, `mostrarErrorRed`. |
| `Frontend/src/pages/login.js` | Error de credenciales incorrectas → `mostrarError("Error al iniciar sesión", ...)`. |
| `Frontend/src/pages/register.js` | Éxito al crear cuenta → `mostrarExito("Cuenta creada", "Tu cuenta se creó correctamente. Puedes iniciar sesión.")` y redirección a login. |
| `Frontend/src/pages/formulario.js` | Éxito al enviar incidencia → `mostrarExito("Listo", "Incidencia enviada correctamente.")` y redirección a tablero. |
| `Frontend/src/pages/tablero.js` | Error al leer/cargar incidencias (p. ej. localStorage corrupto) → `mostrarError("Error al cargar datos", ...)`. |
| `Frontend/src/pages/dashboard.js` | Error al cargar listado de incidencias → `mostrarError("Error al cargar datos", ...)`. |

---

## Tipos de errores cubiertos

- **Credenciales inválidas (login):** mensaje claro y modal accesible.
- **Error al enviar reporte:** cuando se conecte el API, se puede usar `mostrarError("Error al enviar", mensajeDelAPI)` o `mostrarErrorRed()` si falla la red.
- **Error al cargar datos (tablero/dashboard):** fallo al leer o parsear datos (p. ej. localStorage); en el futuro, fallos de red o respuestas 4xx/5xx del API.

Para **errores de red** (sin conexión, timeout) se debe usar `mostrarErrorRed()` desde `services/swal.js` en las llamadas al API (fetch/axios).

---

## Cómo usar en nuevo código

```javascript
import { mostrarError, mostrarExito, mostrarErrorRed } from "../services/swal";

// Éxito
mostrarExito("Título", "Mensaje opcional").then(() => {
  navigate("/ruta");
});

// Error con mensaje
mostrarError("Error al guardar", response?.message || "Intenta de nuevo.");

// Error de conexión
fetch(url).catch(() => mostrarErrorRed());
```

---

## Dependencia

- **SweetAlert2:** `npm install sweetalert2` (ya en `Frontend/package.json`).

Referencia: [SweetAlert2](https://sweetalert2.github.io/).
