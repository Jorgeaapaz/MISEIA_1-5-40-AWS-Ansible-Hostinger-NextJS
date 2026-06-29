# ADR-003: Servicio en producción — Docker sobre systemd directo

## Estado
Aceptado (reemplaza el enfoque inicial de `setup-ec2.sh` con systemd)

## Contexto
El `scripts/setup-ec2.sh` original gestionaba el proceso Next.js como un servicio systemd. Al introducir CI/CD automático, se necesita una forma de actualizar la aplicación sin downtime y sin gestionar versiones de Node.js directamente en el sistema operativo del host.

## Alternativas evaluadas

| Alternativa | Aislamiento | Actualización | Rollback | Complejidad |
|-------------|-------------|---------------|----------|-------------|
| **Docker** | Alto — proceso en contenedor | `docker stop/rm/run` atómico | `docker run` con imagen anterior | Media |
| systemd directo | Ninguno — mismo OS | `systemctl restart` + rsync | Manual — restaurar archivos | Baja |
| PM2 | Bajo — mismo Node.js | `pm2 reload` con zero-downtime | `pm2 list` + reactivar versión | Baja-Media |
| Docker Compose | Alto | `compose up -d --build` | `compose pull + up` | Media |

## Decisión
Usar **Docker** con `docker run` directo (sin Compose en producción).

Docker Compose se descartó para el deploy en EC2 porque la imagen se construye desde el directorio local con `docker build` — no se usa un registry remoto — y `docker run` directo es más explícito y predecible en scripts CI/CD.

## Justificación cuantitativa
Con systemd, una actualización requiere:
1. rsync del nuevo bundle (~8 s)
2. `systemctl restart gh-aws` (~2 s, con breve downtime mientras Node.js reinicia)

Con Docker:
1. `docker build` en la VM a partir del bundle ya transferido (~15 s para imagen Alpine + Node.js 24)
2. `docker stop` + `docker rm` + `docker run` (~2 s combinados)

El tiempo total es mayor con Docker (~25 s vs ~10 s), pero se obtiene **aislamiento completo**, la imagen es **reproducible** (misma imagen = mismo comportamiento), y la actualización es **atómica** (el contenedor antiguo se detiene antes de que el nuevo arranque).

## Consecuencias
- La imagen Docker incluye los `node_modules` del bundle standalone, lo que aumenta su tamaño (~180 MB comprimida). Aceptable para este caso de uso.
- Si se quisiera zero-downtime, el siguiente paso sería añadir un segundo puerto o usar un load balancer delante de dos contenedores alternos.
- La gestión de logs se hace con `docker logs aiformacion -f` en lugar de `journalctl`.
