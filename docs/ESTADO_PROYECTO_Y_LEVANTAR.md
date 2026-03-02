# Estado del proyecto SGIM y cómo levantar Front + Back

## Lo que lleva el equipo (resumen)

### Backend (Express + PostgreSQL)
- **API REST**: health, login (JWT), `/me`, reportes (crear con imagen), rutas admin.
- **Base de datos**: `database/init.sql` con tablas `users`, `reports`, `attachments` y usuarios seed (`admin@sgim.com` / `user@sgim.com` con contraseña `123456`).
- **Auth**: JWT (Bearer), middleware `authRequired` y `requireRole("admin")`.
- **Tests**: Jest + Supertest (rutas y JWT); mock de DB para no depender de PostgreSQL en CI.
- **Subida de archivos**: Multer para evidencia en `POST /reports`.

### Frontend (React)
- **Rutas**: `/`, `/login`, `/register`, `/formulario`, `/tablero`, `/admin/dashboard`, `/500`, 404.
- **Auth**: contexto `AuthContext` (login/logout), usuario en `localStorage`, rutas protegidas por rol (`ProtectedRoute`).
- **Páginas**: Login (simulado con usuarios hardcodeados), formulario de reportes (guarda en `localStorage`), tablero y dashboard (leen de `localStorage`).
- **Accesibilidad**: navegación por teclado, `aria-*`, roles, tests de interacción.
- **Estilos**: CSS por página (login, formulario, tablero, dashboard, etc.).

### Infra y CI
- **Docker**: `docker-compose.yml` con backend (Node), PostgreSQL con volumen y `init.sql`.
- **CI**: `.github/workflows/main.yml` (lint y tests front/back).

---

## Qué falta (para dejarlo redondo)

1. **Conectar front con back**: El frontend aún no llama al API; login y reportes usan `localStorage`/simulación.
2. **Variable de API en el front**: Definir `REACT_APP_API_URL=http://localhost:3000` (o la URL del backend) y usarla en un servicio de API.
3. **Rol usuario vs usuario**: La BD usa el rol `usuario` y el front espera `user`; hay que mapear en el login (p. ej. mostrar como `user` en el contexto) o aceptar `usuario` en `ProtectedRoute`/navbar.
4. **SweetAlert2 / manejo de errores**: Para Semana 7, usar SweetAlert2 (o similar) para errores de red y mensajes de éxito/error.
5. **Deploy parcial**: Dejar front (y opcionalmente back) desplegado (Vercel, Render, etc.).

---

## Cómo levantar el proyecto

### Opción A: Todo con Docker (Backend + DB)

Solo levanta backend y base de datos. El frontend lo corres en tu máquina para tener hot-reload.

1. **Requisitos**: Docker y Docker Compose. En la raíz del repo:

```bash
docker-compose up -d
```

- **DB**: PostgreSQL en `localhost:5432` (usuario `sgim`, contraseña `sgim`, base `sgim`).
- **Backend**: `http://localhost:3000` (health: `http://localhost:3000/health`).

2. **Frontend en local** (puerto 3001):

```bash
cd Frontend
npm install
npm start
```

Abre `http://localhost:3001`. El front por ahora no llama al backend; cuando lo conectes, usa `REACT_APP_API_URL=http://localhost:3000`.

---

### Opción B: Todo en local (sin Docker)

1. **PostgreSQL**  
   - Instalado y corriendo en `localhost:5432`.  
   - Crear base y usuario (o usar los del `init.sql`):

   - Usuario: `sgim`, contraseña: `sgim`, base: `sgim`.  
   - Ejecutar el script inicial:

   ```bash
   psql -U sgim -d sgim -f database/init.sql
   ```

2. **Backend**

```bash
cd backend
cp .env.example .env   # si existe; si no, crear .env con las variables abajo
npm install
npm run dev
```

**.env del backend** (ejemplo):

```env
PORT=3000
DB_USER=sgim
DB_HOST=127.0.0.1
DB_PASSWORD=sgim
DB_NAME=sgim
DB_PORT=5432
JWT_SECRET=tu_secreto_aqui
JWT_EXPIRES=8h
```

3. **Frontend**

```bash
cd Frontend
npm install
npm start
```

Por defecto Create React App usa el puerto 3001 si el 3000 está ocupado. Si quieres fijar el puerto, en `Frontend/.env`:

```env
PORT=3001
# Cuando conectes el API:
# REACT_APP_API_URL=http://localhost:3000
```

---

## Comprobar que todo está arriba

- **Backend**:  
  `curl http://localhost:3000/health` → `{"ok":true}`

- **Login en API**:  
  `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@sgim.com\",\"password\":\"123456\"}"`  
  Debe devolver `token` y `user`.

- **Frontend**:  
  Abrir `http://localhost:3001` (o el puerto que use) y navegar a Login. Hoy el login es simulado; cuando conectes el API, usarás ese token para las rutas protegidas del backend.

---

## Resumen de puertos

| Servicio   | Puerto | URL                    |
|-----------|--------|------------------------|
| Backend   | 3000   | http://localhost:3000  |
| Frontend  | 3001   | http://localhost:3001  |
| PostgreSQL| 5432   | localhost:5432         |

Con esto puedes levantar front y back y, cuando implementes el consumo del API, usar `REACT_APP_API_URL` y el manejo de errores (p. ej. SweetAlert2) según Semana 7.
