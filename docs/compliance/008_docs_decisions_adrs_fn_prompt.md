@~/.claude/prompts/new_functionality_prompt_spec.md

# Documentar Decisiones Técnicas, ADRs y Uso de IA

## Role
Act as a Software Architect and Technical Writer with expertise in Architecture Decision Records (ADRs), Next.js, and AI-assisted development documentation.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — AIFormación landing page.

El proyecto fue asistido por IA (Claude) para la generación de código. No hay ninguna documentación de trade-offs, decisiones de arquitectura, ni registro de qué fue generado por IA y qué fue revisado/modificado.

**Decisiones técnicas tomadas en el proyecto (identificadas por análisis):**
1. Next.js 16.2.4 sobre otras alternativas (Astro, Vite+React, SvelteKit)
2. TypeScript strict mode sobre JavaScript
3. Tailwind CSS sobre styled-components o CSS Modules
4. GitHub Actions + EC2 sobre Vercel/Netlify para el hosting
5. Next.js standalone output sobre exportación estática (`next export`)
6. Docker sobre systemd directo para el servicio en producción
7. Estructura de componente único (`page.tsx`) — y el trade-off de separarlo (T3)

**Issues corregidos:** `dc_decisiones_documentadas`, `dc_adrs_o_decision_log`, `dc_justificacion_cuantitativa`, `dc_cambios_ia_documentados`

## Task
Crear los ficheros de documentación de decisiones técnicas y uso de IA del proyecto.

### Documentation Guidelines

**Fichero 1: `docs/decisions/README.md`** — Índice de ADRs

**Fichero 2: `docs/decisions/ADR-001-nextjs-framework.md`**
- Contexto: necesidad de una landing page con interactividad y SEO
- Alternativas evaluadas: Astro, Vite+React, SvelteKit, Next.js
- Decisión: Next.js 16.2.4 con App Router
- Justificación cuantitativa: Next.js standalone build reduce el tamaño de deploy (solo ~50MB vs instalación completa de node_modules)
- Consecuencias: requiere Node.js en producción (no exportación estática pura)

**Fichero 3: `docs/decisions/ADR-002-hosting-aws-ec2.md`**
- Contexto: proyecto de formación necesita URL pública verificable
- Alternativas: Vercel (free tier), Netlify, AWS EC2 (EC2 t2.micro)
- Decisión: AWS EC2 con GitHub Actions para CI/CD
- Justificación cuantitativa: EC2 t2.micro tiene coste <$10/mes vs Vercel Pro $20/mes para uso educativo; control total sobre infraestructura como objetivo pedagógico del bloque 5
- Consecuencias: requiere gestión manual del servidor (nginx, SSL, systemd/Docker)

**Fichero 4: `docs/decisions/ADR-003-docker-vs-systemd.md`**
- Contexto: cómo gestionar el proceso de Next.js en producción
- Alternativas: systemd directo, PM2, Docker
- Decisión: Docker con nginx reverse proxy
- Justificación: aislamiento, reproducibilidad, facilidad de actualización via CI/CD sin downtime
- Consecuencias: requiere Docker instalado en la VM; adds una capa de abstracción

**Fichero 5: `docs/ai-changes.md`** — Registro de cambios IA

Debe documentar:
- Qué fue generado por IA (Claude): estructura inicial de `page.tsx`, datos de ejemplo (MODULES, FEATURES, TESTIMONIALS, PLANS), configuración de GitHub Actions, scripts de setup
- Qué fue revisado/validado por el desarrollador: contenido del programa (6 módulos), precios, textos de marketing, dominio, IPs del servidor
- Qué fue modificado respecto al borrador original: ajuste de precios a EUR, selección de fuentes (Unbounded + Plus Jakarta Sans), paleta de colores, copy del hero
- Decisiones de diseño propias: elección de layout full-scroll single-page, estructura de secciones en ese orden

**Actualizar `README.md`** para añadir:
- Sección "Decisiones de arquitectura" con link a `docs/decisions/`
- Sección "Uso de IA" con link a `docs/ai-changes.md`

## Output format

**Estructura de ADR** (usar para cada ADR):
```markdown
# ADR-XXX: Título

## Estado
Aceptado | Deprecado | Supersedido

## Contexto
¿Qué situación o restricción motivó esta decisión?

## Alternativas evaluadas
| Alternativa | Pros | Contras |
|-------------|------|---------|

## Decisión
¿Qué se decidió?

## Justificación
Razones técnicas y/o cuantitativas.

## Consecuencias
¿Qué implica esta decisión hacia adelante?
```

## Examples and Steps to follow

1. Revisar `app/page.tsx`, `package.json`, `.github/workflows/deploy.yml`, `scripts/setup-ec2.sh`
2. Crear `docs/decisions/` si no existe
3. Crear `docs/decisions/README.md` como índice
4. Crear los 3 ADRs siguiendo la plantilla
5. Crear `docs/ai-changes.md` con el registro de cambios IA
6. Actualizar `README.md` con links a la documentación nueva

## Output checklist and Guardrails

- [ ] Al menos 2 ADRs completos con plantilla contexto/alternativas/decisión/consecuencias
- [ ] Al menos un ADR tiene justificación cuantitativa (números, costes, tamaños, tiempos)
- [ ] `docs/ai-changes.md` distingue claramente qué generó la IA vs qué validó/modificó el desarrollador
- [ ] Los trade-offs documentados son reales y específicos del proyecto (no genéricos)
- [ ] `docs/decisions/README.md` tiene índice con los 3 ADRs
- [ ] `README.md` referencia `docs/decisions/` y `docs/ai-changes.md`
- [ ] Sin afirmaciones sin evidencia ("usé X porque es mejor") — todo tiene contexto específico
