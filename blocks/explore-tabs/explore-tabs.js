/**
 * Explore Tabs block — "Discover the World of Maruti Suzuki" (Figma 898:25010).
 *
 * Content model (block table `Explore Tabs`):
 *   Row 1 (header, no image): h2 heading and a subtext paragraph.
 *   Rows 2..n (one per panel): cell 1 = image, cell 2 = h3 panel title and a
 *     list of items. Each item is authored as
 *       `**Item title** — optional description [Read more](/link)`
 *     The first item with a description starts expanded.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('div');
  header.className = 'explore-tabs-header';
  const headerRow = rows.find((row) => !row.querySelector('picture'));
  if (headerRow) {
    [...headerRow.firstElementChild.childNodes].forEach((n) => header.append(n));
    headerRow.remove();
  }

  const track = document.createElement('ul');
  track.className = 'explore-tabs-track';

  rows.filter((row) => row.querySelector('picture')).forEach((row) => {
    const picture = row.querySelector('picture');
    const cells = [...row.children];
    const text = cells.find((c) => !c.querySelector('picture'));

    const panel = document.createElement('li');
    panel.className = 'explore-tab';

    const content = document.createElement('div');
    content.className = 'explore-tab-content';
    const title = text ? text.querySelector('h1, h2, h3, h4') : null;
    if (title) { title.className = 'explore-tab-title'; content.append(title); }

    const list = text ? text.querySelector('ul, ol') : null;
    if (list) {
      const acc = document.createElement('div');
      acc.className = 'explore-tab-items';
      [...list.querySelectorAll('li')].forEach((li, i) => {
        const link = li.querySelector('a');
        const strong = li.querySelector('strong');
        // Title from bold text, or text up to an em dash.
        const raw = li.textContent.trim();
        const itemTitle = strong ? strong.textContent.trim() : raw.split(/\s+—\s+/)[0];
        let desc = '';
        if (!strong) desc = raw.split(/\s+—\s+/).slice(1).join(' — ');
        else {
          const after = raw.replace(itemTitle, '').replace(/^\s*—\s*/, '');
          desc = link ? after.replace(link.textContent, '').trim() : after.trim();
        }

        const item = document.createElement('div');
        item.className = 'explore-tab-item';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'explore-tab-item-head';
        btn.innerHTML = `<span class="explore-tab-num">${String(i + 1).padStart(2, '0')}</span>`
          + `<span class="explore-tab-item-title">${itemTitle}</span>`;
        item.append(btn);

        const body = document.createElement('div');
        body.className = 'explore-tab-item-body';
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc;
          body.append(p);
        }
        if (link) { link.className = 'explore-tab-readmore'; body.append(link); }
        item.append(body);

        const open = i === 0 && (desc || link);
        item.classList.toggle('is-open', !!open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');

        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          acc.querySelectorAll('.explore-tab-item').forEach((el) => {
            el.classList.remove('is-open');
            el.querySelector('.explore-tab-item-head').setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
        acc.append(item);
      });
      content.append(acc);
    }

    const media = document.createElement('div');
    media.className = 'explore-tab-media';
    if (picture) media.append(picture);

    panel.append(content, media);
    track.append(panel);
  });

  const controls = document.createElement('div');
  controls.className = 'explore-tabs-controls';
  const scrollByPanel = (dir) => {
    const p = track.querySelector('.explore-tab');
    const step = p ? p.getBoundingClientRect().width + 24 : 400;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  ['prev', 'next'].forEach((kind) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `explore-tabs-arrow explore-tabs-${kind}`;
    btn.setAttribute('aria-label', kind === 'prev' ? 'Previous' : 'Next');
    btn.innerHTML = `<span aria-hidden="true">${kind === 'prev' ? '←' : '→'}</span>`;
    btn.addEventListener('click', () => scrollByPanel(kind === 'prev' ? -1 : 1));
    controls.append(btn);
  });

  const inner = document.createElement('div');
  inner.className = 'explore-tabs-inner';
  const scroller = document.createElement('div');
  scroller.className = 'explore-tabs-scroller';
  scroller.append(track);
  inner.append(header, scroller, controls);

  block.textContent = '';
  block.append(inner);
}
