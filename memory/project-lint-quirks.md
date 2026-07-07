---
name: project-lint-quirks
description: This project's customized decorateButtons + npm/eslint dependency conflict
metadata:
  type: project
---

Two non-obvious traps in this repo:

1. **`decorateButtons` is customized** (`scripts/scripts.js`): a link is only turned into a `.button` if it is wrapped in `<strong>` (→ `.button.primary`), `<em>` (→ `.button.secondary`), or both (→ `.button.accent`). A plain link in a paragraph stays a plain link. The wrapper class is `.button-wrapper` (NOT `.button-container`). So author CTAs as `**[label](/path)**`.

2. **Dependencies don't install cleanly**: `npm install` fails with ERESOLVE (`eslint@8.57.1` vs `@babel/eslint-parser@8` wanting eslint 9/10). Use `npm install --legacy-peer-deps`. eslint then still needs `@babel/core` (`npm install --no-save --legacy-peer-deps @babel/core@7`) before `lint:js` runs. `lint:css` (stylelint) works after the legacy install.

**How to apply:** enforces kebab-case class names (no BEM `--`; use `.hero-has-content`, not `.hero--has-content`).

Related: [[local-block-testing]]
