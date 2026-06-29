# PERT Compliance Plan — 1-5-40-nextjs-gh-aws
**Proyecto:** AIFormación — Landing page programa formación IA  
**Fecha:** 2026-06-29

---

## PERT Compliance Plan

Grafo de dependencias lógicas para corregir todos los issues no conformes detectados en el `compliance-report.md`.

### Nodos del PERT

```
[001_README] ─────────────────────────────────────────────────────────┐
                                                                       │
[002_TESTS] ──────────────────────────────────────────────────────┐   │
                                                                   │   │
[006_ARCH_REFACTOR] ──────────────────────────────────────────┐   │   │
                                                               │   │   │
                                              [003_GITHUB_CICD]◄──┘   │
                                                     │                 │
                                              [005_EC2_DEPLOY]◄────────┘
                                                     │
                                              [004_GITLAB_CICD]
                                                     │
                                              [007_ARCH_DIAGRAM]
                                                     │
                                              [008_DOCS_DECISIONS]
```

### Lista PERT — Camino crítico

| Tarea | ID Issue | Descripción | Dependencias | Prompt |
|-------|----------|-------------|--------------|--------|
| **T1** | `dc_readme_presente`, `dc_seccion_uso`, `dc_instrucciones_deploy` | Reescribir README completo con descripción del proyecto, capturas, comandos y sección de despliegue | Ninguna | [`001_readme_project_docs_fn_prompt.md`](001_readme_project_docs_fn_prompt.md) |
| **T2** | `cq_tests_minimos`, `cq_cobertura_alta` | Configurar Vitest + Testing Library; escribir tests unitarios y de componente; añadir script `test` y `coverage` | Ninguna | [`002_tests_vitest_coverage_fn_prompt.md`](002_tests_vitest_coverage_fn_prompt.md) |
| **T3** | `cq_arquitectura_razonada`, `cq_separacion_responsabilidades` | Extraer componentes reutilizables de `page.tsx`; separar datos en ficheros dedicados | Ninguna | [`006_arch_component_refactor_fn_prompt.md`](006_arch_component_refactor_fn_prompt.md) |
| **T4** | `cq_ci_funcional` (GitHub) | Actualizar GitHub Actions: añadir linter + tests; Node 24; corregir IP deploy; Dockerizar servicio; configurar nginx con dominio `ia.iadevaps.com` | T2, T3 | [`003_cicd_github_actions_fn_prompt.md`](003_cicd_github_actions_fn_prompt.md) |
| **T5** | `fn_deploy_publico_accesible` | Completar despliegue en EC2 (`100.58.188.68`); verificar URL pública `ia.iadevaps.com`; documentar en README | T1, T4 | [`005_deploy_ec2_public_fn_prompt.md`](005_deploy_ec2_public_fn_prompt.md) |
| **T6** | `cq_ci_funcional` (GitLab) | Crear `.gitlab-ci.yml` con stages lint, test, build, deploy | T2, T3 | [`004_cicd_gitlab_pipeline_fn_prompt.md`](004_cicd_gitlab_pipeline_fn_prompt.md) |
| **T7** | `dc_diagrama_arquitectura` | Crear diagrama de arquitectura (mermaid) en `docs/` mostrando componentes y flujo CI/CD→EC2 | T3 | [`007_docs_arch_diagram_fn_prompt.md`](007_docs_arch_diagram_fn_prompt.md) |
| **T8** | `dc_decisiones_documentadas`, `dc_adrs_o_decision_log`, `dc_justificacion_cuantitativa`, `dc_cambios_ia_documentados` | Documentar ADRs, trade-offs técnicos, decisiones IA y métricas cuantitativas | T5, T7 | [`008_docs_decisions_adrs_fn_prompt.md`](008_docs_decisions_adrs_fn_prompt.md) |

---

## Execution PERT

Orden de ejecución según el grafo de dependencias. T1, T2 y T3 pueden ejecutarse en paralelo. T4 y T6 pueden ejecutarse en paralelo una vez T2 y T3 están listos. **Se favorece el camino GitHub (T4 → T5) sobre el GitLab (T6).**

| # | Tarea | Prompt | Issues corregidos | Depende de | Prioridad |
|---|-------|--------|-------------------|------------|-----------|
| 1 | README completo | `001_readme_project_docs_fn_prompt.md` | `dc_readme_presente`, `dc_seccion_uso`, `dc_instrucciones_deploy`, `dc_comandos_verificacion` | — | 🔴 Alta |
| 2 | Tests + cobertura | `002_tests_vitest_coverage_fn_prompt.md` | `cq_tests_minimos`, `cq_cobertura_alta` | — | 🔴 Alta |
| 3 | Refactor arquitectura | `006_arch_component_refactor_fn_prompt.md` | `cq_arquitectura_razonada`, `cq_separacion_responsabilidades` | — | 🟡 Media |
| 4 | GitHub CI/CD | `003_cicd_github_actions_fn_prompt.md` | `cq_ci_funcional` | T2, T3 | 🔴 Alta |
| 5 | Deploy EC2 + URL pública | `005_deploy_ec2_public_fn_prompt.md` | `fn_deploy_publico_accesible` | T1, T4 | 🔴 Alta |
| 6 | GitLab CI/CD | `004_cicd_gitlab_pipeline_fn_prompt.md` | `cq_ci_funcional` (GitLab) | T2, T3 | 🟠 Media |
| 7 | Diagrama arquitectura | `007_docs_arch_diagram_fn_prompt.md` | `dc_diagrama_arquitectura` | T3 | 🟡 Baja |
| 8 | ADRs + decisiones | `008_docs_decisions_adrs_fn_prompt.md` | `dc_decisiones_documentadas`, `dc_adrs_o_decision_log`, `dc_justificacion_cuantitativa`, `dc_cambios_ia_documentados` | T5, T7 | 🟡 Baja |
