@~/.claude/prompts/new_functionality_prompt_spec.md

# Reescribir README del Proyecto AIFormación

## Role
Act as a Software Developer and Technical Writer with expertise in Next.js, AWS EC2 deployments, and developer documentation.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — Landing page profesional que promueve un programa de formación en Inteligencia Artificial (AIFormación).

- **Stack:** Next.js 16.2.4, React 19, TypeScript, Tailwind CSS
- **Hosting:** AWS EC2 Ubuntu en `100.58.188.68`, dominio `ia.iadevaps.com`
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Variables de entorno:** `.env.example` con `AWS_VPS_NAME`, `AWS_SSH_ACCESS`, `AWS_PUBLIC_IP`
- **Scripts de utilidad:** `scripts/setup-ec2.sh` (bootstrap del servidor EC2)
- **URL pública objetivo:** `https://ia.iadevaps.com`

El README actual es el template por defecto de `create-next-app` — no describe el proyecto.

**Issues corregidos:** `dc_readme_presente`, `dc_seccion_uso`, `dc_instrucciones_deploy`, `dc_comandos_verificacion`

## Task
Reescribir completamente el fichero `README.md` en la raíz del proyecto. El nuevo README debe sustituir todo el contenido genérico del template de create-next-app.

### README Guidelines

El README debe incluir las siguientes secciones **en este orden**:

1. **Header** — Nombre del proyecto (AIFormación), badge de estado del CI (GitHub Actions badge), badge de Node version
2. **Descripción** — Qué es el proyecto: landing page para un programa de formación en IA; tecnologías clave; propósito
3. **Demo** — URL pública `https://ia.iadevaps.com` (o indicar si está pendiente de despliegue)
4. **Requisitos previos** — Node.js 20+, npm
5. **Instalación** — `git clone`, `cd`, `npm install`
6. **Ejecución local** — `npm run dev` → `http://localhost:3000`; `npm run build && npm start` para producción local
7. **Tests** — Indicar que los tests se añadirán con `002_tests_vitest_coverage_fn_prompt.md`; placeholder: `npm test` (cuando esté configurado)
8. **Linter** — `npm run lint`
9. **Sección de uso** — Descripción del flujo de usuario en la landing: secciones disponibles (Hero, Features, Programa, Mentores, Precios, Testimonios); incluir tabla de secciones con anchor links
10. **Variables de entorno** — Tabla con las variables de `.env.example`; instrucción para copiar `.env.example → .env`
11. **Despliegue** — Pasos verificables: (a) pre-requisito: ejecutar `scripts/setup-ec2.sh` en el EC2; (b) el pipeline de CI/CD se activa automáticamente en push a `main`; (c) verificar en `https://ia.iadevaps.com`
12. **Estructura del proyecto** — Árbol de carpetas principal (sin node_modules)
13. **Contribución** — Flujo básico con git branches

## Output format
Fichero `README.md` en markdown estándar de GitHub. Sin emojis en los títulos de sección. Sin referencias a Vercel.

## Examples and Steps to follow

1. Leer el fichero actual `README.md` para entender qué hay que reemplazar
2. Leer `app/page.tsx` para entender las secciones de la landing
3. Leer `.env.example` para la tabla de variables de entorno
4. Leer `scripts/setup-ec2.sh` para las instrucciones de despliegue
5. Leer `.github/workflows/deploy.yml` para describir el pipeline CI/CD
6. Escribir el nuevo `README.md` completo

## Output checklist and Guardrails

- [ ] El README describe el proyecto AIFormación (no es el template genérico)
- [ ] Incluye badge de GitHub Actions
- [ ] Incluye URL de la demo o nota de "pendiente de deploy"
- [ ] Comandos de instalación y ejecución correctos (`npm install`, `npm run dev`)
- [ ] Sección de uso describe las 7 secciones de la landing
- [ ] Tabla de variables de entorno completa
- [ ] Instrucciones de despliegue referencian `scripts/setup-ec2.sh`
- [ ] Estructura de carpetas sin `node_modules`
- [ ] Sin referencias a Vercel como destino de deploy
- [ ] Sin emojis decorativos en texto corriente (sí se permiten en badges)
