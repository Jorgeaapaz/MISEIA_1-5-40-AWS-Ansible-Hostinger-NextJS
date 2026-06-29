# Registro de Uso de IA — AIFormación

Este documento registra el uso de IA (Claude Sonnet 4.6) en el desarrollo del proyecto y qué fue revisado, validado o modificado por el desarrollador.

---

## Qué generó la IA

### Código generado inicialmente por IA

| Componente | Descripción |
|------------|-------------|
| `app/page.tsx` (versión inicial) | Componente completo de la landing page (1.411 líneas) incluyendo estructura de secciones, CSS inline y data de ejemplo |
| `app/layout.tsx` | Root layout con fuentes Google (Unbounded + Plus Jakarta Sans) y metadata SEO |
| `app/globals.css` | Variables CSS, reset y animaciones CSS (@keyframes) |
| `.github/workflows/deploy.yml` (v1) | Pipeline inicial de GitHub Actions para build + deploy a EC2 |
| `scripts/setup-ec2.sh` | Script de bootstrap del servidor EC2 con systemd |
| `docs/compliance/` | Informe de cumplimiento, plan PERT y 8 prompts de corrección |

### Infraestructura generada por IA (sesión de compliance)

| Fichero | Descripción |
|---------|-------------|
| `vitest.config.ts` | Configuración de Vitest con jsdom |
| `tests/setup.ts` | Setup de @testing-library/jest-dom |
| `tests/page.test.tsx` | 20 tests del componente Home |
| `app/data/*.ts` | 4 ficheros de datos tipados (curriculum, features, testimonials, plans) |
| `app/components/*.tsx` | 9 componentes de sección extraídos de page.tsx |
| `.github/workflows/deploy.yml` (v2) | Workflow actualizado con lint + test + Node 24 + Docker |
| `.gitlab-ci.yml` | Pipeline GitLab CI/CD completo |
| `Dockerfile` | Imagen Docker para el standalone bundle |
| `docs/architecture.md` | Diagramas Mermaid de arquitectura |
| `docs/decisions/ADR-*.md` | 3 ADRs con trade-offs técnicos |

---

## Qué validó/modificó el desarrollador

### Validaciones de contenido (no generadas por IA)

| Elemento | Acción del desarrollador |
|----------|--------------------------|
| **Contenido del programa formativo** | Los 6 módulos, sus títulos, horas y temas son reales del programa. La IA propuso una estructura genérica; el desarrollador la ajustó con el contenido real del máster. |
| **Precios** | La IA propuso precios en dólares ($497, $997, $1997). El desarrollador los convirtió a euros (€497, €997, €1.997) y ajustó el separador de miles al formato europeo. |
| **Dominio y URLs** | `ia.iadevaps.com` es el dominio real del proyecto. La IA no conocía el dominio; fue provisto por el desarrollador. |
| **IPs y credenciales SSH** | `100.58.188.68` y la ruta de la clave SSH son reales. La IA usó placeholders que el desarrollador sustituyó. |
| **Testimonios** | Los nombres y roles son ficticios pero apropiados para el dominio. El desarrollador validó que el tono y las empresas (Telefónica, BBVA, FinAI) fuesen coherentes con el mercado español de IA. |

### Modificaciones técnicas realizadas por el desarrollador

| Cambio | Motivo |
|--------|--------|
| `"use client"` añadido a `HeroSection.tsx` y `CurriculumSection.tsx` | La IA olvidó el directive en componentes con event handlers. El error lo detectó el `npm run build`. |
| Corrección del quote `"` → `&ldquo;` en `TestimonialsSection.tsx` | La IA generó un carácter HTML no escapado que el linter ESLint detectó. |
| Tests `getByText("DOMINA")` → `getByRole("heading", {level: 1})` | El heading h1 tiene hijos mixtos (`<br>` y `<span>`). La IA generó una query que fallaba; el desarrollador la corrigió usando el rol semántico. |
| `getAllByText` en lugar de `getByText` para "3.200+" y "94%" | Esos valores aparecen en dos secciones (Hero y Mentores). La IA no anticipó la duplicación. |
| Dockerfile reescrito para estructura standalone ya extraída | El Dockerfile original asumía que el bundle estaba en `.next/standalone/` dentro del build context, pero en la VM el contenido se extrae directamente. |
| `docker compose` → `docker run` directo en el deploy | El `docker compose up -d --build` no mapeaba los puertos correctamente en la primera iteración. El `docker run` directo con `-p 3000:3000` explícito fue más fiable. |

---

## Revisión crítica del código generado por IA

### Lo que funcionó bien desde el primer intento
- La estructura visual de la landing (CSS, animaciones, jerarquía de secciones)
- La configuración de Vitest y los mocks de `next/font`
- Los diagramas Mermaid de arquitectura
- La estructura de los ADRs

### Lo que requirió iteración
- Los tests necesitaron 2 iteraciones para manejar texto en nodos mixtos de React
- El Dockerfile necesitó 2 versiones (una para CI/CD que construye desde fuentes, otra para el deploy manual desde bundle ya extraído)
- El `"use client"` faltante en HeroSection causó un error de build que requirió diagnóstico

### Conclusión
El 85% del código es directo de la generación IA con validación del desarrollador. El 15% restante requirió correcciones técnicas identificadas mediante las herramientas de compilación (`tsc`, `eslint`, `vitest`) y el despliegue real en EC2.
