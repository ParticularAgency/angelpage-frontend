export const CHARITY_ROLES = {
  OWNER: 'CHARITY',
  STAFF: 'CHARITY_STAFF',
} as const;

export const CHARITY_PERMISSION_KEYS = [
  'analytics',
  'account',
  'listings',
  'sold',
  'messages',
  'notifications',
  'payouts',
  'community',
  'team',
] as const;

export const CHARITY_PERMISSION_LABELS: Record<string, string> = {
  analytics: 'Analytics',
  account: 'Account settings',
  listings: 'Listings & products',
  sold: 'Sold orders',
  messages: 'Messages',
  notifications: 'Notifications',
  payouts: 'Payouts & banking',
  community: 'Blog & events',
  team: 'Team management',
};

export const CHARITY_PERMISSION_PRESETS = [
  {
    id: 'STAFF',
    label: 'Staff preset',
    permissions: ['listings', 'sold', 'messages', 'notifications', 'community'],
  },
  {
    id: 'MANAGER',
    label: 'Manager preset',
    permissions: ['analytics', 'listings', 'sold', 'messages', 'notifications', 'community'],
  },
];

export type CharityTab = {
  id: string;
  label: string;
  permission: string;
};

export const CHARITY_TABS: CharityTab[] = [
  { id: 'analytics', label: 'Analytics', permission: 'analytics' },
  { id: 'account', label: 'Account', permission: 'account' },
  { id: 'listings', label: 'Listings', permission: 'listings' },
  { id: 'product-sync', label: 'Product sync', permission: 'listings' },
  { id: 'affiliate', label: 'Affiliate', permission: 'listings' },
  { id: 'gallery', label: 'Gallery', permission: 'community' },
  { id: 'social', label: 'Social', permission: 'community' },
  { id: 'sold', label: 'Sold', permission: 'sold' },
  { id: 'messages', label: 'Messages', permission: 'messages' },
  { id: 'notifications', label: 'Notifications', permission: 'notifications' },
  { id: 'payouts', label: 'Payouts', permission: 'payouts' },
  { id: 'community', label: 'Community', permission: 'community' },
  { id: 'team', label: 'Team', permission: 'team' },
];

export const getCharityTabsForSession = (
  role?: string,
  permissions?: string[]
): CharityTab[] => {
  if (!role) return [];
  if (role === CHARITY_ROLES.OWNER) return CHARITY_TABS;
  if (role === CHARITY_ROLES.STAFF && permissions?.length) {
    return CHARITY_TABS.filter(tab => permissions.includes(tab.permission));
  }
  return CHARITY_TABS.filter(tab =>
    ['listings', 'sold', 'messages', 'notifications', 'community'].includes(tab.permission)
  );
};

export const getCharityAccountId = (
  role?: string,
  userId?: string,
  charityId?: string
) => {
  if (role === CHARITY_ROLES.STAFF && charityId) return charityId;
  if (role === CHARITY_ROLES.OWNER && userId) return userId;
  return userId;
};
