/**
 * Hero block — migrated from Figma "Hero" (node I493:47253;86:1719).
 *
 * Content model (authored as a `Hero` block table):
 *   Row 1, cell 1: a background image, optionally followed by a heading,
 *   body copy and/or a link/button that will be overlaid on the image.
 *
 * The block is content-driven: the first <picture> becomes the full-bleed
 * background, and any heading / paragraph / list becomes overlaid foreground
 * content, regardless of how the authoring tool nests it.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');

  // Gather any non-image content to overlay, preserving document order.
  const content = document.createElement('div');
  content.className = 'hero-content';

  block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol').forEach((el) => {
    // Skip the wrapper that only holds the background picture.
    if (el.querySelector('picture')) return;
    // Skip empty paragraphs with no text and no link.
    if (!el.textContent.trim() && !el.querySelector('a')) return;
    content.append(el);
  });

  block.textContent = '';

  if (picture) {
    block.append(picture);
  }

  if (content.childNodes.length) {
    block.classList.add('hero-has-content');
    block.append(content);
  }

  // Optional scroll cue (variant "scroll-cue"). Text is authorable via the
  // block class label, falling back to a sensible default.
  if (block.classList.contains('scroll-cue')) {
    const cue = document.createElement('span');
    cue.className = 'hero-scroll-cue';
    cue.textContent = block.dataset.cue || 'Scroll Down to Explore Maruti';
    block.append(cue);
  }
}
