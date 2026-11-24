/** Guest checkout token helpers (stored client-side for payment + confirmation) */
export function storeGuestOrderToken(orderId, token) {
  if (!orderId || !token || typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`guest-order-token-${orderId}`, token);
  } catch {
    /* ignore */
  }
}

export function getGuestOrderToken(orderId) {
  if (!orderId || typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem(`guest-order-token-${orderId}`) || '';
  } catch {
    return '';
  }
}

export function guestOrderAuthHeaders(token) {
  if (!token) return {};
  return { 'X-Guest-Order-Token': token };
}
