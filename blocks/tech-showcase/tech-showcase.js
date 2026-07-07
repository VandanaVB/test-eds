/**
 * Tech Showcase block — "Technology at Maruti Suzuki" (Figma node 898:25008).
 *
 * Content model (block table `Tech Showcase`):
 *   Row 1 (header, no image): an eyebrow paragraph and a large lead paragraph
 *     (bold text renders in full ink, the rest is muted).
 *   Rows 2..n (one per feature): cell 1 = image, cell 2 = h3 title and a
 *     description paragraph. Slides are auto-numbered.
 *
 * @param {Element} block
 */
import initCarousel from '../../scripts/carousel.js';

export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('div');
  header.className = 'tech-showcase-header';
  const headerRow = rows.find((row) => !row.querySelector('picture'));
  if (headerRow) {
    const cell = headerRow.firstElementChild;
    const paras = [...cell.querySelectorAll('p')];
    if (paras.length) {
      paras[0].classList.add('tech-showcase-eyebrow');
      paras.slice(1).forEach((p) => p.classList.add('tech-showcase-lead'));
    }
    [...cell.childNodes].forEach((n) => header.append(n));
    headerRow.remove();
  }

  const track = document.createElement('ul');
  track.className = 'tech-showcase-track';

  rows.filter((row) => row.querySelector('picture')).forEach((row, i) => {
    const picture = row.querySelector('picture');
    const cells = [...row.children];
    const text = cells.find((c) => !c.querySelector('picture'));

    const li = document.createElement('li');
    li.className = 'tech-showcase-slide';
    if (picture) li.append(picture);

    const overlay = document.createElement('div');
    overlay.className = 'tech-showcase-overlay';
    const num = document.createElement('span');
    num.className = 'tech-showcase-num';
    num.textContent = String(i + 1).padStart(2, '0');
    overlay.append(num);
    if (text) [...text.childNodes].forEach((n) => overlay.append(n));
    li.append(overlay);
    track.append(li);
  });

  const controls = document.createElement('div');
  controls.className = 'tech-showcase-controls';
  const arrows = {};
  ['prev', 'next'].forEach((kind) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `tech-showcase-arrow tech-showcase-${kind}`;
    btn.setAttribute('aria-label', kind === 'prev' ? 'Previous' : 'Next');
    btn.innerHTML = `<span aria-hidden="true">${kind === 'prev' ? '‹' : '›'}</span>`;
    arrows[kind] = btn;
    controls.append(btn);
  });

  const carousel = document.createElement('div');
  carousel.className = 'tech-showcase-carousel';
  carousel.append(track, controls);

  block.textContent = '';
  block.append(header, carousel);

  initCarousel(track, { prev: arrows.prev, next: arrows.next, controls });
}
