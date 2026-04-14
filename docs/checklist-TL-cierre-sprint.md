# Checklist TL — cierre de sprint (SGIM)

Usar antes de dar por cerrada la entrega de **protección por roles** u otro hito.

## Código y `main`

- [ ] `main` en GitHub tiene el merge acordado (PR revisado).
- [ ] Equipo alineado: nuevas tareas salen de `main` actualizado (`git pull origin main`).
- [ ] No quedan PRs obsoletos abiertos sin propósito (cerrar o marcar draft).

## Calidad

- [ ] **Backend:** `npm test` en carpeta `backend` pasa en local con `NODE_ENV=test`.
- [ ] **Frontend:** `npm run build` en `frontend` compila sin errores.
- [ ] **CI:** workflow en `.github/workflows/main.yml` en verde en el último push a `main`.

## Seguridad / roles

- [ ] Matriz breve **ruta o pantalla → rol mínimo** (README o comentario en PR).
- [ ] QA entregó **evidencia** de bloqueo (401/403 o redirección) para usuario incorrecto o sin sesión.
- [ ] Rol en JWT coincide con el esperado en front (`usuario` / `admin` según BD).

## Integración multisesión (opcional en local)

- [ ] Tests `auth.test.js` solo corren en **CI** o con Postgres local y  
  `SGIM_RUN_AUTH_INTEGRATION=1` (ver `npm run test:integration` en `backend/package.json` si existe).

## Comunicación

- [ ] Mensaje corto al equipo: qué quedó en `main`, qué sigue la próxima semana.
