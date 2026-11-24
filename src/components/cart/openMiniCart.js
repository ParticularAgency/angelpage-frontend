export function openMiniCart() {
  if (typeof document === 'undefined') return;
  const input = document.getElementById('my-drawer-4');
  if (input instanceof HTMLInputElement) {
    input.checked = true;
  }
}
