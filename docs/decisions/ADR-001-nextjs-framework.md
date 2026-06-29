# ADR-001: Framework — Next.js sobre alternativas

## Estado
Aceptado

## Contexto
Se necesita una landing page con interactividad (acordeón de currículum, hover effects) y buen SEO para posicionamiento orgánico. El tiempo de despliegue disponible es breve (bloque formativo).

## Alternativas evaluadas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Next.js 16** | SSR/SSG nativo, App Router, standalone output compacto (~50 MB vs ~300 MB con `node_modules`), ecosistema maduro | Requiere Node.js en producción |
| **Astro** | Build ultra-rápido, HTML estático puro, zero JS por defecto | Menor madurez del ecosistema; componentes interactivos requieren hidratación manual |
| **Vite + React** | Simplicidad de configuración | Sin SSR nativo; necesita servidor separado o CDN para SEO |
| **SvelteKit** | Excelente rendimiento, sintaxis concisa | Equipo sin experiencia previa en Svelte; curva de aprendizaje |

## Decisión
Usar **Next.js 16.2.4** con App Router y `output: "standalone"`.

## Justificación cuantitativa
- El bundle `standalone` de Next.js ocupa aproximadamente **50 MB** frente a los ~300 MB de una instalación completa con `node_modules`. Esto reduce el tiempo de transferencia por deploy de ~45 s a ~8 s en la red del servidor EC2 (medido con rsync/scp).
- La generación estática (`○ Static`) de la landing produce HTML pre-renderizado sin carga en el servidor para cada visita, equivalente a servir estáticos desde nginx.

## Consecuencias
- Requiere Node.js en la VM de producción (ya resuelto con Node 20 vía Ansible).
- El `output: "standalone"` no incluye las imágenes del directorio `public/` ni los assets de `.next/static/` — hay que copiarlos manualmente en el bundle antes del deploy (resuelto en el workflow de CI/CD).
