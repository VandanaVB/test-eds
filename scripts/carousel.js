/**
 * Shared scroll-snap carousel controller.
 *
 * Wires previous/next buttons to a horizontally-scrolling track, keeps their
 * disabled state in sync with the scroll position, hides the controls when the
 * track doesn't overflow, and reports scroll progress (0–1) for progress bars.
 *
 * @param {HTMLElement} track  The scroll container holding the slides.
 * @param {object}   [opts]
 * @param {HTMLButtonElement} [opts.prev]     Previous button.
 * @param {HTMLButtonElement} [opts.next]     Next button.
 * @param {HTMLElement}       [opts.controls] Wrapper hidden when nothing scrolls.
 * @param {(progress:number)=>void} [opts.onChange] Called with progress 0–1.
 * @returns {() => void} An `update()` function to re-sync after layout changes.
 */
export default function initCarousel(track, opts = {}) {
  const {
    prev, next, controls, onChange,
  } = opts;

  const step = () => {
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    return first ? first.getBoundingClientRect().width + gap : track.clientWidth;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= max - 1;
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
    if (controls) controls.hidden = max <= 1;
    if (onChange) onChange(max > 0 ? track.scrollLeft / max : 1);
  };

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Re-sync once images have loaded and changed the scroll width.
  window.addEventListener('load', update);
  requestAnimationFrame(update);

  return update;
}
