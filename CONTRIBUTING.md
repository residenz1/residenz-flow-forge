# Contribuir al proyecto Residenz

Gracias por querer contribuir. Este documento resume las buenas prácticas recomendadas (basadas en `doc/agentetool.md`) y pasos rápidos para aportar.

- Lee `doc/agentetool.md` para prompts y checklist reutilizables con agentes y revisiones.

1) Flujo de trabajo
- Crea un branch descriptivo: `feat/<scope>-short-description` o `fix/<scope>-short-description`.
- Haz commits pequeños y atómicos. Sigue Conventional Commits (tipo: scope: mensaje).

2) Mensajes de commit
- Formato recomendado: `feat(payments): add mercado pago QR support`
- Incluye en el body el "por qué" si no es obvio.

3) Pull Requests
- Abre PR desde tu branch a `main` o `develop` según corresponda.
- Usa la plantilla de PR (.github/PULL_REQUEST_TEMPLATE.md) y completa la checklist.

4) Code review
- Revisa el `CODE_REVIEW_CHECKLIST.md` para cobertura mínima en revisiones.
- Aplica `early returns`, nombres descriptivos y principios SOLID.

5) Tests
- Añade tests unitarios con Jest en `backend/test` o `src` según convención.
- Objetivo de cobertura: core 100%, resto crítico >=80%.
- Para pruebas e2e usa `npm run test:e2e` desde `backend`.

6) Formato y lint
- Usa `npm run lint` y `npm run format` en `backend` antes de abrir PR.

7) Work-in-progress & drafts
- Puedes abrir PR como draft si quieres revisiones tempranas.

8) Uso de prompts de `doc/agentetool.md`
- Copia los prompts relevantes (Code Review, Testing, Security, etc.) y adáptalos al contexto del repo.

Si quieres que configure hooks automáticos (husky/commitlint) o CI básico (GitHub Actions) lo puedo agregar también.
