/**
 * Vehicle Cards block — "Our Range" (migrated from Figma node 933:25756).
 *
 * Content model (block table `Vehicle Cards`):
 *   Row 1 (header, no image): an eyebrow paragraph, an h2 heading (bold part
 *     is highlighted), and an optional list of brand toggle labels.
 *   Rows 2..n (one per vehicle): cell 1 = image, cell 2 = an optional brand
 *     tag (an emphasised word, e.g. _NEXA_), an h3 name, a description
 *     paragraph and a spec list ("Engine — 1299 cc", …).
 *
 * The brand toggle filters the cards by their brand tag; cards with no tag are
 * always shown.
 *
 * @param {Element} block
 */
import initCarousel from '../../scripts/carousel.js';

export default function decorate(block) {
  const rows = [...block.children];

  // ---- Header row (first row without an image) --------------------------
  const header = document.createElement('div');
  header.className = 'vehicle-cards-header';
  let toggle;
  const headerRow = rows.find((row) => !row.querySelector('picture'));
  if (headerRow) {
    [...headerRow.children].forEach((cell) => {
      const eyebrow = cell.querySelector('p');
      const heading = cell.querySelector('h1, h2, h3');
      const list = cell.querySelector('ul');
      if (heading || (eyebrow && !list)) {
        const intro = document.createElement('div');
        intro.className = 'vehicle-cards-intro';
        if (eyebrow) {
          eyebrow.classList.add('vehicle-cards-eyebrow');
          intro.append(eyebrow);
        }
        if (heading) intro.append(heading);
        header.append(intro);
      }
      if (list) {
        toggle = document.createElement('div');
        toggle.className = 'vehicle-cards-toggle';
        toggle.setAttribute('role', 'tablist');
        toggle.setAttribute('aria-label', 'Filter vehicles by brand');
        [...list.querySelectorAll('li')].forEach((li) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'vehicle-cards-toggle-btn';
          btn.setAttribute('role', 'tab');
          btn.textContent = li.textContent.trim();
          toggle.append(btn);
        });
        header.append(toggle);
      }
    });
    headerRow.remove();
  }

  // ---- Cards ------------------------------------------------------------
  const track = document.createElement('ul');
  track.className = 'vehicle-cards-track';
  const cards = [];

  rows.filter((row) => row.querySelector('picture')).forEach((row) => {
    const cells = [...row.children];
    const picture = row.querySelector('picture');
    const text = cells.find((c) => !c.querySelector('picture')) || cells[1];

    const li = document.createElement('li');
    li.className = 'vehicle-card';

    const media = document.createElement('div');
    media.className = 'vehicle-card-media';
    if (picture) media.append(picture);
    li.append(media);

    const body = document.createElement('div');
    body.className = 'vehicle-card-body';
    if (text) {
      // Brand tag: a leading paragraph whose only content is emphasis.
      const first = text.querySelector('p');
      const em = first && first.querySelector('em');
      if (em && first.textContent.trim() === em.textContent.trim()) {
        li.dataset.brand = em.textContent.trim().toLowerCase();
        const badge = document.createElement('span');
        badge.className = 'vehicle-card-brand';
        badge.textContent = em.textContent.trim();
        body.append(badge);
        first.remove();
      }

      const specList = text.querySelector('ul');
      if (specList) {
        const specs = document.createElement('dl');
        specs.className = 'vehicle-card-specs';
        [...specList.querySelectorAll('li')].forEach((li2) => {
          const [label, value] = li2.textContent.split(/\s*[—|:]\s*/);
          const dt = document.createElement('dt');
          dt.textContent = (label || '').trim();
          const dd = document.createElement('dd');
          dd.textContent = (value || '').trim();
          specs.append(dt, dd);
        });
        specList.replaceWith(specs);
      }
      [...text.childNodes].forEach((n) => body.append(n));
    }
    li.append(body);
    track.append(li);
    cards.push(li);
  });

  // ---- Empty state ------------------------------------------------------
  const empty = document.createElement('p');
  empty.className = 'vehicle-cards-empty';
  empty.hidden = true;

  // ---- Carousel controls (prev / next) ---------------------------------
  const scroller = document.createElement('div');
  scroller.className = 'vehicle-cards-scroller';
  scroller.append(track);

  const controls = document.createElement('div');
  controls.className = 'vehicle-cards-controls';
  const mkArrow = (kind, glyph, label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `vehicle-cards-arrow vehicle-cards-${kind}`;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = `<span aria-hidden="true">${glyph}</span>`;
    return btn;
  };
  const prev = mkArrow('prev', '←', 'Show previous vehicles');
  const next = mkArrow('next', '→', 'Show more vehicles');
  controls.append(prev, next);
  scroller.append(controls);

  block.textContent = '';
  block.append(header, scroller, empty);

  const refresh = initCarousel(track, {
    prev, next, controls,
  });

  // ---- Brand filter -----------------------------------------------------
  if (toggle) {
    const buttons = [...toggle.querySelectorAll('button')];
    const countFor = (brand) => cards.filter((c) => {
      const b = c.dataset.brand;
      return !b || b === brand;
    }).length;

    const select = (btn) => {
      const brand = btn.textContent.trim().toLowerCase();
      buttons.forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      let visible = 0;
      cards.forEach((c) => {
        const b = c.dataset.brand;
        const show = !b || b === brand;
        c.hidden = !show;
        if (show) visible += 1;
      });
      empty.hidden = visible > 0;
      empty.textContent = visible > 0 ? '' : `No ${btn.textContent.trim()} models in this selection yet.`;
      track.scrollTo({ left: 0 });
      refresh();
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => select(btn));
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const target = buttons[(i + dir + buttons.length) % buttons.length];
        target.focus();
        select(target);
      });
    });

    // Activate the first tab that actually has cards, else the first tab.
    const initial = buttons.find((b) => countFor(b.textContent.trim().toLowerCase()) > 0) || buttons[0];
    select(initial);
  }
}
