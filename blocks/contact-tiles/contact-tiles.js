/**
 * Contact Tiles block — "Get all important updates" (Figma node 898:25014).
 *
 * Content model (block table `Contact Tiles`):
 *   Row 1 (header): h2 heading and a subtext paragraph.
 *   Rows 2..n (one per tile): a small label paragraph and a value paragraph
 *     (bold text or a link). Icons are assigned by position.
 *
 * @param {Element} block
 */
const ICONS = [
  // phone
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>',
  // book
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z"/></svg>',
  // location
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  // note/quote
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h16v11l-5 5H4Z"/><path d="M15 20v-5h5"/></svg>',
];

export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('div');
  header.className = 'contact-tiles-header';
  const headerRow = rows.find((row) => row.querySelector('h1, h2, h3'));
  if (headerRow) {
    [...headerRow.firstElementChild.childNodes].forEach((n) => header.append(n));
    headerRow.remove();
  }

  const grid = document.createElement('div');
  grid.className = 'contact-tiles-grid';

  rows.filter((r) => r.isConnected && !r.querySelector('h1, h2, h3')).forEach((row, i) => {
    const cell = row.firstElementChild;
    const paras = [...cell.querySelectorAll('p')];
    const link = cell.querySelector('a');

    const tile = document.createElement(link ? 'a' : 'div');
    tile.className = 'contact-tile';
    if (link) tile.href = link.href;

    const icon = document.createElement('span');
    icon.className = 'contact-tile-icon';
    icon.innerHTML = ICONS[i % ICONS.length];
    tile.append(icon);

    const textWrap = document.createElement('span');
    textWrap.className = 'contact-tile-text';
    if (paras[0]) {
      const label = document.createElement('span');
      label.className = 'contact-tile-label';
      label.textContent = paras[0].textContent.trim();
      textWrap.append(label);
    }
    const valueText = link ? link.textContent : (paras[1] && paras[1].textContent);
    if (valueText) {
      const value = document.createElement('span');
      value.className = 'contact-tile-value';
      value.textContent = valueText.trim();
      textWrap.append(value);
    }
    tile.append(textWrap);
    grid.append(tile);
  });

  const inner = document.createElement('div');
  inner.className = 'contact-tiles-inner';
  inner.append(header, grid);

  block.textContent = '';
  block.append(inner);
}
