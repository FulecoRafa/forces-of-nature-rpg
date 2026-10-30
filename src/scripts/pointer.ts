/** Posição do ponteiro na viewport, compartilhada por todas as animações (um listener só). */
export const pointer: { x: number; y: number; active: boolean } = { x: 0, y: 0, active: false };

let installed = false;
export function trackPointer() {
  if (installed) return;
  installed = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => (pointer.active = false));
}
