@~/.claude/prompts/new_functionality_prompt_spec.md

# Completar Despliegue en EC2 y Documentar URL Pública

## Role
Act as a Software Architect and IT Infrastructure Engineer, expert in AWS EC2, Docker, nginx, Certbot/SSL, and Next.js production deployments.

## Context
Proyecto: **1-5-40-nextjs-gh-aws** — AIFormación landing page Next.js.

**Infraestructura:**
- **VM EC2:** Ubuntu en `100.58.188.68`
- **SSH:** `ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68`
- **Dominio:** `ia.iadevaps.com` (DNS Hostinger, wildcard `*.iadevaps.com`)
- **Directorio de app:** `~/MISEIA140_aiformacion`
- **Puerto interno:** `3000`
- **Servicio:** Docker container + nginx reverse proxy

**Ansible:** Disponible en `D:\Master-IA-Dev\05-Bloque5\1-5-30-ansible-aws\ansible\`
- `inventory.ini` → host `100.58.188.68`
- `playbook.yml` → instala nginx, Node.js, Certbot

**Estado actual:**
- `scripts/setup-ec2.sh` existe pero está marcado como pendiente en AGENTS.md
- El workflow GitHub Actions despliega a `${{ secrets.EC2_HOST }}` pero la URL pública no está verificada ni documentada
- El README no menciona la URL pública

**Issues corregidos:** `fn_deploy_publico_accesible`

## Task
Completar el despliegue de la aplicación en la VM EC2, verificar que `https://ia.iadevaps.com` es accesible, y documentar la URL en el README.

### Deploy Guidelines

**Paso 1: Verificar conectividad a la VM**
```bash
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "echo 'OK'"
```

**Paso 2: Verificar/instalar infraestructura con Ansible**
```bash
# En WSL:
cd /mnt/d/master-ia-dev/05-Bloque5/1-5-30-ansible-aws/ansible
ansible-playbook -i inventory.ini playbook.yml
```
Esto instala: nginx, Node.js, Certbot con TLS para `ia.iadevaps.com`.

**Paso 3: Verificar puertos abiertos en el Security Group de AWS**
```bash
aws --profile jaap-2026 ec2 describe-security-groups --filters "Name=ip-permission.from-port,Values=80" --query "SecurityGroups[*].GroupId"
# Abrir puertos 80 y 443 si no están abiertos
```

**Paso 4: Preparar la VM para Docker**
```bash
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 << 'EOF'
  # Instalar Docker si no está instalado
  which docker || (curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker ubuntu)
  # Crear directorio de la app
  mkdir -p ~/MISEIA140_aiformacion
EOF
```

**Paso 5: Trigger del pipeline de GitHub Actions**
- Hacer push a `main` o usar `workflow_dispatch` para que GitHub Actions despliegue la app
- Verificar que el workflow pasa en verde en `https://github.com/Jorgeaapaz/gh-aws/actions`

**Paso 6: Configurar nginx para el dominio**
```bash
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 << 'EOF'
sudo tee /etc/nginx/sites-available/ia.iadevaps.com > /dev/null <<'NGINX'
server {
    listen 80;
    server_name ia.iadevaps.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name ia.iadevaps.com;
    ssl_certificate /etc/letsencrypt/live/ia.iadevaps.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ia.iadevaps.com/privkey.pem;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/ia.iadevaps.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
EOF
```

**Paso 7: Verificar certificado SSL**
```bash
ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "sudo certbot certificates"
# Si no hay certificado para ia.iadevaps.com:
# sudo certbot --nginx -d ia.iadevaps.com
```

**Paso 8: Validar acceso público**
```bash
curl -I https://ia.iadevaps.com
# Esperado: HTTP/2 200
```

**Paso 9: Actualizar README**
- Añadir `https://ia.iadevaps.com` en la sección Demo del README
- Añadir badge de CI en el README

## Output format
- VM configurada y app corriendo en `https://ia.iadevaps.com`
- `README.md` actualizado con la URL pública
- Captura de terminal mostrando `curl -I https://ia.iadevaps.com` con respuesta 200

## Examples and Steps to follow

Ejecutar los pasos en orden. Verificar cada uno antes de continuar. En caso de error en Certbot, usar el certificado wildcard `*.iadevaps.com` ya emitido por Hostinger si está disponible en la VM.

## Output checklist and Guardrails

- [ ] `ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@100.58.188.68 "echo OK"` funciona
- [ ] `curl -I https://ia.iadevaps.com` devuelve HTTP 200
- [ ] El contenedor Docker está corriendo en la VM
- [ ] nginx enruta correctamente al puerto 3000
- [ ] Certificado SSL válido (sin advertencias de certificado en browser)
- [ ] `README.md` tiene la URL `https://ia.iadevaps.com` en la sección Demo
- [ ] Puertos 80 y 443 abiertos en el Security Group de AWS
- [ ] DNS `ia.iadevaps.com` apunta a `100.58.188.68` (verificar con `nslookup ia.iadevaps.com`)
