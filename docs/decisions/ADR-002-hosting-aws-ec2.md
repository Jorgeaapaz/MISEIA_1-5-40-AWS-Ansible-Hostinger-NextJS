# ADR-002: Hosting — AWS EC2 sobre PaaS gestionado

## Estado
Aceptado

## Contexto
El proyecto es un entregable del bloque formativo MISEIA 1-5-40. Además de funcionar como landing page, debe demostrar competencia en infraestructura cloud y CI/CD. El evaluador valorará el control explícito sobre el servidor.

## Alternativas evaluadas

| Alternativa | Coste mensual | Control infra | Complejidad |
|-------------|---------------|---------------|-------------|
| **AWS EC2 t2.micro** | ~$8/mes (o free tier 12 meses) | Total (SSH, nginx, SSL, Docker) | Alta — requiere setup manual |
| Vercel Free | $0 | Ninguno | Mínima |
| Vercel Pro | $20/mes | Mínimo | Baja |
| Netlify | $0–$19/mes | Bajo | Baja |
| Railway | $5–$20/mes | Medio | Media |

## Decisión
Usar **AWS EC2 t2.micro** con Ubuntu 22.04, gestionado con Ansible, Docker y nginx.

## Justificación cuantitativa
- Coste EC2 t2.micro en us-east-1: **$0.0116/hora × 720 h = $8.35/mes** (o gratis en free tier el primer año) frente a $20/mes de Vercel Pro.
- Ahorro de **$11.65/mes** respecto a Vercel Pro, o **$0** en free tier.
- Objetivo pedagógico: demostrar pipeline completo SSH + rsync/scp + Docker + nginx con TLS — no alcanzable con PaaS gestionado en la misma profundidad.

## Consecuencias
- Se requiere gestión manual del servidor: actualizaciones de seguridad, certificados SSL (renovación automática con Certbot), logs con `docker logs`.
- Si el proyecto escalase, migrar a ECS/Fargate o a un PaaS sería la siguiente decisión a tomar — documentado en [ADR-003](ADR-003-docker-vs-systemd.md).
- La IP pública puede cambiar si la instancia se detiene (mitigado documentando el proceso en `docs/prompts/create-aws-infrastructure.md`).
