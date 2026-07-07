---
name: block-cell-picture-fill
description: Full-bleed cover images inside a block cell must be normalized in JS, not just CSS
metadata:
  type: project
---

When a single block-table cell contains a `<picture>` followed by a heading/text
(e.g. an image-card with an overlaid title), EDS/the HTML parser leaves the
`<picture>` wrapped in a stray `<p>`. An absolutely-positioned picture inside
that `<p>` does **not** stretch to fill the card — `position: absolute` applies
but `inset`/`width`/`height` are ignored, so the image renders at its intrinsic
size (verified via `getComputedStyle`: picture width == img width == tiny).

**How to apply:** don't rely on CSS alone to make a cell image cover. In the
block's `decorate()`, pull the `<picture>` out as a **direct child** of the card
(`cell.replaceChildren(picture, caption)`), then `picture { position:absolute; inset:0 }`
+ `img { width:100%; height:100%; object-fit:cover }` fills correctly. Hit while
building `site-footer` brand cards (MSIL Figma migration).

Related: [[local-block-testing]]
