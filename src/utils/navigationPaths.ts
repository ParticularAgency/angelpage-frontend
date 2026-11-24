import { isAdminRole } from '@/constants/adminPanels';

/** Logo / home link for the signed-in role */
export const getHomePathForRole = (role?: string) =>
  isAdminRole(role) ? '/admin' : '/';

/** Primary account destination */
export const getAccountPathForRole = (
  role?: string,
  userId?: string,
  charityId?: string
) => {
  if (isAdminRole(role)) return '/admin';
  if (role === 'CHARITY_STAFF' && charityId) {
    return `/charity/account/${charityId}`;
  }
  if (role === 'CHARITY' && userId) return `/charity/account/${userId}`;
  if (userId) return `/user/account/${userId}`;
  return '/auth/login';
};

export const canBrowseStorefront = (role?: string) =>
  !isAdminRole(role) || true;
