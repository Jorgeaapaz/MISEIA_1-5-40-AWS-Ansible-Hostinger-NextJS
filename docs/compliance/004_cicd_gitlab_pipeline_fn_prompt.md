@~/.claude/prompts/new_functionality_prompt_spec.md

# Configurar GitLab CI/CD Pipeline para AIFormación

## Role
Act as a Software Architect and DevOps Engineer, expert in GitLab CI/CD, Docker, and Node.js deployments.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — AIFormación landing page en Next.js 16.2.4 / React 19 / TypeScript.

- **Repositorio GitLab:** `gitlab.codecrypto.academy/Jorgeaapaz/gh-aws` (o equivalente)
- **VM de destino:** `ssh -i ~/.ssh/vboxuser ubuntu@100.58.188.68`
- **Directorio de la app en VM:** `~/MISEIA140_aiformacion`
- **Dominio público:** `ia.iadevaps.com`
- **Variables de entorno en producción:** `.env.production` con `AWS_PUBLIC_IP=100.58.188.68`

No existe `.gitlab-ci.yml` en el proyecto.

**Issues corregidos:** `cq_ci_funcional` (GitLab)

## Task
Crear el fichero `.gitlab-ci.yml` en la raíz del proyecto con un pipeline completo de CI/CD que ejecute lint, tests, build y deploy a la VM EC2 en `ubuntu@100.58.188.68`.

Usar /glab para configurar variables CI/CD en GitLab.

### GitLab CI/CD Guidelines

**Stages:**
1. `lint` — ejecutar `npm run lint`
2. `test` — ejecutar `npm run test:ci`
3. `build` — ejecutar `NODE_ENV=production npm run build` (NODE_ENV solo en el comando de build, NO como variable de job)
4. `deploy` — SSH al servidor y reiniciar el contenedor Docker

**Variables CI/CD necesarias en GitLab** (configurar con `/glab` o en GitLab UI > Settings > CI/CD > Variables):
| Variable | Descripción |
|----------|-------------|
| `EC2_SSH_KEY` | Clave SSH privada (valor del fichero `vboxuser`) |
| `EC2_HOST` | `100.58.188.68` |
| `EC2_USER` | `ubuntu` |

**Reglas de ejecución:**
- `lint` y `test`: en todo push (branches + MRs)
- `build`: en todo push
- `deploy`: solo en push a `main` (`only: [main]`)

**Importante:** Nunca usar `NODE_ENV=production` como variable a nivel de job (en la sección `variables:`). Solo inyectarlo inline en el comando `npm run build`.

**Docker en la VM:** el contenedor ya está configurado por el pipeline de GitHub Actions (T4). El job de deploy de GitLab debe:
1. SSH a la VM
2. Pull del repositorio o sync del bundle
3. Rebuild y restart del contenedor Docker con `docker compose up -d --build` o equivalente

## Output format
- `.gitlab-ci.yml` — pipeline completo
- Comandos `/glab` para configurar las variables CI/CD

## Examples and Steps to follow

1. Configurar variables en GitLab con `/glab` (usar el skill /glab):
```bash
glab variable set EC2_SSH_KEY --value "$(cat ~/.ssh/vboxuser)" --masked
glab variable set EC2_HOST --value "100.58.188.68"
glab variable set EC2_USER --value "ubuntu"
```

2. Estructura del `.gitlab-ci.yml`:
```yaml
stages:
  - lint
  - test
  - build
  - deploy

default:
  image: node:24-alpine
  cache:
    paths:
      - node_modules/

lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

test:
  stage: test
  script:
    - npm ci
    - npm run test:ci

build:
  stage: build
  script:
    - npm ci
    - NODE_ENV=production npm run build
  artifacts:
    paths:
      - .next/standalone/
      - .next/static/
      - public/
    expire_in: 1 hour

deploy:
  stage: deploy
  only:
    - main
  before_script:
    - apt-get update -q && apt-get install -y openssh-client rsync
    - mkdir -p ~/.ssh
    - echo "$EC2_SSH_KEY" > ~/.ssh/deploy_key
    - chmod 600 ~/.ssh/deploy_key
    - ssh-keyscan -H "$EC2_HOST" >> ~/.ssh/known_hosts
  script:
    - rsync -az --delete
        -e "ssh -i ~/.ssh/deploy_key"
        .next/standalone/
        "$EC2_USER@$EC2_HOST:~/MISEIA140_aiformacion/"
    - ssh -i ~/.ssh/deploy_key "$EC2_USER@$EC2_HOST"
        "cd ~/MISEIA140_aiformacion && docker compose up -d --build"
```

3. Commit y push del fichero
4. Verificar que el pipeline pasa en GitLab CI/CD

## Output checklist and Guardrails

- [ ] `NODE_ENV=production` SOLO en el comando `npm run build`, NO como variable a nivel de job
- [ ] Las 4 stages están definidas: lint, test, build, deploy
- [ ] Deploy solo en la branch `main`
- [ ] `EC2_SSH_KEY` configurada como variable enmascarada en GitLab
- [ ] El pipeline usa Node 24
- [ ] Los artifacts del build se pasan al job de deploy
- [ ] El último pipeline en GitLab es verde antes de dar la tarea por completada
- [ ] Sin credenciales hardcodeadas en `.gitlab-ci.yml`
