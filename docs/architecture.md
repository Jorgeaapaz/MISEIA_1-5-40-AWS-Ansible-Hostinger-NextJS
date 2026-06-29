# Arquitectura del Sistema — AIFormación

## 1. Arquitectura de la Aplicación

La aplicación sigue la estructura del App Router de Next.js con separación por capas: datos, componentes de sección y página compositor.

```mermaid
graph TD
  subgraph "app/ — Next.js App Router"
    LAYOUT["layout.tsx\nRoot layout · fuentes · metadata"]
    PAGE["page.tsx\nCompositor — orquesta secciones"]

    subgraph "components/"
      NAV[Nav.tsx]
      HERO[HeroSection.tsx]
      FEAT[FeaturesSection.tsx]
      CURR[CurriculumSection.tsx\n«use client» · useState]
      MENT[MentorSection.tsx]
      PRIC[PricingSection.tsx\n«use client»]
      TEST[TestimonialsSection.tsx]
      CTA[CtaSection.tsx]
      FOOT[Footer.tsx]
    end

    subgraph "data/"
      CURRICULUM["curriculum.ts\nMODULES: Module[]"]
      FEATURES["features.ts\nFEATURES: Feature[]"]
      TESTIMONIALS["testimonials.ts\nTESTIMONIALS: Testimonial[]"]
      PLANS["plans.ts\nPLANS: Plan[]"]
    end
  end

  LAYOUT --> PAGE
  PAGE --> NAV & HERO & FEAT & CURR & MENT & PRIC & TEST & CTA & FOOT
  CURR --> CURRICULUM
  FEAT --> FEATURES
  TEST --> TESTIMONIALS
  PRIC --> PLANS
```

| Componente | Tipo | Responsabilidad |
|------------|------|-----------------|
| `layout.tsx` | Server | Fuentes Google, metadata SEO, HTML root |
| `page.tsx` | Server | Compositor puro — 20 líneas |
| `CurriculumSection` | Client | Estado del acordeón (`useState`) |
| `HeroSection` | Client | Hover handlers en botones |
| `PricingSection` | Client | Hover handlers en botones de plan |
| `data/*.ts` | — | Constantes tipadas, sin lógica |

---

## 2. Flujo CI/CD

Dos pipelines activos: GitHub Actions (principal) y GitLab CI/CD (espejo).

```mermaid
flowchart LR
  DEV["👨‍💻 Developer\npush → main"]

  subgraph "GitHub Actions"
    LINT["lint\neslint"]
    TEST["test\nvitest run"]
    BUILD["build\nNODE_ENV=production\nnpm run build"]
    DEPLOY["deploy\nrsync + SSH\nDocker rebuild"]
  end

  subgraph "GitLab CI"
    GL_LINT["lint"]
    GL_TEST["test"]
    GL_BUILD["build"]
    GL_DEPLOY["deploy"]
  end

  EC2["🖥️ AWS EC2\nubuntu@100.58.188.68\n~/MISEIA140_aiformacion"]
  DOCKER["🐳 Docker\naiformacion:latest\n:3000"]
  NGINX["🔀 nginx\nreverse proxy\n:80/:443"]
  DOMAIN["🌐 ia.iadevaps.com\nHTTPS · Certbot"]

  DEV --> LINT --> TEST --> BUILD --> DEPLOY
  DEV -.->|mirror| GL_LINT --> GL_TEST --> GL_BUILD --> GL_DEPLOY

  DEPLOY --> EC2
  GL_DEPLOY -.-> EC2
  EC2 --> DOCKER --> NGINX --> DOMAIN
```

**Stages del pipeline:**

| Stage | Herramienta | Condición |
|-------|-------------|-----------|
| lint | ESLint + eslint-config-next | Todo push |
| test | Vitest run (20 tests) | Todo push |
| build | Next.js standalone, `NODE_ENV=production` | Tras lint+test |
| deploy | rsync + SSH + Docker compose | Solo branch `main` |

---

## 3. Stack de Infraestructura

```mermaid
graph TB
  USER["👤 Usuario\nbrowser"]

  subgraph "Hostinger DNS"
    DNS["ia.iadevaps.com\n→ 100.58.188.68\nWildcard *.iadevaps.com"]
  end

  subgraph "AWS EC2 — Ubuntu 22.04"
    NGINX2["nginx\npuerto 80/443\nSSL Certbot"]
    DOCKER2["Docker daemon"]
    APP["Next.js standalone\nnodo server.js\npuerto 3000"]
    FILES["~/MISEIA140_aiformacion/\nstandalone bundle\nDockerfile\ndocker-compose.yml"]
  end

  subgraph "Bootstrap (una vez)"
    ANSIBLE["Ansible playbook\ninstala: nginx · Node.js · Certbot"]
  end

  USER -->|"HTTPS :443"| DNS --> NGINX2
  NGINX2 -->|"proxy_pass :3000"| DOCKER2
  DOCKER2 --> APP
  APP --- FILES
  ANSIBLE -.->|"configura"| NGINX2 & DOCKER2
```

**Componentes de infraestructura:**

| Componente | Tecnología | Versión | Propósito |
|------------|------------|---------|-----------|
| VM | AWS EC2 Ubuntu | 22.04 LTS | Host principal |
| Contenedor | Docker | 24+ | Aislamiento del proceso Node.js |
| Orquestación | docker-compose | v2 | Gestión del ciclo de vida |
| Proxy | nginx | 1.24+ | TLS termination + reverse proxy |
| SSL | Certbot / Let's Encrypt | — | Certificado wildcard `*.iadevaps.com` |
| DNS | Hostinger | — | Dominio `ia.iadevaps.com` → `100.58.188.68` |
| Aprovisionamiento | Ansible | 2.x | Bootstrap idempotente del servidor |
| Runtime | Node.js | 24 LTS | Ejecución de Next.js standalone |
