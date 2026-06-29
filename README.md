# AIFormación — Landing Page Programa de IA

[![Build & Deploy](https://github.com/Jorgeaapaz/gh-aws/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jorgeaapaz/gh-aws/actions/workflows/deploy.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)](https://nextjs.org)

Landing page profesional que promueve **AIFormación**, un programa de formación en Inteligencia Artificial. Construida con Next.js App Router y desplegada en AWS EC2 mediante GitHub Actions.

---

## Demo

**URL pública:** https://ia.iadevaps.com ✅ (activa — Docker en AWS EC2 `100.58.188.68`)

---

## Requisitos previos

- Node.js 20 o superior
- npm 10+
- (Para deploy) Acceso SSH a la VM EC2: `ubuntu@100.58.188.68`

---

## Instalación

```bash
git clone https://github.com/Jorgeaapaz/gh-aws.git
cd gh-aws
npm install
```

Copiar las variables de entorno:

```bash
cp .env.example .env
```

Editar `.env` con los valores reales (ver tabla en [Variables de entorno](#variables-de-entorno)).

---

## Ejecución local

**Modo desarrollo** (hot-reload):

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

**Modo producción local:**

```bash
npm run build
npm start
```

---

## Linter

```bash
npm run lint
```

Configurado con `eslint-config-next/core-web-vitals` + TypeScript.

---

## Tests

> Los tests con Vitest se añadirán en la tarea T2. Una vez configurados:

```bash
npm test          # modo watch
npm run test:ci   # ejecución única (para CI)
npm run coverage  # reporte de cobertura
```

---

## Sección de uso

La landing page está organizada en 7 secciones de scroll continuo:

| Sección | Anchor | Descripción |
|---------|--------|-------------|
| Hero | — | Titular principal, estadísticas clave y CTAs de conversión |
| Por qué elegirnos | — | Grid de 6 features con métricas destacadas |
| Programa | `#programa` | Acordeón interactivo con los 6 módulos del curso |
| Mentores | `#mentores` | Perfil de la directora del programa + métricas de alumni |
| Precios | `#precios` | 3 planes (Esencial / Pro / Elite) con comparativa de perks |
| Testimonios | — | 3 testimonios de alumni con role verificado |
| CTA final | — | Banner de urgencia con contador de plazas disponibles |

**Navegación:** La barra superior tiene links ancla a `#programa`, `#mentores` y `#precios`. El acordeón del currículum es interactivo — click para expandir/colapsar cada módulo.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AWS_VPS_NAME` | Nombre de la instancia EC2 | `jaap-ec2-instance` |
| `AWS_SSH_ACCESS` | Comando SSH completo | `ssh -i ~/.ssh/vboxuser ubuntu@100.58.188.68` |
| `AWS_PUBLIC_IP` | IP pública de la VM | `100.58.188.68` |

Copiar `.env.example` como `.env` y rellenar los valores. **No commitear `.env`** (está en `.gitignore`).

---

## Despliegue

### Infraestructura

El servidor es una instancia AWS EC2 Ubuntu (`100.58.188.68`) gestionada con:
- **Ansible:** bootstrap de nginx, Node.js y Certbot (directorio `D:\Master-IA-Dev\05-Bloque5\1-5-30-ansible-aws\ansible\`)
- **Docker:** contenedor Next.js standalone en `~/MISEIA140_aiformacion`
- **nginx:** reverse proxy HTTPS en `ia.iadevaps.com`

### Bootstrap del servidor (una sola vez)

```bash
# Opción A — Script de setup
scp scripts/setup-ec2.sh ubuntu@100.58.188.68:~/
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "bash setup-ec2.sh"

# Opción B — Ansible (recomendado)
cd D:\Master-IA-Dev\05-Bloque5\1-5-30-ansible-aws\ansible
ansible-playbook -i inventory.ini playbook.yml
```

### CI/CD automático

El pipeline GitHub Actions (`.github/workflows/deploy.yml`) se activa en cada push a `main`:

1. `lint` — Verificación ESLint
2. `test` — Suite de tests con Vitest
3. `build` — Next.js build con `NODE_ENV=production`
4. `deploy` — rsync del bundle a EC2 + restart del servicio Docker

**GitHub Secrets necesarios:**

| Secret | Valor |
|--------|-------|
| `EC2_SSH_KEY` | Contenido de `C:/ubuntuiso/.ssh/vboxuser` |
| `EC2_HOST` | `100.58.188.68` |
| `EC2_USER` | `ubuntu` |

### Verificar el despliegue

```bash
# Comprobar respuesta HTTP
curl -I https://ia.iadevaps.com

# Comprobar servicio en la VM
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "docker ps"
```

---

## Estructura del proyecto

```
1-5-40-nextjs-gh-aws/
├── app/
│   ├── layout.tsx          # Root layout con fuentes (Unbounded + Plus Jakarta Sans)
│   ├── page.tsx            # Componente principal de la landing page
│   └── globals.css         # Estilos globales y variables CSS
├── public/                 # Assets estáticos (SVGs)
├── scripts/
│   └── setup-ec2.sh        # Bootstrap de la instancia EC2 (ejecutar una vez)
├── docs/
│   ├── compliance/         # Informe de cumplimiento y prompts PERT
│   └── prompts/            # Prompts de configuración de infraestructura
├── .github/
│   └── workflows/
│       └── deploy.yml      # Pipeline CI/CD GitHub Actions
├── .env.example            # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

---

## Decisiones de arquitectura

Ver [`docs/decisions/`](docs/decisions/) para los ADRs (Architecture Decision Records) con los trade-offs técnicos del proyecto.

Registro de uso de IA: [`docs/ai-changes.md`](docs/ai-changes.md).

---

## Contribución

```bash
git checkout -b feature/nombre-del-cambio
# ... hacer cambios ...
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-del-cambio
# Abrir Pull Request en GitHub
```
