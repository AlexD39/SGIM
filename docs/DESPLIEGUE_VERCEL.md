# Desplegar el frontend en Vercel

Repositorio: [AlexD39/sgim](https://github.com/AlexD39/sgim).

## 1. Importar el proyecto

1. En [Vercel](https://vercel.com): **Add New… → Project** e importa el repo `sgim`.
2. **Root Directory**: elige `frontend` (monorepo: el API no va en Vercel).
3. Framework: **Create React App** (o detección automática).
4. **Build Command**: `npm run build` (por defecto).
5. **Output Directory**: `build` (por defecto en CRA).

El archivo `frontend/vercel.json` ayuda a que rutas de React Router (por ejemplo `/forgot-password`) no den 404 al recargar.

## 2. Variable de entorno obligatoria

En el proyecto Vercel: **Settings → Environment Variables**:

| Nombre | Valor (ejemplo) | Entornos |
|--------|-----------------|----------|
| `REACT_APP_API_URL` | `https://tu-backend-publico.com` | Production (y Preview si aplica) |

Sin esto, el build puede usar el valor por defecto de desarrollo y el sitio llamará a `localhost`, que **no funciona** en producción.

Tras crear o cambiar variables, haz un **Redeploy**.

## 3. Backend (fuera de Vercel)

El API debe estar desplegado en otro servicio (Render, Railway, Fly.io, VPS, etc.) y debe:

- Permitir **CORS** desde el dominio de Vercel (si el backend lo restringe por origen).
- Usar Postgres con la tabla `password_reset_tokens` (ver `database/init.sql` o `database/migrate_password_reset_tokens.sql`).
- Definir en el servidor: `JWT_SECRET`, `DATABASE_URL` (o variables de DB que use el proyecto), y para correo de recuperación: `FRONTEND_URL` (URL del front en Vercel), `RESEND_API_KEY` y `RESEND_FROM` si usan Resend.

## 4. Desarrollo local

Copia `frontend/.env.example` a `frontend/.env` y ajusta `REACT_APP_API_URL`. El archivo `.env` **no** se sube al repo (está en `.gitignore`).
