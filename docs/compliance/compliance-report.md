# Compliance Report — 1-5-40-nextjs-gh-aws
**Evaluado por:** Claude Sonnet 4.6  
**Fecha:** 2026-06-29  
**Proyecto:** AIFormación — Landing page programa formación IA  
**Stack:** Next.js 16.2.4 · React 19 · TypeScript · Tailwind CSS · GitHub Actions · AWS EC2

---

## Resumen ejecutivo

| Categoría | Conforme | Parcial | No conforme | No aplica |
|-----------|----------|---------|-------------|-----------|
| Funcionalidad | 6 | 0 | 1 | 3 |
| Calidad de código | 5 | 2 | 3 | 0 |
| Documentación | 2 | 1 | 7 | 0 |
| **TOTAL** | **13** | **3** | **11** | **3** |

---

## 1. Funcionalidad y cumplimiento del enunciado

### Base (4/4)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `fn_se_instala` | ✅ CONFORME | `package.json` con `npm install`; `package-lock.json` commiteado; README tiene `npm run dev` |
| `fn_arranca_local` | ✅ CONFORME | `npm run dev` arranca en `localhost:3000` sin config adicional |
| `fn_flujo_principal_funciona` | ✅ CONFORME | Landing page completa: hero, features, curriculum acordeón, mentores, pricing, testimonios, CTA |
| `fn_persistencia_efectiva` | **NO APLICA** | Landing page estática, sin BBDD ni storage |

### Notable (3/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `fn_validaciones_de_entrada` | **NO APLICA** | Sin formularios, sin input de usuario que requiera validación |
| `fn_manejo_errores_consistente` | **NO APLICA** | Componente estático sin llamadas API ni operaciones con error |
| `fn_funciones_completas_del_enunciado` | ✅ CONFORME | Todas las secciones del programa implementadas; navegación funcional |

### Excepcional (2/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `fn_features_extra_pertinentes` | ✅ CONFORME | Acordeón interactivo en currículum, estadísticas animadas, badge live de convocatoria, pricing diferenciado |
| `fn_estados_intermedios_ui` | ✅ CONFORME | `useState` gestiona módulo activo en acordeón; hover states en botones y tarjetas con CSS transitions |
| `fn_deploy_publico_accesible` | ❌ **NO CONFORME** | README no documenta URL pública. `setup-ec2.sh` marcado como pendiente en AGENTS.md. IP en workflow (`3.235.47.30`) difiere de `.env.production` (`100.58.188.68`). No hay evidencia de despliegue activo. |

---

## 2. Calidad de código y arquitectura

### Base (3/4)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `cq_estructura_carpetas_clara` | ✅ CONFORME | Estructura Next.js App Router: `app/`, `public/`, `scripts/`, `docs/` |
| `cq_nombres_descriptivos` | ✅ CONFORME | Constantes descriptivas: `MODULES`, `FEATURES`, `TESTIMONIALS`, `PLANS`; props tipadas |
| `cq_separacion_responsabilidades` | ⚠️ PARCIAL | `app/page.tsx` tiene 1.411 líneas. Datos (constantes) y rendering mezclados en el mismo fichero. No hay componentes separados. |
| `cq_dependencias_lockeadas` | ✅ CONFORME | `package-lock.json` presente y commiteado |

### Notable (3/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `cq_tests_minimos` | ❌ **NO CONFORME** | Sin framework de tests (jest/vitest/playwright). Sin ningún fichero `.test.*` en el proyecto. Sin comando `test` en `package.json`. |
| `cq_linter_configurado` | ✅ CONFORME | `eslint.config.mjs` con `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`; script `lint` en `package.json` |
| `cq_sin_secretos_en_repo` | ✅ CONFORME | `.gitignore` excluye `.env*`; secretos EC2 en GitHub Secrets; no hay credenciales en el código |

### Excepcional (1/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `cq_arquitectura_razonada` | ❌ **NO CONFORME** | Un único fichero `page.tsx` de 1.411 líneas. Sin separación entre capa de datos, lógica y presentación. Sin componentes reutilizables. |
| `cq_cobertura_alta` | ❌ **NO CONFORME** | Sin tests → cobertura 0% |
| `cq_ci_funcional` | ⚠️ PARCIAL | `.github/workflows/deploy.yml` existe y hace build + deploy. Sin embargo: no ejecuta tests, no ejecuta linter, usa Node 20 (se recomienda 24 LTS), IP de despliegue inconsistente con `.env.production` |

---

## 3. Documentación y decisiones

### Base (2/4)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `dc_readme_presente` | ❌ **NO CONFORME** | README es el template por defecto de `create-next-app`. No describe el proyecto (landing page IA), no menciona la URL pública, no tiene capturas de pantalla ni descripción del propósito |
| `dc_env_example` | ✅ CONFORME | `.env.example` presente con placeholders: `AWS_VPS_NAME`, `AWS_SSH_ACCESS`, `AWS_PUBLIC_IP` |
| `dc_comandos_verificacion` | ⚠️ PARCIAL | README tiene `npm run dev` y `npm run build` pero sin comando de tests (no existen) ni URL de verificación |
| `dc_seccion_uso` | ❌ **NO CONFORME** | Sin capturas de pantalla, sin demo GIF, sin descripción del flujo de usuario |

### Notable (0/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `dc_diagrama_arquitectura` | ❌ **NO CONFORME** | Sin diagrama ASCII, mermaid ni draw.io |
| `dc_decisiones_documentadas` | ❌ **NO CONFORME** | Sin sección de trade-offs ni decisiones técnicas en README ni `docs/` |
| `dc_cambios_ia_documentados` | ❌ **NO CONFORME** | El proyecto fue asistido por IA pero no hay documentación de qué se revisó/cambió |

### Excepcional (0/3)

| ID | Estado | Evidencia |
|----|--------|-----------|
| `dc_adrs_o_decision_log` | ❌ **NO CONFORME** | Sin ADRs ni decision log |
| `dc_justificacion_cuantitativa` | ❌ **NO CONFORME** | Sin benchmarks, métricas de coste ni comparativas cuantitativas |
| `dc_instrucciones_deploy` | ❌ **NO CONFORME** | `scripts/setup-ec2.sh` existe pero no está referenciado en README. Sin instrucciones de despliegue documentadas. |

---

## Issues no conformes — Referencia a prompts de corrección

| # | Issue ID | Severidad | Fichero prompt |
|---|----------|-----------|----------------|
| 1 | `dc_readme_presente`, `dc_seccion_uso`, `dc_instrucciones_deploy`, `dc_comandos_verificacion` | 🔴 Alta | `001_readme_project_docs_fn_prompt.md` |
| 2 | `cq_tests_minimos`, `cq_cobertura_alta` | 🔴 Alta | `002_tests_vitest_coverage_fn_prompt.md` |
| 3 | `cq_ci_funcional` (GitHub) | 🟠 Media | `003_cicd_github_actions_fn_prompt.md` |
| 4 | `cq_ci_funcional` (GitLab) | 🟠 Media | `004_cicd_gitlab_pipeline_fn_prompt.md` |
| 5 | `fn_deploy_publico_accesible` | 🔴 Alta | `005_deploy_ec2_public_fn_prompt.md` |
| 6 | `cq_arquitectura_razonada`, `cq_separacion_responsabilidades` | 🟡 Baja | `006_arch_component_refactor_fn_prompt.md` |
| 7 | `dc_diagrama_arquitectura` | 🟡 Baja | `007_docs_arch_diagram_fn_prompt.md` |
| 8 | `dc_decisiones_documentadas`, `dc_adrs_o_decision_log`, `dc_justificacion_cuantitativa`, `dc_cambios_ia_documentados` | 🟡 Baja | `008_docs_decisions_adrs_fn_prompt.md` |
