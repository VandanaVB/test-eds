/**
 * Vehicle Cards block — "Our Range" (migrated from Figma node 933:25756).
 *
 * Content model (block table `Vehicle Cards`):
 *   Row 1 (header, no image): an eyebrow paragraph, an h2 heading (bold part
 *     is highlighted), and an optional list of brand toggle labels.
 *   Rows 2..n (one per vehicle): cell 1 = image, cell 2 = h3 name, a
 *     description paragraph and a spec list ("Engine — 1299 cc", …).
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // ---- Header row (first row without an image) --------------------------
  const header = document.createElement('div');
  header.className = 'vehicle-cards-header';
  const headerRow = rows.find((row) => !row.querySelector('picture'));
  if (headerRow) {
    [...headerRow.children].forEach((cell) => {
      const eyebrow = cell.querySelector('p');
      const heading = cell.querySelector('h1, h2, h3');
      const toggle = cell.querySelector('ul');
      if (heading || (eyebrow && !toggle)) {
        const intro = document.createElement('div');
        intro.className = 'vehicle-cards-intro';
        if (eyebrow) {
          eyebrow.classList.add('vehicle-cards-eyebrow');
          intro.append(eyebrow);
        }
        if (heading) intro.append(heading);
        header.append(intro);
      }
      if (toggle) {
        const seg = document.createElement('div');
        seg.className = 'vehicle-cards-toggle';
        seg.setAttribute('role', 'tablist');
        [...toggle.querySelectorAll('li')].forEach((li, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'vehicle-cards-toggle-btn';
          btn.textContent = li.textContent.trim();
          btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
          btn.addEventListener('click', () => {
            seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
            btn.setAttribute('aria-selected', 'true');
          });
          seg.append(btn);
        });
        header.append(seg);
      }
    });
    headerRow.remove();
  }

  // ---- Cards ------------------------------------------------------------
  const track = document.createElement('ul');
  track.className = 'vehicle-cards-track';

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
  });

  // ---- Carousel next control -------------------------------------------
  const scroller = document.createElement('div');
  scroller.className = 'vehicle-cards-scroller';
  scroller.append(track);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'vehicle-cards-next';
  next.setAttribute('aria-label', 'Show more vehicles');
  next.innerHTML = '<span aria-hidden="true">→</span>';
  next.addEventListener('click', () => {
    const card = track.querySelector('.vehicle-card');
    const step = card ? card.getBoundingClientRect().width + 32 : 320;
    track.scrollBy({ left: step, behavior: 'smooth' });
  });

  block.textContent = '';
  block.append(header, scroller, next);
}
