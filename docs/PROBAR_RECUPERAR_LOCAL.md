# Probar recuperación de contraseña en local

Rama de referencia en GitHub: [`feature/recuperarContrasena`](https://github.com/AlexD39/sgim/tree/feature/recuperarContrasena).

## 1. Base de datos

Si tu Postgres **ya existía** antes del merge y **no** tiene la tabla `password_reset_tokens`:

```sql
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Con Docker:

```powershell
docker exec -i sgim-db psql -U sgim -d sgim -c "CREATE TABLE IF NOT EXISTS password_reset_tokens (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, used_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());"
```

(O ejecuta el `database/init.sql` completo en una BD nueva.)

## 2. Backend — archivo `.env`

El merge **eliminó** `backend/.env` del repo (correcto). Crea `backend/.env` a partir de `backend/.env.example` con tus valores reales, por ejemplo:

- `PORT=3000`
- `DB_*` iguales a tu Postgres
- **`JWT_SECRET`** obligatorio (el middleware lo exige)
- **`JWT_EXPIRES`** o el nombre que use `authController` para el token (revisa el código; suele ser `JWT_EXPIRES`)

Opcional:

- **`FRONTEND_URL=http://localhost:3001`** — enlace que verá el usuario en el correo (o en consola en dev).
- **`RESEND_API_KEY`** — si no está definida, el servidor **imprime el enlace completo en la consola** al pedir recuperación (útil para probar sin correo).

## 3. Arranque

Terminal 1:

```powershell
cd C:\Users\manne\SGIM\backend
npm install
npm start
```

Terminal 2:

```powershell
cd C:\Users\manne\SGIM\frontend
# Opcional: REACT_APP_API_URL=http://localhost:3000 en .env si el API no está en 3000
npm start
```

Front: rutas **`/forgot-password`** y **`/reset-password?token=...`**. En login hay enlace **“¿Olvidaste tu contraseña?”**.

## 4. Flujo manual

1. Ir a **Recuperar contraseña**, correo de prueba: `user@sgim.com` (o un usuario que exista en `users`).
2. Revisar la **consola del backend**: debe aparecer un bloque `[DEV] Resend sin API key` con una URL que incluye `token=...` (si no configuraste Resend).
3. Copiar esa URL en el navegador (mismo host donde corre React, p. ej. `http://localhost:3001/reset-password?token=...`).
4. Definir nueva contraseña y guardar.
5. **Login** con el correo y la nueva contraseña.

## 5. Probar solo con API (curl)

```powershell
# Solicitud (misma respuesta aunque el correo no exista)
curl -s -X POST http://localhost:3000/auth/forgot-password -H "Content-Type: application/json" -d "{\"email\":\"user@sgim.com\"}"

# Reset (pega el token que salió en consola)
curl -s -X POST http://localhost:3000/auth/reset-password -H "Content-Type: application/json" -d "{\"token\":\"TOKEN_HEX_AQUI\",\"newPassword\":\"nueva123456\"}"
```

## 6. Tu trabajo en stash

Si tenías cambios en otra rama, se guardaron con:

`git stash list` → `git stash pop` (puede haber conflictos tras el merge).
