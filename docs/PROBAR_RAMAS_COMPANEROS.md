# Probar en local lo que hicieron tus compañeros (Git)

Guía rápida para **traer ramas del remoto** `origin` (repo [AlexD39/SGIM](https://github.com/AlexD39/SGIM)) y probarlas sin perder tu trabajo.

---

## 1. Ver qué ramas hay en el servidor

```powershell
cd C:\Users\manne\SGIM
git fetch origin
git branch -r
```

Ejemplos útiles:

| Rama remota | Suele contener |
|-------------|----------------|
| `origin/feature/multisession` | Backend: sesiones JWT, `/auth/logout-all`, tabla `sessions` |
| `origin/feature/multisession-frontend` | Navbar, `AuthContext`, tablero “cerrar otras sesiones” |
| `origin/feature/login-accessibility` | Mejoras de accesibilidad en login |
| `origin/main` | Línea base del equipo |

---

## 2. Guardar tus cambios antes de cambiar de rama

Si tienes archivos modificados:

```powershell
git status
git stash push -m "descripción" -- ruta\al\archivo.js
# o todo:
git stash push -m "WIP"
```

Recuperar después:

```powershell
git stash list
git stash pop
```

---

## 3. Opción A — Ver **solo** una rama (como la subió tu compañero)

```powershell
git fetch origin
git checkout -b prueba/nombre origin/feature/multisession-frontend
```

Así el proyecto queda **exactamente** como en esa rama (backend puede quedar desactualizado si la rama solo tocó frontend).

---

## 4. Opción B — Rama local que **combina** multisession + frontend (recomendado)

Ya existe en este repo una rama pensada para probar el flujo completo:

```powershell
git fetch origin
git checkout local/prueba-multisession
```

Se creó a partir de `origin/main` y encima se fusionaron:

- `origin/feature/multisession`
- `origin/feature/multisession-frontend`

Si quieres **recrearla desde cero** en otro clon:

```powershell
git fetch origin
git checkout -b local/prueba-multisession origin/main
git merge origin/feature/multisession -m "merge multisession backend"
git merge origin/feature/multisession-frontend -m "merge multisession frontend"
```

---

## 5. Base de datos (multisesión)

Si usas Docker / `init.sql` desde cero, la tabla `sessions` se crea sola.

Si tu Postgres **ya existía** antes de ese cambio, ejecuta solo la parte de `sessions` de `database/init.sql` o recrea el volumen de Docker según indique tu `docker-compose`.

---

## 6. Arrancar backend y frontend

**Backend** (ajusta `PORT` en `backend/.env` si hace falta; por defecto `3000` en código, muchos ejemplos usan `3001`):

```powershell
cd backend
npm install
npm start
```

**Frontend:**

En `frontend/.env` conviene:

```env
PORT=3000
REACT_APP_API_URL=http://localhost:3001
```

(Usa el mismo host/puerto donde corre el API; el **login** del proyecto apunta a ese valor en muchos commits.)

```powershell
cd frontend
npm install
npm start
```

**CORS:** el backend permite orígenes `http://localhost:3000`, `3001` y `3003`. El origen que importa es el del **navegador** (donde abres React), no el puerto del API.

---

## 7. Volver a tu rama de trabajo

```powershell
git checkout feature/login-accessibility
git stash pop   # si habías hecho stash
```

---

## 8. Nota sobre “cerrar otras sesiones”

En la rama del frontend llegó un **placeholder** (`https://tu-api.com/...`). En la rama local `local/prueba-multisession` se corrigió para llamar a:

`POST {REACT_APP_API_URL}/auth/logout-all`

con el mismo `API_BASE` que debes alinear con login y `.env`.

---

## Resumen de comandos mínimos

```powershell
cd C:\Users\manne\SGIM
git fetch origin
git checkout local/prueba-multisession
# BD con tabla sessions → levantar docker o aplicar init.sql
# backend/.env + frontend/.env con mismo puerto de API
# terminal 1: cd backend && npm start
# terminal 2: cd frontend && npm start
```
