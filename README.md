# AIFormación — Landing Page del Programa de Formación en IA

[![Build & Deploy](https://github.com/Jorgeaapaz/gh-aws/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jorgeaapaz/gh-aws/actions/workflows/deploy.yml)
[![Node.js](https://img.shields.io/badge/Node.js-24-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/Uso-Educativo-blue)](#)

**AIFormación** es una **aplicación web (landing page) construida con Next.js 16.2.4 (App Router), React 19 y TypeScript 5** que promociona un programa de formación profesional en Inteligencia Artificial, presentando su currículum, mentores, precios y testimonios, y desplegándose automáticamente a AWS EC2 mediante un pipeline CI/CD dual (GitHub Actions + GitLab CI).

---

## Tabla de contenidos

1. [Módulos implementados](#1-módulos-implementados)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Patrones de diseño y arquitectura](#3-patrones-de-diseño-y-arquitectura)
4. [Cómo funciona](#4-cómo-funciona)
5. [Inicio rápido (Getting Started)](#5-inicio-rápido-getting-started)
6. [Ejemplos de ejecución](#6-ejemplos-de-ejecución)
7. [Requisitos](#7-requisitos)
8. [Especificaciones](#8-especificaciones)
9. [Pruebas unitarias y de integración](#9-pruebas-unitarias-y-de-integración)
10. [Despliegue](#10-despliegue)
11. [Mejoras](#11-mejoras)
12. [Cambios documentados](#12-cambios-documentados)

---

## 1. Módulos implementados

La landing page se compone de **9 secciones independientes** orquestadas por un compositor de página (`page.tsx`). Cada módulo es responsable de una zona vertical de scroll continuo.

### 1.1 Hero (`HeroSection.tsx`)
Cabecera a pantalla completa con titular principal "DOMINA LA IA AHORA", badge de convocatoria activa, dos CTAs de conversión y un strip de **4 estadísticas clave** (3.200+ alumnos, 94% empleabilidad, 4.9★ valoración, 6 meses de duración). Incluye animaciones de orbes radiales (`orb-drift`) y dot-grid.
- **Detalles técnicos:** componente `"use client"` por los manejadores `onMouseEnter`/`onMouseLeave` de los botones. Tipografía display `Unbounded` con `clamp()` responsivo.

### 1.2 Acordeón de currículum (`CurriculumSection.tsx`)
Componente interactivo con estado que muestra los **6 módulos del programa** (ML, Deep Learning, NLP/LLM, Computer Vision, MLOps, Proyecto Final) en formato acordeón. Solo un módulo abierto a la vez; click alterna (toggle) entre abierto/cerrado.
- **Detalles técnicos:** gestión de estado con `useState<number | null>(0)` (módulo 01 abierto por defecto). Complejidad de renderizado **O(n)** donde n = módulos (6) × topics (4) = 24 nodos. Cambio a 0 nodos de contenido al colapsar (rendimiento óptimo).

### 1.3 Precios y conversión (`PricingSection.tsx` + `CtaSection.tsx`)
Comparativa de **3 planes** (Esencial €497 / Pro €997 / Elite €1.997) con el plan Pro destacado como "MÁS POPULAR", y un banner final de urgencia con contador de plazas (12 disponibles). Renderizado declarativo mediante `map` sobre el array tipado `PLANS`.
- **Detalles técnicos:** uso de `grid-template-columns: repeat(auto-fit, minmax(290px, 1fr))` para layout responsive sin media queries. Los datos vienen de `app/data/plans.ts`.

### 1.4 Sección de features (`FeaturesSection.tsx`)
Grid responsive de **6 tarjetas** de propuesta de valor (Online & Flexible, Proyectos Reales, Mentores Top, Certificado Avalado, Comunidad Exclusiva, Garantía Total) cada una con icono, métrica destacada y descripción.
- **Detalles técnicos:** componente Server Component (sin `"use client"`), por lo que se renderiza a HTML estático en build time — cero coste de hidratación en cliente.

---

## 2. Estructura del proyecto

```
1-5-40-nextjs-gh-aws/
├── app/
│   ├── layout.tsx                    # Root layout: fuentes Google (Unbounded + Plus Jakarta Sans), metadata SEO
│   ├── page.tsx                      # Compositor puro de la landing (20 líneas) — orquesta las 9 secciones
│   ├── globals.css                   # Variables CSS, reset y @keyframes (orb-drift, dot-pulse, card-lift)
│   ├── components/
│   │   ├── Nav.tsx                   # Barra superior fija con glassmorphism + anclas #programa/#mentores/#precios
│   │   ├── HeroSection.tsx           # Hero a pantalla completa con stats y CTAs (use client)
│   │   ├── FeaturesSection.tsx       # Grid de 6 features (Server Component)
│   │   ├── CurriculumSection.tsx     # Acordeón interactivo de 6 módulos (use client · useState)
│   │   ├── MentorSection.tsx         # Perfil de la directora + 4 métricas de alumni
│   │   ├── PricingSection.tsx        # 3 planes de precios (use client · hover handlers)
│   │   ├── TestimonialsSection.tsx   # 3 testimonios de alumni con rol verificado
│   │   ├── CtaSection.tsx            # Banner final de urgencia con plazas disponibles
│   │   └── Footer.tsx                # Footer con marca, enlaces legales y copyright
│   └── data/
│       ├── curriculum.ts             # MODULES: Module[] — 6 módulos tipados (num, title, weeks, color, topics)
│       ├── features.ts               # FEATURES: Feature[] — 6 features tipadas (icon, label, text, stat)
│       ├── plans.ts                  # PLANS: Plan[] — 3 planes tipados (name, price, badge, accent, featured, perks, cta)
│       └── testimonials.ts           # TESTIMONIALS: Testimonial[] — 3 testimonios tipados (name, role, text, initials, color)
├── public/                           # Assets estáticos (SVGs: next.svg, vercel.svg, file.svg, globe.svg, window.svg)
├── tests/
│   ├── page.test.tsx                 # 20 tests del componente Home (render, nav, acordeón, pricing, footer)
│   └── setup.ts                      # Setup de @testing-library/jest-dom
├── scripts/
│   └── setup-ec2.sh                  # Bootstrap de la instancia EC2 (Node 20 + servicio systemd) — una vez
├── docs/
│   ├── architecture.md               # Diagramas Mermaid: app, CI/CD, stack de infraestructura
│   ├── ai-changes.md                 # Registro de uso de IA y modificaciones del desarrollador
│   ├── decisions/                    # 3 ADRs (Next.js, AWS EC2, Docker vs systemd)
│   ├── compliance/                   # Informe de cumplimiento, plan PERT y 8 prompts de corrección
│   └── prompts/                      # Prompts de configuración de infraestructura AWS
├── .github/
│   └── workflows/
│       └── deploy.yml                # Pipeline CI/CD GitHub Actions: lint → test → build → deploy
├── .gitlab-ci.yml                    # Pipeline CI/CD GitLab (espejo): lint → test → build → deploy
├── Dockerfile                        # Imagen node:24-alpine para el bundle standalone
├── docker-compose.yml                # Orquestación local del contenedor aiformacion
├── vitest.config.ts                  # Config Vitest (jsdom, coverage v8, threshold lines ≥ 60%)
├── eslint.config.mjs                 # ESLint + eslint-config-next
├── next.config.ts                    # Config Next.js (output: "standalone")
├── tsconfig.json                     # Config TypeScript (strict)
├── package.json                      # Dependencias y scripts npm
└── package-lock.json                 # 🔒 Lockfile — versiones exactas para instalaciones reproducibles
```

---

## 3. Patrones de diseño y arquitectura

### 3.0 Separación por capas (Compositor + Datos + Componentes)

El proyecto aplica una **separación clara de responsabilidades** que desacopla el contenido (datos) de la presentación (componentes):

- **Patrón Compositor (`page.tsx`):** el componente raíz de la página actúa únicamente como orquestador que ensambla las 9 secciones en orden. No contiene lógica de negocio ni datos, solo composición. Esto reduce la página a 20 líneas y delega toda la complejidad a los subcomponentes.
- **Patrón Data-Source (capa `app/data/`):** los 4 ficheros (`curriculum.ts`, `features.ts`, `plans.ts`, `testimonials.ts`) exponen constantes tipadas (`Module[]`, `Feature[]`, `Plan[]`, `Testimonial[]`) con sus respectivas **interfaces TypeScript**. Los componentes consumen estos datos mediante `import`, lo que permite cambiar el contenido sin tocar la lógica de presentación.
- **Patrón Declarative Rendering:** todos los componentes iteran sobre los arrays de datos con `.map()` en lugar de repetir markup manualmente (ej. `MODULES.map(...)`, `PLANS.map(...)`, `FEATURES.map(...)`). Esto minimiza la duplicación y centraliza los cambios.

### 3.1 Dependencias bloqueadas (Lockfile)

El proyecto cuenta con un **Lockfile commiteado** para garantizar instalaciones reproducibles y deterministicas:

```
package-lock.json   (299 KB · 16.000+ líneas · npm v3 format)
```

| Fichero | Propósito |
|---------|-----------|
| `package-lock.json` | Bloquea el árbol completo de dependencias (directas + transitivas) con hashes de integridad. Permite que `npm ci` instale exactamente la misma versión en local, CI y producción. |

> **¿Por qué importa?** En los pipelines de CI/CD se usa `npm ci` (en lugar de `npm install`), que lee exclusivamente el `package-lock.json` y reproduce el árbol de dependencias exacto. Esto evita *dependency drift* entre el entorno de build y el de producción, garantizando que lo que se prueba es lo que se despliega.

Las versiones principales quedan fijadas en `package.json`:

| Dependencia | Versión | Tipo |
|-------------|---------|------|
| `next` | `16.2.4` (exacta) | runtime |
| `react` / `react-dom` | `19.2.4` (exacta) | runtime |
| `typescript` | `^5` | dev |
| `vitest` | `^4.1.9` | dev (testing) |
| `tailwindcss` | `^4` | dev |
| `eslint` / `eslint-config-next` | `^9` / `16.2.4` | dev (linting) |

---

## 4. Cómo funciona

La aplicación es una **Single Page de scroll continuo** generada estáticamente en build time. Al cargar la URL, el servidor Next.js (ejecutándose dentro del contenedor Docker en EC2) sirve el HTML pre-renderizado de las secciones Server Component, mientras que los componentes marcados con `"use client"` (`CurriculumSection`, `HeroSection`, `PricingSection`) se hidratan en el navegador para aportar interactividad. El estado del acordeón del currículum se gestiona localmente en el cliente con `useState`, sin llamadas a red.

```tsx
// app/page.tsx — Compositor: ensambla las 9 secciones sin lógica de negocio
import Nav from "./components/Nav";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CurriculumSection from "./components/CurriculumSection";
// ... resto de imports

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <CurriculumSection />
      <MentorSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
```

```tsx
// app/components/CurriculumSection.tsx — Estado del acordeón (interacción clave)
"use client";
import { useState } from "react";
import { MODULES } from "../data/curriculum";

export default function CurriculumSection() {
  const [activeModule, setActiveModule] = useState<number | null>(0); // módulo 01 abierto
  return (
    <section id="programa">
      {MODULES.map((mod, i) => (
        <div key={i} onClick={() => setActiveModule(activeModule === i ? null : i)}>
          {/* ... título y, condicionalmente, los topics del módulo activo */}
          {activeModule === i && (
            <ul>{mod.topics.map((topic, j) => <li key={j}>{topic}</li>)}</ul>
          )}
        </div>
      ))}
    </section>
  );
}
```

---

## 5. Inicio rápido (Getting Started)

### Prerrequisitos

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| **Node.js** | 24 LTS | El pipeline CI usa `node:24-alpine`; recomendado igual en local |
| **npm** | 10+ | Viene incluido con Node |
| **Git** | 2.30+ | Para clonar el repositorio |

### Clonar el repositorio

```bash
git clone https://github.com/Jorgeaapaz/gh-aws.git
cd gh-aws
```

### Instalar dependencias (reproducibles vía lockfile)

```bash
npm ci          # usa package-lock.json → instalación exacta y determinista (recomendado)
# o
npm install     # usa package.json → puede resolver versiones ligeramente distintas
```

### Variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores reales. **No commitear `.env`** (está en `.gitignore`).

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AWS_VPS_NAME` | Nombre de la instancia EC2 | `jaap-ec2-instance` |
| `AWS_SSH_ACCESS` | Comando SSH completo | `ssh -i ~/.ssh/vboxuser ubuntu@100.58.188.68` |
| `AWS_PUBLIC_IP` | IP pública de la VM | `100.58.188.68` |

### Ejecutar en local

```bash
npm run dev       # desarrollo con hot-reload → http://localhost:3000
npm run build     # build de producción (genera .next/standalone/)
npm start         # servidor de producción local
npm run lint      # ESLint + eslint-config-next
npm test          # Vitest en modo watch
npm run test:ci   # Vitest ejecución única (para CI)
npm run coverage  # Vitest + reporte de cobertura
```

---

## 6. Ejemplos de ejecución

A continuación, **4 ejecuciones representativas** que muestran el comportamiento esperado: dos casos de éxito (servidor y tests) y dos casos límite/fallo (lint y build con `"use client"` ausente).

### ✅ Caso 1 — Servidor de desarrollo levantado

```bash
$ npm run dev
  ▲ Next.js 16.2.4
  - Local:   http://localhost:3000

 ✓ Ready in 1247 ms
 ✓ Compiled / in 3.2s
```

Navegador en `http://localhost:3000` → se renderiza la landing con las 9 secciones; el módulo 01 del currículum aparece expandido por defecto.

### ✅ Caso 2 — Suite de tests en verde

```bash
$ npm run test:ci
 RUN  v4.1.9
      Filter files by name (pattern)
 ✓ tests/page.test.tsx (20 tests) 768ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Duration  768ms
```

Los 20 tests cubren render, navegación, acordeón (estado inicial + toggle), pricing, testimonios y footer.

### ❌ Caso 3 (límite) — Fallo de lint por carácter no escapado

Si un componente contiene un carácter `"` sin escapar, ESLint lo rechaza:

```bash
$ npm run lint
./app/components/TestimonialsSection.tsx
  21:9  error  Apostrophe / quote must be escaped  react/no-unescaped-entities

✖ 1 problem (1 error, 0 warnings)
```

**Corrección:** sustituir `"` por `&ldquo;` (aplicado en el código actual).

### ❌ Caso 4 (límite) — Build roto por `"use client"` ausente

Si un componente con `onMouseEnter`/`useState` no lleva el directive `"use client"`, el build falla:

```bash
$ npm run build
Failed to compile.
./app/components/HeroSection.tsx
Error: Event handlers cannot be passed to Client Component props.
```

**Corrección:** añadir `"use client";` en la primera línea del componente (ya aplicado en `HeroSection.tsx` y `CurriculumSection.tsx`).

---

## 7. Requisitos

### 7.1 Requisitos funcionales (IEEE 830)

| ID | Requisito |
|----|-----------|
| FR-001 | El visitante anónimo deberá poder visualizar el hero con titular y CTAs para percibir de inmediato la propuesta de valor del programa. |
| FR-002 | El visitante anónimo deberá poder navegar mediante la barra superior a las secciones `#programa`, `#mentores` y `#precios` para acceder rápidamente al contenido de su interés. |
| FR-003 | El visitante anónimo deberá poder expandir y colapsar cada uno de los 6 módulos del acordeón del currículum para leer los temas de cada módulo bajo demanda. |
| FR-004 | El visitante anónimo deberá poder consultar los detalles de los 3 planes de precios (Esencial, Pro, Elite) con sus perks y CTA para comparar opciones de inscripción. |
| FR-005 | El visitante anónimo deberá poder identificar el plan Pro como destacado mediante el badge "MÁS POPULAR" para distinguir la opción recomendada. |
| FR-006 | El visitante anónimo deberá poder leer 3 testimonios de alumni con nombre y rol verificado para evaluar la reputación del programa. |
| FR-007 | El visitante anónimo deberá poder ver el perfil y las credenciales de la directora del programa para validar la calidad académica. |
| FR-008 | El visitante anónimo deberá poder ver las estadísticas clave (alumnos formados, empleabilidad) para tomar una decisión informada. |
| FR-009 | El desarrollador deberá poder desplegar la aplicación mediante un push a `main` para que el pipeline CI/CD publique automáticamente en EC2. |
| FR-010 | El operador deberá poder verificar el estado del despliegue con `curl` y `docker ps` para confirmar que la nueva versión está activa. |
| FR-011 | El visitante anónimo deberá poder acceder al sitio sobre HTTPS con certificado válido para que su navegación sea segura. |
| FR-012 | El desarrollador deberá poder ejecutar la suite de tests localmente para validar que los cambios no rompen la renderización antes de pushear. |

### 7.2 Requisitos no funcionales (cuantificados)

| ID | Descripción cuantificada |
|----|--------------------------|
| NFR-PERF-001 | **Performance:** tiempo de build de Next.js standalone < 60 s en runner CI ubuntu-latest (medido). |
| NFR-PERF-002 | **Performance:** tiempo de transferencia del bundle a EC2 < 15 s vía rsync (bundle ~50 MB standalone vs ~300 MB con node_modules). |
| NFR-SEC-001 | **Security:** tráfico servido exclusivamente sobre HTTPS (TLS 1.2+) con certificado wildcard `*.iadevaps.com` renovado automáticamente por Certbot. |
| NFR-SEC-002 | **Security:** la clave SSH privada (`EC2_SSH_KEY`) nunca se commitea; se inyecta como GitHub/GitLab Secret en tiempo de ejecución del pipeline. |
| NFR-SCAL-001 | **Scalability:** arquitectura stateless (HTML estático + componentes cliente ligeros) que soporta picos de tráfico sin estado de servidor; escalable horizontalmente añadiendo réplicas detrás de nginx. |
| NFR-USAB-001 | **Usability:** diseño responsive con `clamp()` y `grid auto-fit`; usable desde 320 px (móvil) hasta 2560 px (desktop) sin scroll horizontal. |
| NFR-AVAIL-001 | **Availability:** contenedor Docker con `--restart unless-stopped` que se reinicia automáticamente tras fallos del proceso Node. |
| NFR-MAINT-001 | **Maintainability:** separación por capas (datos ↔ componentes) que permite editar el contenido del programa tocando solo `app/data/*.ts` sin modificar lógica de presentación. |
| NFR-OBS-001 | **Observability:** logs accesibles vía `docker logs aiformacion -f` para diagnóstico de errores en producción. |
| NFR-PERF-003 | **Performance:** LCP (Largest Contentful Paint) optimizado por generación estática de Server Components; sin llamadas de red en runtime para el contenido. |

### 7.3 Requisitos regulatorios (México — LFPDPPP)

Aunque el programa se dirige al mercado hispanohablante, si se comercializa en territorio mexicano aplica la **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)**:

| ID | Requisito |
|----|-----------|
| REG-MX-001 | **Aviso de privacidad:** se debe publicar un aviso de privacidad conforme al Art. 16 de la LFPDPPP, informando finalidad del tratamiento de datos de los inscritos. |
| REG-MX-002 | **Consentimiento (ARCO):** habilitar mecanismos para que el titular ejerza sus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) sobre sus datos personales. |
| REG-MX-003 | **Cookies:** mostrar banner de consentimiento de cookies conforme a las buenas prácticas del INAI, ya que el footer incluye enlaces de "Cookies" y "Privacidad". |
| REG-MX-004 | **Profesiones:** si el programa expide certificación, verificar cumplimiento de la Ley Reglamentaria del Art. 5 Constitucional relativo al ejercicio de las profesiones. |

### 7.4 Requisitos operativos

| ID | Descripción |
|----|-------------|
| OPS-001 | **Ventana de disponibilidad:** el sitio debe estar disponible 24/7 (no hay ventana de mantenimiento programada); el contenedor se reinicia automáticamente con `--restart unless-stopped`. |
| OPS-002 | **Despliegue:** despliegue vía CI/CD con `lint → test → build → deploy`; rollback manual con `docker run` de la imagen anterior si el despliegue falla. |
| OPS-003 | **Mantenimiento:** renovación automática del certificado SSL (Certbot) y actualizaciones de seguridad de Ubuntu vía `apt`. |
| OPS-004 | **Monitoreo:** logs del contenedor accesibles con `docker logs aiformacion -f`; verificación de salud con `curl -I https://ia.iadevaps.com`. |
| OPS-005 | **Recuperación:** RPO < 1 deploys (configuración versionada en Git); RTO < 5 min (re-ejecutar el pipeline o `docker run` manual desde el último bundle). |
| OPS-006 | **Entorno:** aplicación desplegada sobre Ubuntu 22.04 LTS, Node.js 24 LTS, Docker 24+, nginx 1.24+ con Certbot. |

### 7.5 Atributos de calidad

### 7.5.1 Performance: Tiempo de build [PERF-BUILD-TIME]
**Atributo de calidad:** Performance
**Métrica:** Tiempo de build (segundos)

**Especificación:**
- Build de Next.js standalone: < 60 s
- Transferencia rsync a EC2: < 15 s
- Build de imagen Docker en EC2: < 20 s

**Condiciones:**
- Entorno: runner GitHub ubuntu-latest / EC2 t2.micro
- Tamaño del bundle standalone: ~50 MB
- Dependencias: fijadas por `package-lock.json`

**Excepciones:**
- Primer build tras `npm ci` sin cache: +10–15 s aceptables
- Build en máquina local de bajas prestaciones: hasta 90 s aceptables

**Verificación:**
- Medición manual con `time npm run build`
- Logs del workflow de GitHub Actions (job `build-and-deploy`)

---

### 7.5.2 Availability: Uptime del contenedor [AVAIL-CONTAINER-UPTIME]
**Atributo de calidad:** Availability
**Métrica:** % de uptime

**Especificación:**
- Contenedor con política `--restart unless-stopped`
- Tras un crash del proceso Node: reinicio automático en < 5 s
- Durante un despliegue: downtime breve (~2 s en el `docker stop`/`run`)

**Condiciones:**
- Host: AWS EC2 t2.micro con Ubuntu 22.04 LTS
- Sin balanceador de carga delante

**Excepciones:**
- Si el host EC2 se reinicia: el contenedor arranca con el demonio Docker
- Caída de la instancia: requiere re-aprovisionamiento manual

**Verificación:**
- `docker ps` (estado del contenedor)
- `docker inspect aiformacion` (restart policy)
- `curl -I https://ia.iadevaps.com` (respuesta HTTP)

---

### 7.5.3 Maintainability: Separación de capas [MAINT-LAYER-SEP]
**Atributo de calidad:** Maintainability
**Métrica:** Número de ficheros tocados para un cambio de contenido

**Especificación:**
- Cambio de contenido del programa: 1 fichero en `app/data/*.ts`
- Cambio de estilo de una sección: 1 componente en `app/components/*.tsx`
- El compositor `page.tsx` nunca se modifica para cambios de contenido

**Condiciones:**
- Datos tipados con interfaces TypeScript (`Module`, `Feature`, `Plan`, `Testimonial`)
- Componentes consumen datos por `import`

**Excepciones:**
- Reordenar secciones requiere editar `page.tsx` (cambio estructural)

**Verificación:**
- Revisión de diffs de Pull Requests
- `tsc --noEmit` (validación de tipos)

---

### 7.5.4 Security: Protección de credenciales [SEC-CREDS-GUARD]
**Atributo de calidad:** Security
**Métrica:** Número de secretos en texto plano en el repositorio

**Especificación:**
- Secretos en el repo: 0
- Claves SSH, IPs y credenciales inyectadas vía GitHub/GitLab Secrets
- `.env` excluido por `.gitignore`

**Condiciones:**
- Pipeline CI/CD lee `${{ secrets.EC2_SSH_KEY }}` en runtime
- Verificación: `git log --all -p | grep -i key` (negativo)

**Excepciones:**
- Ninguna: los secretos nunca deben versionarse

**Verificación:**
- Auditoría del historial de Git
- Análisis del workflow `deploy.yml`

---

### 7.5.5 Usability: Responsividad cross-device [USAB-RESPONSIVE]
**Atributo de calidad:** Usability
**Métrica:** Ancho de viewport sin scroll horizontal (px)

**Especificación:**
- Móvil: 320–480 px
- Tablet: 768–1024 px
- Desktop: 1280–2560 px
- 0 px de scroll horizontal en todos los rangos

**Condiciones:**
- Uso de `clamp()` para tipografía fluida
- Grids con `repeat(auto-fit, minmax(290px, 1fr))`
- `overflowX: hidden` en el contenedor raíz

**Excepciones:**
- Animaciones de orbes radiales pueden recortarse en pantallas muy estrechas (cosmético)

**Verificación:**
- Chrome DevTools (device toolbar)
- Lighthouse mobile audit

---

### 7.6 Criterios de aceptación BDD

```gherkin
Feature: Renderizado de la landing page

  Scenario: Visitante ve el hero al cargar la página
    Given un visitante anónimo accede a la URL raíz
    When la página termina de renderizarse
    Then el visitante ve el titular "DOMINA LA IA AHORA"
    And el visitante ve el badge "Nueva convocatoria · Septiembre 2026"
    And el visitante ve las 4 estadísticas clave

  Scenario: Visitante navega con la barra superior
    Given el visitante está en cualquier sección de la landing
    When hace click en el enlace "Programa"
    Then la página hace scroll suave a la sección #programa
    And el módulo 01 del currículum aparece expandido

  Scenario: Visitante expande un módulo del currículum
    Given el módulo 01 está expandido por defecto
    When el visitante hace click en el módulo 02 "Deep Learning"
    Then el módulo 02 muestra sus 4 temas
    And el módulo 01 se colapsa (solo uno abierto a la vez)

  Scenario: Visitante colapsa el módulo activo
    Given el módulo 01 está expandido
    When el visitante hace click de nuevo en el módulo 01
    Then todos los módulos quedan colapsados
    And no se muestra ningún tema

  Scenario: Visitante compara los planes de precio
    Given el visitante hace scroll a la sección #precios
    When la sección de precios se renderiza
    Then el visitante ve 3 planes (Esencial, Pro, Elite)
    And el plan Pro muestra el badge "MÁS POPULAR"
    And cada plan muestra su CTA correspondiente
```

---

## 8. Especificaciones

### 8.1 Specification Driven Development

#### Especificación funcional — Landing page AIFormación

**Actores:** Visitante anónimo, Desarrollador, Operador/DevOps

**Precondiciones:**
- Servidor Next.js ejecutándose (local o EC2)
- DNS `ia.iadevaps.com` resolviendo a la IP de EC2
- Visitante con navegador moderno

**Flujo principal (visitante):**
1. El visitante accede a la URL raíz
2. El servidor sirve el HTML pre-renderizado de la landing
3. Las secciones Server Component se muestran inmediatamente
4. Los componentes cliente (`CurriculumSection`, `HeroSection`, `PricingSection`) se hidratan
5. El visitante interactúa (scroll, acordeón, hover) sin llamadas de red

**Criterios de aceptación:**
- Given un visitante accede a la URL raíz
- When la página carga
- Then ve las 9 secciones renderizadas
- And el acordeón del módulo 01 está expandido por defecto

---

#### Especificación estructural — Organización interna

El sistema se organiza en **3 capas desacopladas** que soportan el comportamiento funcional:

```
┌─────────────────────────────────────────────┐
│  Capa de Composición (app/page.tsx)         │  ← Compositor: orquesta secciones
│  Sin lógica de negocio · 20 líneas          │
├─────────────────────────────────────────────┤
│  Capa de Presentación (app/components/*)    │  ← 9 secciones (Server + Client)
│  Renderiza datos · sin estado de negocio    │
├─────────────────────────────────────────────┤
│  Capa de Datos (app/data/*.ts)              │  ← 4 constantes tipadas
│  Module[], Feature[], Plan[], Testimonial[] │
└─────────────────────────────────────────────┘
```

- **Server Components** (`Nav`, `FeaturesSection`, `MentorSection`, `TestimonialsSection`, `CtaSection`, `Footer`): se renderizan a HTML estático en build; cero JS al cliente.
- **Client Components** (`HeroSection`, `CurriculumSection`, `PricingSection`): marcados con `"use client"`; aportan interactividad (estado/hover) y se hidratan en el navegador.

---

#### Especificación comportamental — Diagrama de estados del acordeón

```mermaid
stateDiagram-v2
    [*] --> Mod01Abierto

    state Mod01Abierto {
        [*] --> mostrar_temas_mod01
    }

    Mod01Abierto --> NingunoAbierto : click en Mod01 (toggle)
    Mod01Abierto --> Mod02Abierto : click en Mod02
    Mod01Abierto --> Mod03Abierto : click en Mod03

    state NingunoAbierto {
        [*] --> sin_temas_visibles
    }

    NingunoAbierto --> Mod02Abierto : click en Mod02
    NingunoAbierto --> Mod03Abierto : click en Mod03

    state Mod02Abierto {
        [*] --> mostrar_temas_mod02
    }

    Mod02Abierto --> NingunoAbierto : click en Mod02 (toggle)
    Mod02Abierto --> Mod01Abierto : click en Mod01
    Mod02Abierto --> Mod03Abierto : click en Mod03

    note right of Mod01Abierto
        Invariante: como máximo 1 módulo abierto
    end note
```

---

#### Especificación operativa — Despliegue en EC2

**Despliegue:**
- Pipeline CI/CD dual (GitHub Actions + GitLab CI) en cada push a `main`
- Stages: `lint → test → build → deploy`
- Transferencia del bundle standalone vía rsync (no se usa registry)
- Reconstrucción de imagen Docker en la propia VM con `docker build`

**Escalado:**
- Actual: instancia única EC2 t2.micro (suficiente para tráfico de landing)
- Si escala: añadir réplicas detrás de nginx o migrar a ECS/Fargate (documentado en ADR-002)

**Monitoreo:**
- Verificación de salud: `curl -I https://ia.iadevaps.com` (esperado HTTP 200)
- Logs del contenedor: `docker logs aiformacion -f`
- Estado del contenedor: `docker ps | grep aiformacion`

**Runbook: Tasa de error alta o sitio caído:**
1. Verificar los últimos deploys en GitHub Actions
2. Si hubo cambio reciente: rollback con `docker run` de la imagen anterior
3. Si no: revisar logs con `docker logs aiformacion --tail 100`
4. Si persiste: reiniciar el contenedor (`docker restart aiformacion`)
5. Si el host está caído: re-conectar por SSH y reiniciar el demonio Docker

---

### 8.2 Invariantes y contratos

#### Contrato del acordeón de currículum

```
CONTRATO PARA CURRICULUMSECTION (acordeón):

PRECONDICIÓN:
- MODULES: Module[] con length === 6 (definido en app/data/curriculum.ts)
- Cada Module tiene: num, title, weeks, color, topics: string[]

POSTCONDICIÓN:
- En todo momento, como máximo 1 módulo está expandido (activeModule ∈ {0..5} ∪ {null})
- El render muestra los topics SOLO del módulo activo
- Click en el módulo activo lo colapsa (activeModule → null)

INVARIANTE:
- Cardinalidad de módulos abiertos ≤ 1 (siempre)
- El número total de módulos mostrados (6) no cambia
- activeModule nunca es un índice fuera de [0, 5]

EJEMPLOS:
- Estado inicial: activeModule = 0 → módulo 01 abierto, muestra sus 4 temas
- Click en módulo 01 (estando abierto): activeModule → null → 0 temas visibles
- Click en módulo 02 (estando 01 abierto): activeModule = 1 → módulo 02 abierto, 01 colapsa
```

#### Contrato de la capa de datos

```
CONTRATO PARA app/data/*.ts:

PRECONDICIÓN:
- Cada fichero exporta un array tipado no vacío
- MODULES.length === 6, FEATURES.length === 6, PLANS.length === 3, TESTIMONIALS.length === 3

POSTCONDICIÓN:
- Los arrays son inmutables en runtime (const exports)
- Cada elemento cumple su interfaz TypeScript (Module | Feature | Plan | Testimonial)

INVARIANTE:
- El componente consumidor recibe siempre el mismo número de elementos
- No hay efectos secundarios: los exports son constantes puras

EJEMPLOS:
- PLANS[1].name === "Pro"
- PLANS[1].featured === true
- MODULES[0].title === "Fundamentos de Machine Learning"
- MODULES[0].topics.length === 4
```

---

### 8.3 Registros de Decisiones de Arquitectura (ADRs)

> Documentación extendida en [`docs/decisions/`](docs/decisions/). Resumen a continuación.

#### ADR-001: Framework — Next.js sobre alternativas

**Estado:** Aceptado

**Contexto:** Se necesita una landing page con interactividad (acordeón, hovers) y buen SEO. Tiempo de despliegue breve (bloque formativo).

**Opciones evaluadas:** Next.js 16 · Astro · Vite+React · SvelteKit

**Decisión:** **Next.js 16.2.4** con App Router y `output: "standalone"`.

**Justificación cuantitativa:** El bundle standalone ocupa ~50 MB frente a ~300 MB con `node_modules` — reduce el tiempo de transferencia por deploy de ~45 s a ~8 s (medido con rsync/scp). La generación estática produce HTML pre-renderizado sin carga de servidor por visita.

**Consecuencias:**
- *Positivas:* SEO óptimo por SSG, transferencia de deploy rápida, ecosistema maduro.
- *Negativas:* Requiere Node.js en la VM; `standalone` no incluye `public/` ni `.next/static/` (se copian manualmente en CI).

---

#### ADR-002: Hosting — AWS EC2 sobre PaaS gestionado

**Estado:** Aceptado

**Contexto:** El proyecto es un entregable formativo (MISEIA 1-5-40) que debe demostrar competencia en infraestructura cloud y CI/CD. El evaluador valora el control explícito sobre el servidor.

**Opciones evaluadas:** AWS EC2 t2.micro · Vercel Free/Pro · Netlify · Railway

**Decisión:** **AWS EC2 t2.micro** con Ubuntu 22.04, Ansible, Docker y nginx.

**Justificación cuantitativa:** Coste EC2 t2.micro en us-east-1: $0.0116/h × 720 h = **$8.35/mes** (gratis en free tier el primer año) frente a $20/mes de Vercel Pro. Ahorro de $11.65/mes. Objetivo pedagógico: demostrar pipeline SSH + rsync + Docker + nginx con TLS.

**Consecuencias:**
- *Positivas:* Control total de la infraestructura, coste mínimo, valor formativo.
- *Negativas:* Gestión manual de seguridad/SSL; si escala, migrar a ECS/Fargate o PaaS.

---

#### ADR-003: Servicio en producción — Docker sobre systemd

**Estado:** Aceptado (reemplaza el enfoque systemd de `setup-ec2.sh`)

**Contexto:** El `setup-ec2.sh` original gestionaba el proceso Next.js como servicio systemd. Al introducir CI/CD automático se necesita aislamiento y actualizaciones reproducibles.

**Opciones evaluadas:** Docker · systemd directo · PM2 · Docker Compose

**Decisión:** **Docker** con `docker run` directo (sin Compose en producción).

**Justificación cuantitativa:** Con systemd, una actualización requiere rsync (~8 s) + `systemctl restart` (~2 s) = ~10 s con downtime. Con Docker: `docker build` (~15 s) + `stop`/`rm`/`run` (~2 s) = ~25 s, pero con **aislamiento completo** y actualización **atómica**. La imagen es reproducible (misma imagen = mismo comportamiento).

**Consecuencias:**
- *Positivas:* Aislamiento del proceso, reproducibilidad, rollback fácil (imagen anterior).
- *Negativas:* Imagen ~180 MB comprimida; tiempo total de deploy mayor (~25 s vs ~10 s).

---

#### ADR-004: Lockfile commiteado (`package-lock.json`) para reproducibilidad

**Estado:** Aceptado

**Contexto:** El proyecto se construye en 3 entornos distintos (local, GitHub Actions, GitLab CI) y se despliega a EC2. Sin un lockfile, las versiones transitivas pueden variar entre entornos.

**Opciones evaluadas:** (a) commitear `package-lock.json` + `npm ci` · (b) solo `package.json` + `npm install`

**Decisión:** Commitear **`package-lock.json`** (299 KB) y usar `npm ci` en todos los CI.

**Justificación cuantitativa:** `npm ci` instala el árbol exacto del lockfile (determinista) y es **más rápido** que `npm install` en CI porque omite la resolución de versiones. Elimina el *dependency drift*: lo que se testea en CI es idéntico a lo que se despliega.

**Consecuencias:**
- *Positivas:* Builds reproducibles; sin sorpresas por versiones transitivas; `npm ci` falla si el lockfile no coincide con `package.json` (detección temprana de inconsistencias).
- *Negativas:* El lockfile debe actualizarse al cambiar dependencias (commit adicional).

---

#### ADR-005: CI/CD dual — GitHub Actions + GitLab CI

**Estado:** Aceptado

**Contexto:** El repositorio se publica en GitHub (`Jorgeaapaz/gh-aws`) pero el contexto formativo requiere demostrar competencia también en GitLab CI/CD.

**Opciones evaluadas:** (a) solo GitHub Actions · (b) solo GitLab CI · (c) ambos

**Decisión:** Mantener **ambos pipelines** con stages espejo (`lint → test → build → deploy`).

**Justificación cualitativa:** GitHub Actions es el pipeline principal (integrado con el repo y los Secrets); GitLab CI demuestra portabilidad del proceso. Previene acoplamiento a un único proveedor de CI y cubre el requisito formativo dual.

**Consecuencias:**
- *Positivas:* Portabilidad del pipeline; cobertura formativa completa; ambos usan `node:24-alpine` para paridad.
- *Negativas:* Doble mantenimiento del pipeline; los Secrets deben configurarse en ambas plataformas.

---

## 9. Pruebas unitarias y de integración

### Configuración

| Elemento | Detalle |
|----------|---------|
| Framework | **Vitest** v4.1.9 |
| Entorno | jsdom |
| Librería | `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` |
| Cobertura | `@vitest/coverage-v8`, reportes `text` + `lcov` |
| Umbral | `lines: 60%` (configurado en `vitest.config.ts`) |
| Fichero | `tests/page.test.tsx` (20 tests) |

### Dependencias de testing (de `package.json`)

```json
"devDependencies": {
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@testing-library/user-event": "^14.6.1",
  "@vitejs/plugin-react": "^6.0.3",
  "@vitest/coverage-v8": "^4.1.9",
  "jsdom": "^29.1.1",
  "vitest": "^4.1.9"
}
```

### Comandos ejecutables

```bash
npm test            # Vitest en modo watch
npm run test:ci     # ejecución única (para CI/CD)
npm run coverage    # ejecución única + reporte de cobertura
```

### Alcance (scope) y cobertura

| Métrica | Valor |
|---------|-------|
| Ficheros de test | `tests/page.test.tsx` (1 suite) |
| Tests | **20** (todos pasan) |
| Cobertura objetivo (líneas) | ≥ 60% del código en `app/**` |
| Cobertura objetivo (global) | ≥ 40% |

**Cobertura por bloques funcionales:**

| Bloque | Tests | Qué cubre |
|--------|-------|-----------|
| Render | 1 | La página renderiza sin crash |
| Hero | 3 | Titular h1, badge de convocatoria, estadísticas |
| Navegación | 2 | Links ancla (programa, mentores, precios) + CTA nav |
| Acordeón (estado inicial) | 2 | Módulo 01 abierto por defecto, 6 títulos presentes |
| Acordeón (toggle) | 3 | Colapsar, expandir, mutuamente excluyentes |
| Features | 1 | 6 tarjetas con sus labels |
| Precios | 3 | 3 planes, badge "MÁS POPULAR", CTAs |
| Testimonios | 1 | 3 testimonios con nombre y rol |
| Footer | 2 | Marca + copyright, enlaces legales |
| CTA final | 2 | Mensaje de plazas, botón de reserva |

> **Mocks relevantes:** el test mock-ea `next/font/google` (devuelve variables CSS vacías) y stub-ea el import de `globals.css`, para aislar el render del componente de las dependencias de build de Next.js.

---

## 10. Despliegue

### 10.1 URL de despliegue

```
https://ia.iadevaps.com   ✅ (activa — Docker en AWS EC2)
```

Verificación rápida:

```bash
curl -I https://ia.iadevaps.com     # esperado: HTTP/1.1 200
```

### 10.2 Lockfile (instalación reproducible)

El repositorio incluye el **lockfile `package-lock.json`** commiteado (299 KB) para garantizar instalaciones reproducibles y deterministicas. En los pipelines de CI/CD se ejecuta `npm ci`, que instala exactamente el árbol de dependencias fijado por el lockfile (con hashes de integridad), evitando *dependency drift* entre el entorno de build y producción.

> **Regla:** tras cualquier cambio en `package.json`, regenerar y commitear `package-lock.json` con `npm install` antes de pushear.

### 10.3 Instrucciones de despliegue

#### Opción A — CI/CD automático (recomendado)

El pipeline de GitHub Actions (`.github/workflows/deploy.yml`) se activa en cada push a `main`:

```
lint → test → build → deploy
```

| Stage | Acción | Condición |
|-------|--------|-----------|
| `lint` | `npm ci` + `npm run lint` | todo push |
| `test` | `npm ci` + `npm run test:ci` | todo push |
| `build` | `npm ci` + `NODE_ENV=production npm run build` + ensamblado del standalone | tras lint+test |
| `deploy` | rsync del bundle a EC2 + scp del Dockerfile + `docker build/run` | solo `main` |

**Secrets necesarios** (GitHub y/o GitLab):

| Secret | Valor |
|--------|-------|
| `EC2_SSH_KEY` | Contenido de la clave privada SSH |
| `EC2_HOST` | `100.58.188.68` |
| `EC2_USER` | `ubuntu` |

#### Opción B — Bootstrap manual del servidor (una sola vez)

```bash
# Transferir y ejecutar el script de setup
scp scripts/setup-ec2.sh ubuntu@100.58.188.68:~/
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "bash setup-ec2.sh"
```

> Nota: `setup-ec2.sh` configura Node 20 + systemd; el despliegue actual usa Docker (ver ADR-003). El script queda como referencia del enfoque inicial.

#### Opción C — Despliegue manual con Docker

```bash
# En la VM EC2, desde el directorio ~/MISEIA140_aiformacion
sudo docker build -t aiformacion:latest .
sudo docker stop aiformacion 2>/dev/null; sudo docker rm aiformacion 2>/dev/null
sudo docker run -d --name aiformacion --restart unless-stopped \
  -p 3000:3000 -e NODE_ENV=production -e PORT=3000 -e HOSTNAME=0.0.0.0 \
  aiformacion:latest
```

#### Verificación del despliegue

```bash
# Respuesta HTTP
curl -I https://ia.iadevaps.com

# Estado del contenedor en la VM
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "docker ps | grep aiformacion"

# Logs del contenedor
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "docker logs aiformacion --tail 20"
```

---

## 11. Mejoras

Más allá de la landing page básica, el proyecto incorpora funcionalidades que extienden su valor:

- **Acordeón interactivo del currículum:** navegación por los 6 módulos con estado mutuamente excluyente, mejorando la experiencia de descubrimiento del contenido sin sobrecargar la vista inicial.
- **Pipeline CI/CD dual:** despliegue automatizado en GitHub Actions y GitLab CI con stages espejo (`lint → test → build → deploy`), garantizando portabilidad del proceso y prevención de regresiones.
- **Containerización con Docker:** aislamiento reproducible del proceso Next.js, con rollback atómico (re-ejecutar `docker run` con la imagen anterior).
- **TLS automático con Certbot:** certificado wildcard `*.iadevaps.com` con renovación automática, sirviendo HTTPS sin intervención manual.
- **Diagramas de arquitectura Mermaid:** documentación visual de la app, el flujo CI/CD y el stack de infraestructura (`docs/architecture.md`).
- **Registros de decisiones (ADRs):** 5 ADRs que documentan los trade-offs técnicos con justificación cuantitativa (tamaños de bundle, costes, tiempos de deploy).
- **Cobertura de tests con umbral:** umbral de líneas ≥ 60% que bloquea el pipeline si la cobertura baja, forzando calidad sostenida.
- **Lockfile commiteado:** `package-lock.json` para instalaciones deterministas en todos los entornos.

---

## 12. Cambios documentados (con uso de IA)

Esta sección registra las funcionalidades añadidas o modificadas con asistencia de IA durante el desarrollo, con una **revisión crítica estructurada** (razonamiento transparente, evidencia citada, conclusiones inequívocas).

### 12.1 Refactor: `page.tsx` monolítico → componentes + datos

- **Qué se cambió:** El `app/page.tsx` original era un monolito de ~1.411 líneas con toda la estructura, el CSS inline y los datos de ejemplo mezclados. Se refactorizó en **9 componentes de sección** (`app/components/*.tsx`) y **4 ficheros de datos tipados** (`app/data/*.ts`), reduciendo `page.tsx` a un compositor de 20 líneas.
- **Por qué:** La separación por capas (composición ↔ presentación ↔ datos) permite editar el contenido del programa tocando solo `app/data/*.ts` sin riesgo de romper la lógica de presentación. Mejora la mantenibilidad (ver §7.5.3) y la testabilidad.
- **Evidencia:** `git show` del commit de refactor; `page.tsx` actual tiene 25 líneas; cada componente consume sus datos por `import` con interfaces TypeScript (`Module`, `Feature`, `Plan`, `Testimonial`).

### 12.2 Tests con Vitest (20 tests + cobertura)

- **Qué se cambió:** Se añadió la suite de tests `tests/page.test.tsx` con **20 tests** que cubren render, navegación, acordeón (estado inicial + toggle), pricing, testimonios y footer, junto con `vitest.config.ts` (jsdom, coverage v8, umbral `lines: 60%`) y `tests/setup.ts`.
- **Por qué:** Sin tests, cualquier refactor o cambio de contenido podía romper la renderización sin detección. La suite valida los flujos críticos y bloquea el pipeline (`npm run test:ci`) si algo falla.
- **Evidencia:** `npm run test:ci` → 20 passed (20); umbral de cobertura configurado en `vitest.config.ts:15`.

### 12.3 CI/CD: systemd → Docker

- **Qué se cambió:** El enfoque original (`scripts/setup-ec2.sh`) gestionaba Next.js como servicio systemd. Se migró a **Docker** (`Dockerfile` + `docker-compose.yml`), con `docker build`/`run` directo en la VM durante el deploy.
- **Por qué:** Docker aporta aislamiento completo del proceso, imágenes reproducibles (misma imagen = mismo comportamiento) y rollback atómico. El coste es un deploy ~15 s más lento (~25 s vs ~10 s), aceptable para una landing. Ver ADR-003 para el análisis cuantitativo.
- **Evidencia:** `Dockerfile` (imagen `node:24-alpine`, `CMD ["node", "server.js"]`); `deploy.yml` línea 79-89 ejecuta `docker build` + `docker run`.

### 12.4 Pipeline CI/CD dual (GitHub Actions + GitLab CI)

- **Qué se cambió:** Se añadió `.gitlab-ci.yml` como espejo del pipeline de GitHub Actions, con los mismos stages (`lint → test → build → deploy`) sobre `node:24-alpine`.
- **Por qué:** El contexto formativo (MISEIA 1-5-40) requiere demostrar competencia en ambas plataformas. Mantener ambos previene el acoplamiento a un único proveedor y asegura portabilidad del proceso.
- **Evidencia:** `.github/workflows/deploy.yml` (principal) y `.gitlab-ci.yml` (espejo) con stages idénticos.

### 12.5 Revisión crítica del trabajo con IA

| Aspecto | Evaluación | Evidencia |
|---------|------------|-----------|
| **Exactitud técnica** | **Adecuada.** El 85% del código generado por IA funcionó directamente. El 15% requirió correcciones identificadas por las herramientas de compilación. | `docs/ai-changes.md` registra cada corrección. |
| `"use client"` ausente | **Defecto detectado y corregido.** La IA omitió el directive en `HeroSection` y `CurriculumSection` (componentes con event handlers), causando un error de build. | Corregido añadiendo `"use client";`; detectado por `npm run build`. |
| Carácter no escapado | **Defecto detectado y corregido.** La IA generó `"` sin escapar en `TestimonialsSection`, rechazado por ESLint. | Corregido a `&ldquo;`; detectado por `npm run lint`. |
| Queries de test inadecuadas | **Defecto detectado y corregido.** La IA usó `getByText("DOMINA")`, pero el h1 tiene hijos mixtos (`<br>`, `<span>`). Corregido a `getByRole("heading", {level: 1})`. | `tests/page.test.tsx:27-30`. |
| **Contenido real validado** | **Adecuado.** La IA propuso contenido genérico; el desarrollador ajustó los 6 módulos, horas y temas con el contenido real del programa, y convirtió precios de $ a €. | `docs/ai-changes.md` § "Validaciones de contenido". |
| **Justificación de decisiones** | **Sólida.** Los 5 ADRs incluyen justificación cuantitativa (tamaños de bundle, costes/mes, tiempos de deploy) además de la cualitativa. | `docs/decisions/ADR-*.md`. |

**Conclusión de la revisión:** El uso de IA aceleró la generación del andamiaje (componentes, CSS, configuración de tests, Dockerfile, ADRs), pero **ningún fragmento generado se integró sin validación**. Las herramientas de compilación (`tsc`, `eslint`, `vitest`) y el despliegue real en EC2 funcionaron como red de seguridad: los defectos de la IA (directives faltantes, caracteres sin escapar, queries de test inadecuadas) fueron detectados y corregidos antes de llegar a producción. El contenido de negocio (módulos, precios, dominio, credenciales) fue provisto y verificado por el desarrollador en todos los casos.

---

## Contribución

```bash
git checkout -b feature/nombre-del-cambio
# ... hacer cambios ...
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-del-cambio
# Abrir Pull Request en GitHub
```

---

## Licencia

Uso educativo — bloque formativo MISEIA 1-5-40. © 2026 AIFormación.

---

## MongoDB en producción (EC2)

MongoDB corre como contenedor Docker (`mongo:7.0`, servicio `mongodb` en `docker-compose.yml`) en la instancia EC2 — no está instalado nativamente en el host. Los datos persisten en el volumen con nombre `mongo_data`, por lo que sobreviven a reinicios y redeploys del contenedor. La base de datos de la aplicación es `dominaia`.

### Cadena de conexión (MongoDB Compass)

```
mongodb://admin:MongoAdmin2024!@32.196.108.254:27017/dominaia?authSource=admin
```

> **Notas:**
> - El puerto `27017` debe estar abierto en el Security Group de EC2 (regla de entrada TCP 27017, idealmente restringida a tu IP en vez de `0.0.0.0/0`, ya que la autenticación es solo usuario/contraseña).
> - La instancia no tiene una IP elástica asignada: la IP pública cambia en cada reinicio. Si la conexión falla, verifica la IP actual de la instancia.

### Usuarios sembrados (demo)

Insertados por `npm run seed` (`scripts/seed-users.ts`) en la colección `dominaia.users`, de forma idempotente (upsert por email). Las contraseñas se muestran en texto plano únicamente para fines de demo/evaluación — en la base de datos solo se almacena el hash bcrypt.

| Nombre | Email | Contraseña |
|---|---|---|
| Ana García | ana.garcia@example.com | Ana#Pass2024 |
| Carlos Méndez | carlos.mendez@example.com | Carlos#Pass2024 |
| Lucía Fernández | lucia.fernandez@example.com | Lucia#Pass2024 |
| Diego Rojas | diego.rojas@example.com | Diego#Pass2024 |
| María Torres | maria.torres@example.com | Maria#Pass2024 |
