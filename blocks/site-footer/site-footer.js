/**
 * Site Footer block — page footer (Figma nodes 898:25013 / 898:25014).
 *
 * Content model (block table `Site Footer`):
 *   Row 1: link columns — one cell per column, each an h4 heading + a list.
 *   Row 2: connect band — cell 1 = h2 headline + a Subscribe button; the
 *     remaining cells are brand cards (image + h3 title + subtitle).
 *   Row 3: legal disclaimers — small paragraphs, one per cell.
 *   Row 4: bottom bar — company name + a list of policy links.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const last = rows.length - 1;

  rows.forEach((row, i) => {
    if (row.querySelector('h1, h2')) {
      row.classList.add('site-footer-connect');
      const cells = [...row.children];
      cells.forEach((cell) => {
        if (cell.querySelector('h1, h2')) {
          cell.classList.add('site-footer-connect-intro');
          const btn = cell.querySelector('a');
          if (btn) btn.classList.add('button', 'primary');
        } else if (cell.querySelector('picture')) {
          cell.classList.add('site-footer-brand-card');
          const picture = cell.querySelector('picture');
          const caption = document.createElement('div');
          caption.className = 'site-footer-brand-caption';
          cell.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
            if (el.querySelector('picture') || !el.textContent.trim()) return;
            caption.append(el);
          });
          cell.replaceChildren(picture, caption);
        }
      });
    } else if (row.querySelectorAll('ul').length >= 3) {
      row.classList.add('site-footer-links');
    } else if (i === last) {
      row.classList.add('site-footer-bottom');
    } else {
      row.classList.add('site-footer-legal');
    }
  });
}
