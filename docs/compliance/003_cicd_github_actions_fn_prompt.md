@~/.claude/prompts/new_functionality_prompt_spec.md

# Create a Github CI/CD Pipeline and Deploy App to VM at AWS

## Role
Act as a Software Architect, you are an expert in Github and Google Cloud Services.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — AIFormación landing page en Next.js 16.2.4 / React 19 / TypeScript.

- **Repositorio GitHub:** `Jorgeaapaz/gh-aws`
- **VM de destino:** `ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68`
- **Directorio de la app en VM:** `~/MISEIA140_aiformacion`
- **Dominio público:** `ia.iadevaps.com` (Hostinger wildcard `*.iadevaps.com`)
- **Variables de entorno en producción:** `.env.production` con `AWS_PUBLIC_IP=100.58.188.68`

**GitHub Secrets necesarios:**
| Secret | Valor |
|--------|-------|
| `EC2_SSH_KEY` | Contenido de `C:/ubuntuiso/.ssh/vboxuser` |
| `EC2_HOST` | `100.58.188.68` |
| `EC2_USER` | `ubuntu` |

El workflow actual (`.github/workflows/deploy.yml`) hace build y deploy pero:
- No ejecuta tests
- No ejecuta linter
- Usa Node 20 (se debe actualizar a 24)
- La IP de destino es inconsistente con `.env.production`
- No usa Docker ni nginx con dominio

**Issues corregidos:** `cq_ci_funcional` (GitHub)

## Task
Create Github actions that allows to test, compile and deploy the app to `ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68` in the directory `~/MISEIA140_aiformacion`. Test and build must be done in GitHub Actions. The service must be created in the remote ubuntu VM in Docker.

The app must be accessible through nginx using the domain `ia.iadevaps.com`, use the hostinger wildcard `*.iadevaps.com`.

Use /gh-cli and /gh for all secrets required.

### GitHub Actions Guidelines

**Workflow a crear/actualizar:** `.github/workflows/deploy.yml`

**Stages del pipeline:**
1. **lint** — `npm run lint` con Node 24
2. **test** — `npm run test:ci` con Node 24 (requiere T2: `002_tests_vitest_coverage_fn_prompt.md`)
3. **build** — `npm run build` con `NODE_ENV=production` solo en este step
4. **deploy** — SSH a `ubuntu@100.58.188.68`, sync del bundle, restart del contenedor Docker

**Docker en la VM:**
- Crear `Dockerfile` en la raíz del proyecto para la imagen de Next.js standalone
- El contenedor escucha en puerto `3000`
- El servicio Docker se gestiona como servicio systemd o con `docker compose`
- Directorio de despliegue: `~/MISEIA140_aiformacion`

**Nginx en la VM:**
- Reverse proxy de `ia.iadevaps.com` → `localhost:3000`
- Usar el certificado wildcard de Hostinger `*.iadevaps.com` ya instalado vía Certbot
- Si no está instalado, el workflow debe ejecutar `sudo certbot --nginx -d ia.iadevaps.com`

**Secrets con gh CLI:**
```bash
gh secret set EC2_SSH_KEY --body "$(cat C:/ubuntuiso/.ssh/vboxuser)"
gh secret set EC2_HOST --body "100.58.188.68"
gh secret set EC2_USER --body "ubuntu"
```

## Output format
- `.github/workflows/deploy.yml` — workflow completo con los 4 stages
- `Dockerfile` — imagen Next.js standalone
- `docker-compose.yml` — (opcional) orquestación en la VM
- `nginx/ia.iadevaps.com.conf` — configuración nginx para la VM (incluir en repo para referencia)

## Examples and Steps to follow

1. Verificar secrets actuales: `gh secret list`
2. Actualizar o crear secrets con los valores correctos via `gh secret set`
3. Crear `Dockerfile`:
```dockerfile
FROM node:24-alpine AS base
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
EXPOSE 3000
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```
4. Escribir el workflow con jobs: `lint → test → build → deploy`
5. El job `deploy` debe:
   - SSH a la VM
   - Docker pull o rebuild de la imagen
   - Reemplazar el contenedor en ejecución
   - Verificar que el servicio responde con `curl http://localhost:3000`
6. Push y verificar que el workflow pasa en verde

## Output checklist and Guardrails

- [ ] `npm run lint` ejecutado en CI antes del build
- [ ] `npm run test:ci` ejecutado en CI antes del build
- [ ] `NODE_ENV=production` solo en el step de build, no como variable de job
- [ ] Node 24 en todos los jobs
- [ ] Deploy solo en push a `main` (mantener `workflow_dispatch`)
- [ ] IP de destino es `100.58.188.68` (consistente con `.env.production`)
- [ ] El servicio corre en Docker en la VM
- [ ] nginx enruta `ia.iadevaps.com` al contenedor
- [ ] El último build del workflow es verde antes de dar la tarea por completada
- [ ] Los secrets están configurados en GitHub via `gh secret set`
