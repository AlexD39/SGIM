# SGIM  
**Sistema de Gestión de Incidencias de Mantenimiento**

SGIM es una **aplicación web** diseñada para instituciones educativas que permite **reportar, gestionar y dar seguimiento** a incidencias relacionadas con el mantenimiento de la infraestructura (instalaciones, equipos y espacios).

El objetivo principal es reemplazar los reportes informales por un sistema **centralizado, trazable, accesible y escalable**, mejorando la eficiencia operativa del área de mantenimiento.

---

## 🚨 Problema que resuelve

En muchas instituciones educativas, los problemas de infraestructura se reportan de forma informal (mensajes, avisos verbales o no se reportan), lo que provoca:

- Incidencias olvidadas o no atendidas  
- Falta de seguimiento  
- Desorganización  
- Desconocimiento del estado de los reportes  
- Pérdida de tiempo para usuarios y encargados  

SGIM centraliza estos reportes y define flujos claros desde su registro hasta su resolución.

---

## 👥 Usuarios del sistema

### Reportante
- Alumnos  
- Docentes  
- Personal administrativo  

Funciones:
- Crear reportes de incidencias  
- Adjuntar evidencia fotográfica  
- Consultar el estado de sus reportes  

### Encargado de mantenimiento
Funciones:
- Visualizar todos los reportes  
- Validar información  
- Cambiar el estado de las incidencias  
- Dar seguimiento y mantener historial  

---

## 🎯 Alcance del MVP

Funcionalidades incluidas en la primera versión:

- Autenticación de usuarios  
- Creación de reportes con:
  - Título  
  - Descripción  
  - Ubicación  
  - Fotografía  
- Visualización de reportes por estado  
- Validación de reportes  
- Cambio de estado:
  - Pendiente  
  - En proceso  
  - Resuelto  
- Historial básico de reportes  

⚠️ Funcionalidades avanzadas como notificaciones, métricas o asignación automática de técnicos quedan fuera del MVP.

---

## 🧱 Arquitectura del sistema

### Enfoque arquitectónico
Arquitectura **monolítica modular**, elegida para:
- Reducir complejidad inicial  
- Facilitar desarrollo y mantenimiento  
- Permitir escalabilidad futura  

---

### Frontend
- Aplicación web
- Diseño orientado a accesibilidad
- Navegación completa mediante teclado
- Pensado en flujos, no solo en pantallas

---

### Backend
API REST organizada por módulos:

