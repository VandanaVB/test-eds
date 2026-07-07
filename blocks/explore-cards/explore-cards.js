/**
 * Explore Cards block — "Keep Exploring" (Figma node 898:25012).
 *
 * Content model (block table `Explore Cards`):
 *   Row 1 (header, no image): h2 heading and a subtext paragraph.
 *   Rows 2..n (one per card): cell 1 = image, cell 2 = h3 title, a description
 *     paragraph and an optional link (rendered as a corner arrow button).
 *
 * @param {Element} block
 */
import initCarousel from '../../scripts/carousel.js';

export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('div');
  header.className = 'explore-cards-header';
  const headerRow = rows.find((row) => !row.querySelector('picture'));
  if (headerRow) {
    [...headerRow.firstElementChild.childNodes].forEach((n) => header.append(n));
    headerRow.remove();
  }

  const track = document.createElement('ul');
  track.className = 'explore-cards-track';

  rows.filter((row) => row.querySelector('picture')).forEach((row) => {
    const picture = row.querySelector('picture');
    const cells = [...row.children];
    const text = cells.find((c) => !c.querySelector('picture'));
    const link = text ? text.querySelector('a') : null;

    const li = document.createElement('li');
    li.className = 'explore-card';
    if (picture) li.append(picture);

    const overlay = document.createElement('div');
    overlay.className = 'explore-card-overlay';
    if (text) {
      text.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
        if (el.querySelector('a')) return;
        overlay.append(el);
      });
    }
    li.append(overlay);

    if (link) {
      const arrow = document.createElement('a');
      arrow.className = 'explore-card-arrow';
      arrow.href = link.href;
      arrow.setAttribute('aria-label', link.textContent.trim() || 'Explore');
      arrow.innerHTML = '<span aria-hidden="true">↗</span>';
      li.append(arrow);
      // make the whole card clickable
      li.classList.add('is-linked');
      li.addEventListener('click', () => { window.location.href = link.href; });
    }
    track.append(li);
  });

  const scroller = document.createElement('div');
  scroller.className = 'explore-cards-scroller';
  scroller.append(track);

  // Footer: progress bar + prev/next controls.
  const progress = document.createElement('div');
  progress.className = 'explore-cards-progress';
  const bar = document.createElement('span');
  progress.append(bar);

  const controls = document.createElement('div');
  controls.className = 'explore-cards-controls';
  const arrows = {};
  ['prev', 'next'].forEach((kind) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `explore-cards-arrow explore-cards-${kind}`;
    btn.setAttribute('aria-label', kind === 'prev' ? 'Previous' : 'Next');
    btn.innerHTML = `<span aria-hidden="true">${kind === 'prev' ? '←' : '→'}</span>`;
    arrows[kind] = btn;
    controls.append(btn);
  });

  const footer = document.createElement('div');
  footer.className = 'explore-cards-footer';
  footer.append(progress, controls);

  block.textContent = '';
  block.append(header, scroller, footer);

  initCarousel(track, {
    prev: arrows.prev,
    next: arrows.next,
    controls,
    onChange: (p) => { bar.style.width = `${Math.max(18, p * 100)}%`; },
  });
}
