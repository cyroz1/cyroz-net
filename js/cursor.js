/* Cursor glow effect — only on devices with a fine pointer and motion enabled. */
(() => {
  const cursor = document.getElementById('glowCursor');
  const canAnimate = window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!cursor || !canAnimate) {
    if (cursor) cursor.hidden = true;
    return;
  }

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;
  let frameId = 0;

  const animate = () => {
    const dx = tx - cx;
    const dy = ty - cy;
    const isSettled = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1;

    if (isSettled) {
      cx = tx;
      cy = ty;
    } else {
      cx += dx * 0.08;
      cy += dy * 0.08;
    }

    cursor.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;

    if (isSettled) {
      frameId = 0;
      return;
    }

    frameId = requestAnimationFrame(animate);
  };

  document.addEventListener('pointermove', (event) => {
    tx = event.clientX;
    ty = event.clientY;
    if (!frameId) frameId = requestAnimationFrame(animate);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else if (!document.hidden && !frameId && (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1)) {
      frameId = requestAnimationFrame(animate);
    }
  });
})();
