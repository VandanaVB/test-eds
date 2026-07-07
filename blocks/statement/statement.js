/**
 * Statement block — full-bleed concept banner (Figma node 1001:17635).
 *
 * Content model (block table `Statement`):
 *   Cell content: a background image (first picture), a heading/paragraph of
 *   statement copy, and an optional foreground image (second picture) that is
 *   pinned to the right as a decorative accent.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];
  const [bg, accent] = pictures;

  const copy = document.createElement('div');
  copy.className = 'statement-copy';
  block.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    if (el.querySelector('picture')) return;
    if (!el.textContent.trim()) return;
    copy.append(el);
  });

  block.textContent = '';

  if (bg) {
    const bgWrap = document.createElement('div');
    bgWrap.className = 'statement-bg';
    bgWrap.append(bg);
    block.append(bgWrap);
  }
  if (accent) {
    const accentWrap = document.createElement('div');
    accentWrap.className = 'statement-accent';
    accentWrap.append(accent);
    block.append(accentWrap);
  }
  if (copy.childNodes.length) block.append(copy);
}
