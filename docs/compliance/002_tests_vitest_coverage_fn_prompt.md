@~/.claude/prompts/new_functionality_prompt_spec.md

# Configurar Tests Unitarios y Cobertura con Vitest

## Role
Act as a Software Developer with expertise in Next.js, React Testing Library, Vitest, and test coverage reporting.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — Landing page AIFormación en Next.js 16.2.4 / React 19 / TypeScript.

El fichero principal es `app/page.tsx` (1.411 líneas) que contiene:
- Constantes de datos: `MODULES` (6 items), `FEATURES` (6 items), `TESTIMONIALS` (3 items), `PLANS` (3 items)
- Componente `Home` con estado `activeModule` gestionado con `useState`
- Secciones: Nav, Hero, Features, Curriculum (acordeón), Mentores, Pricing, Testimonios, CTA, Footer

No existe ningún framework de tests. No hay script `test` en `package.json`.

**Issues corregidos:** `cq_tests_minimos`, `cq_cobertura_alta`

## Task
Configurar Vitest con React Testing Library y escribir un conjunto de tests que cubra los flujos críticos del componente.

### Tests Guidelines

**Instalación de dependencias:**
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitest/coverage-v8
```

**Configuración:**
1. Crear `vitest.config.ts` con environment `jsdom`, setup files y coverage en `v8`
2. Actualizar `package.json`: añadir scripts `"test": "vitest"`, `"test:ci": "vitest run"`, `"coverage": "vitest run --coverage"`
3. Crear `tests/setup.ts` con `import '@testing-library/jest-dom'`

**Tests a implementar** en `tests/page.test.tsx`:

| Test | Descripción |
|------|-------------|
| Render del componente | El componente `Home` renderiza sin errores |
| Sección Hero | Contiene el texto "DOMINA" y el badge de convocatoria |
| Módulo acordeón — estado inicial | El módulo 01 está expandido por defecto (índice 0 activo) |
| Módulo acordeón — toggle | Click en un módulo lo expande; click de nuevo lo colapsa |
| Módulo acordeón — exclusividad | Abrir módulo 02 colapsa el módulo 01 |
| Sección Features | Renderiza los 6 feature cards |
| Sección Pricing | Renderiza los 3 planes con sus CTAs |
| Plan destacado | El plan "Pro" tiene el badge "MÁS POPULAR" |
| Testimonios | Renderiza los 3 testimonios con nombre y role |
| Navegación | Los links de nav (#programa, #mentores, #precios) están presentes |
| Footer | Contiene "AIFormación" y copyright 2026 |
| Datos constantes | Exportar y verificar que MODULES tiene 6 items, PLANS tiene 3 |

**Cobertura objetivo:** >60% de líneas en `app/page.tsx`

## Output format
- `vitest.config.ts` — configuración de Vitest
- `tests/setup.ts` — setup de jest-dom
- `tests/page.test.tsx` — tests del componente Home
- `package.json` actualizado con nuevos scripts y devDependencies

## Examples and Steps to follow

1. Instalar dependencias con `npm install -D ...`
2. Crear `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**'],
      thresholds: { lines: 60 },
    },
  },
})
```
3. Crear `tests/setup.ts` con el import de jest-dom
4. Escribir los tests en `tests/page.test.tsx` usando `render`, `screen`, `userEvent`
5. Ejecutar `npm run test:ci` para validar que todos pasan
6. Ejecutar `npm run coverage` para verificar que supera el 60%

## Output checklist and Guardrails

- [ ] `npm run test:ci` pasa sin errores
- [ ] `npm run coverage` muestra >60% de cobertura en `app/page.tsx`
- [ ] Todos los tests descritos en la tabla están implementados
- [ ] No hay mocks de módulos de Next.js que oculten comportamiento real
- [ ] `package.json` tiene los scripts `test`, `test:ci` y `coverage`
- [ ] El comando `npm run lint` sigue pasando después de los cambios
- [ ] El fichero `tests/` está en `.gitignore` de coverage (`/coverage`) pero NO el código de test
