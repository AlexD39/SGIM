# 🚀 Guía DevOps - SGIM

## 📋 Objetivos Semana 5

1. ✅ **CI/CD Implacable**: Pipeline pasa al 100%
2. ✅ **Calidad de Accesibilidad**: Validación automatizada de DOM dinámico, foco y ARIA
3. ✅ **Tests de Cobertura**: Reportes automáticos en cada push
4. ✅ **Entorno Docker Optimizado**: Hot reload para desarrollo en tiempo real

---

## 🐳 Docker - Desarrollo en Tiempo Real

### Desarrollo con Hot Reload

```bash
# Levantar entorno de desarrollo (hot reload activado)
docker-compose -f docker-compose.dev.yml up

# Frontend disponible en: http://localhost:3000
# Backend disponible en: http://localhost:3000 (puerto configurado)
# PostgreSQL disponible en: localhost:5432
```

**Características:**
- ✅ Hot reload automático (cambios se reflejan sin rebuild)
- ✅ Volúmenes sincronizados para desarrollo rápido
- ✅ `CHOKIDAR_USEPOLLING=true` para compatibilidad Windows
- ✅ Variables de entorno optimizadas para desarrollo

### Producción

```bash
# Build y deploy de producción
docker-compose up --build
```

---

## 🔄 CI/CD Pipeline

### Estructura del Pipeline

El workflow `.github/workflows/main.yml` ejecuta automáticamente:

1. **Lint de Accesibilidad** (`npm run lint`)
   - Valida reglas estrictas de `jsx-a11y`
   - Verifica DOM dinámico, foco y ARIA
   - **Falla el CI si hay errores** (`--max-warnings=0`)

2. **Tests con Cobertura** (`npm run test:coverage`)
   - Ejecuta todos los tests unitarios
   - Genera reporte de cobertura
   - Sube artifacts y reporte a Codecov

### Verificar Estado del CI

```bash
# Ver ejecuciones en GitHub Actions
https://github.com/AlexD39/SGIM/actions

# Ver reporte de cobertura (después de push)
# Descargar artifact "coverage-report-frontend" desde Actions
```

### Ejecutar Localmente (antes de push)

```bash
cd Frontend

# Lint
npm run lint

# Tests con cobertura
npm run test:coverage

# Corregir errores automáticamente (si es posible)
npm run lint:fix
```

---

## ♿ Validación de Accesibilidad

### Reglas Configuradas

El proyecto tiene reglas estrictas de accesibilidad en `.eslintrc.json`:

- ✅ **ARIA**: Props, tipos y elementos soportados
- ✅ **Roles**: Validación de roles requeridos y soportados
- ✅ **Foco**: Gestión correcta de foco en componentes dinámicos
- ✅ **Interacciones**: Eventos de teclado para elementos interactivos
- ✅ **Elementos estáticos**: Prevención de interacciones en elementos no interactivos

### Comandos

```bash
# Validar accesibilidad
npm run lint

# Corregir automáticamente (cuando sea posible)
npm run lint:fix
```

---

## 📊 Reportes de Cobertura

### Configuración

- **Umbral mínimo**: 50% (branches, functions, lines, statements)
- **Formatos**: text, lcov, html, json
- **Ubicación**: `Frontend/coverage/`

### Ver Reporte Local

```bash
cd Frontend
npm run test:coverage

# Abrir reporte HTML
# Windows: start coverage/lcov-report/index.html
# Linux/Mac: open coverage/lcov-report/index.html
```

### En CI/CD

- Reporte se sube automáticamente como artifact
- Disponible por 30 días en GitHub Actions
- Integración opcional con Codecov

---

## 🧪 Tests

### Estructura

- Tests en `Frontend/src/**/*.test.js`
- Configuración en `jest.config.js`
- Setup en `src/setupTests.js`

### Ejecutar Tests

```bash
# Modo watch (desarrollo)
npm test

# Una vez con cobertura
npm run test:coverage

# Modo CI (sin watch)
npm test -- --watchAll=false
```

---

## 🔧 Troubleshooting

### CI/CD Falla

1. **Lint falla**: Ejecutar `npm run lint` localmente y corregir errores
2. **Tests fallan**: Verificar que todos los tests pasen con `npm test`
3. **Cobertura baja**: Agregar más tests para alcanzar el 50%

### Docker Hot Reload No Funciona

1. Verificar que `CHOKIDAR_USEPOLLING=true` esté en el compose
2. En Windows, asegurar que Docker Desktop tenga acceso a volúmenes
3. Reiniciar contenedores: `docker-compose -f docker-compose.dev.yml restart`

### Accesibilidad No Valida

1. Verificar que `eslint-plugin-jsx-a11y` esté instalado
2. Revisar `.eslintrc.json` para reglas activas
3. Ejecutar `npm run lint` para ver errores específicos

---

## 📝 Checklist Pre-Push

Antes de hacer push, verificar:

- [ ] `npm run lint` pasa sin errores
- [ ] `npm run test:coverage` pasa todos los tests
- [ ] Cobertura >= 50%
- [ ] No hay warnings de accesibilidad
- [ ] Docker build funciona (`docker-compose build`)

---

## 🎯 Próximos Pasos

- [ ] Configurar Codecov para badges en README
- [ ] Agregar pre-commit hooks con Husky
- [ ] Configurar dependabot para dependencias
- [ ] Agregar staging environment en CI/CD
