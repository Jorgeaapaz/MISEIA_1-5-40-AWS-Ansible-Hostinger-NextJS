@~/.claude/prompts/new_functionality_prompt_spec.md

# Refactorizar Arquitectura de Componentes Next.js

## Role
Act as a Software Architect and Senior Frontend Developer with expertise in Next.js App Router, React component architecture, and TypeScript.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — AIFormación landing page.

El fichero `app/page.tsx` tiene **1.411 líneas** con toda la lógica mezclada:
- Datos (constantes `MODULES`, `FEATURES`, `TESTIMONIALS`, `PLANS`)
- Estado (`useState` para acordeón)
- Rendering de 8 secciones en un único componente

No hay separación entre capa de datos, componentes de sección, y página principal.

**Issues corregidos:** `cq_arquitectura_razonada`, `cq_separacion_responsabilidades`

## Task
Refactorizar `app/page.tsx` extrayendo los datos a un fichero dedicado y separando las secciones en componentes independientes, manteniendo exactamente el mismo comportamiento visual y funcional.

### Refactor Guidelines

**Nueva estructura de carpetas:**
```
app/
  page.tsx                    # Orquestador: importa y compone secciones
  layout.tsx                  # Sin cambios
  globals.css                 # Sin cambios
  data/
    curriculum.ts             # Constante MODULES
    features.ts               # Constante FEATURES
    testimonials.ts           # Constante TESTIMONIALS
    plans.ts                  # Constante PLANS
  components/
    Nav.tsx                   # Barra de navegación fija
    HeroSection.tsx           # Sección hero con stats
    FeaturesSection.tsx       # Grid de features
    CurriculumSection.tsx     # Acordeón de módulos (lleva el useState)
    MentorSection.tsx         # Sección del instructor
    PricingSection.tsx        # Grid de planes de precios
    TestimonialsSection.tsx   # Grid de testimonios
    CtaSection.tsx            # Sección de CTA final
    Footer.tsx                # Footer
  styles/
    animations.css            # Extraer los @keyframes y clases CSS del <style> inline
```

**Reglas de refactorización:**
1. `app/page.tsx` queda como compositor puro: importa y renderiza los componentes de sección en orden
2. Los datos se exportan como `const` tipados desde `app/data/*.ts`
3. Cada componente de sección es un `export default function` en su propio fichero
4. `CurriculumSection.tsx` es el único componente con estado (`useState<number | null>`)
5. Los estilos inline en `<style>` del componente actual se mueven a `app/styles/animations.css` e importados en `layout.tsx`
6. Usar `"use client"` solo en los componentes que lo necesiten (`CurriculumSection`, componentes con event handlers)
7. Sin cambios en el comportamiento visual ni funcional

**Tipado:**
```ts
// app/data/curriculum.ts
export interface Module {
  num: string
  title: string
  weeks: string
  color: string
  topics: string[]
}
export const MODULES: Module[] = [...]
```

## Output format
- Múltiples ficheros TypeScript/TSX según la estructura definida
- `app/page.tsx` reducido a <30 líneas
- Los tests existentes (si ya se implementaron en T2) deben seguir pasando

## Examples and Steps to follow

1. Crear las carpetas `app/data/`, `app/components/`, `app/styles/`
2. Extraer las constantes a sus ficheros de datos con tipos explícitos
3. Extraer los @keyframes y clases CSS globales a `app/styles/animations.css`
4. Crear cada componente de sección copiando el JSX correspondiente
5. Actualizar `app/layout.tsx` para importar `animations.css`
6. Simplificar `app/page.tsx` como compositor
7. Ejecutar `npm run build` para verificar que no hay errores TypeScript
8. Ejecutar `npm run lint` para verificar ESLint
9. Si existen tests (`npm run test:ci`), verificar que siguen pasando

## Output checklist and Guardrails

- [ ] `app/page.tsx` tiene <50 líneas
- [ ] Cada sección es un componente separado en `app/components/`
- [ ] Los datos están en `app/data/` con interfaces TypeScript
- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Si existen: `npm run test:ci` pasa sin errores
- [ ] El comportamiento visual es idéntico (acordeón, hover effects, animaciones)
- [ ] `"use client"` solo en componentes con hooks o event handlers
- [ ] Sin imports circulares entre capas
- [ ] No se introdujeron dependencias nuevas
