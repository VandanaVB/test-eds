---
name: local-block-testing
description: How to visually test an EDS block locally in this project (aem up quirks)
metadata:
  type: project
---

`aem up --html-folder drafts` serves files in `drafts/` **without injecting the EDS runtime** — a bare fragment gets wrapped in empty `<html><body>` and no `scripts.js`/`styles.css` run, so no section/block decoration happens.

**How to apply:** To exercise a block locally, make the draft a *full* HTML document that loads the runtime itself:
```html
<script nonce="aem" src="/scripts/aem.js" type="module"></script>
<script nonce="aem" src="/scripts/scripts.js" type="module"></script>
<link rel="stylesheet" href="/styles/styles.css">
```
with `<header></header><main><div><div class="blockname">…</div></div></main><footer></footer>`. `scripts.js` auto-runs `loadPage()`, giving real `.section`/`.blockname-wrapper`/`.blockname-container` decoration.

Render headless: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --dump-dom` (to inspect decorated DOM) or `--screenshot=... --window-size=W,H` (to view). No playwright/puppeteer installed.

Related: [[project-lint-quirks]]
