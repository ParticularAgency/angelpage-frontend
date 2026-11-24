export const ADMIN_PANELS = {
  super: {
    id: 'super',
    label: 'Super Admin',
    description: 'Analytics, users, listing review',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    description: 'Orders, disputes, escrow',
  },
  content: {
    id: 'content',
    label: 'Content',
    description: 'Blog, charity imports, listings',
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    description: 'Revenue, charity payouts',
  },
} as const;

export type AdminPanelId = keyof typeof ADMIN_PANELS;

export const ADMIN_ROLES = {
  SUPER: 'ADMIN',
  OPERATIONS: 'OPS_ADMIN',
  CONTENT: 'CONTENT_ADMIN',
  FINANCE: 'FINANCE_ADMIN',
} as const;

export const ADMIN_PERMISSION_KEYS = [
  'analytics',
  'account',
  'review',
  'product-reviews',
  'promoted',
  'operations',
  'charity-import',
  'blog',
  'events',
  'finance',
  'team',
  'audit',
] as const;

export const ADMIN_PERMISSION_LABELS: Record<string, string> = {
  analytics: 'Analytics',
  account: 'Account',
  review: 'Review listings',
  'product-reviews': 'Product reviews',
  promoted: 'Promoted',
  operations: 'Operations',
  'charity-import': 'Listed charity',
  blog: 'Blog',
  events: 'Events',
  finance: 'Finance',
  team: 'Team management',
  audit: 'Audit log',
};

export const ADMIN_PERMISSION_PRESETS = [
  {
    id: 'OPS_ADMIN',
    label: 'Operations preset',
    permissions: ['operations'],
  },
  {
    id: 'CONTENT_ADMIN',
    label: 'Content preset',
    permissions: [
      'review',
      'product-reviews',
      'promoted',
      'charity-import',
      'affiliate-import',
      'gallery',
      'blog',
      'events',
      'social-posting',
    ],
  },
  {
    id: 'FINANCE_ADMIN',
    label: 'Finance preset',
    permissions: ['finance'],
  },
];

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Super Admin',
  OPS_ADMIN: 'Operations Admin',
  CONTENT_ADMIN: 'Content Admin',
  FINANCE_ADMIN: 'Finance Admin',
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'Full access — analytics, team management, all panels.',
  OPS_ADMIN: 'Orders, disputes, and escrow release.',
  CONTENT_ADMIN: 'Listing review, promoted items, charity import, blog, and events.',
  FINANCE_ADMIN: 'Revenue, payouts, and finance reports.',
};

export const getAdminRoleLabel = (role?: string) =>
  (role && ADMIN_ROLE_LABELS[role]) || role || 'Admin';

export const ALL_ADMIN_ROLES = Object.values(ADMIN_ROLES);

export const isAdminRole = (role?: string) =>
  !!role && ALL_ADMIN_ROLES.includes(role as (typeof ALL_ADMIN_ROLES)[number]);

const ROLE_PANELS: Record<string, AdminPanelId[]> = {
  [ADMIN_ROLES.SUPER]: ['super', 'operations', 'content', 'finance'],
  [ADMIN_ROLES.OPERATIONS]: ['operations'],
  [ADMIN_ROLES.CONTENT]: ['content'],
  [ADMIN_ROLES.FINANCE]: ['finance'],
};

export const getPanelsForRole = (role?: string): AdminPanelId[] => {
  if (!role) return [];
  return ROLE_PANELS[role] || [];
};

export type AdminTab = {
  id: string;
  label: string;
  permission: string;
};

export const ADMIN_TABS: AdminTab[] = [
  { id: 'analytics', label: 'Analytics', permission: 'analytics' },
  { id: 'account', label: 'Account', permission: 'account' },
  { id: 'review', label: 'Review Listings', permission: 'review' },
  { id: 'product-reviews', label: 'Product Reviews', permission: 'product-reviews' },
  { id: 'promoted', label: 'Promoted', permission: 'promoted' },
  { id: 'operations', label: 'Operations', permission: 'operations' },
  { id: 'charity-import', label: 'Listed Charity', permission: 'charity-import' },
  { id: 'affiliate-import', label: 'Affiliate', permission: 'charity-import' },
  { id: 'gallery', label: 'Gallery', permission: 'blog' },
  { id: 'social-posting', label: 'Social posting', permission: 'blog' },
  { id: 'blog', label: 'Blog', permission: 'blog' },
  { id: 'events', label: 'Events', permission: 'events' },
  { id: 'team', label: 'Team', permission: 'team' },
  { id: 'finance', label: 'Finance', permission: 'finance' },
  { id: 'audit', label: 'Audit log', permission: 'audit' },
];

export const getTabsForRole = (
  role?: string,
  permissions?: string[]
): AdminTab[] => {
  if (!role) return [];
  if (role === ADMIN_ROLES.SUPER) return ADMIN_TABS;
  if (permissions?.length) {
    return ADMIN_TABS.filter(tab => permissions.includes(tab.permission));
  }
  const panels = getPanelsForRole(role);
  return ADMIN_TABS.filter(tab => {
    if (tab.permission === 'operations') return panels.includes('operations');
    if (['review', 'product-reviews', 'promoted', 'charity-import', 'affiliate-import', 'gallery', 'blog', 'events', 'social-posting'].includes(tab.permission)) {
      return panels.includes('content');
    }
    if (tab.permission === 'finance') return panels.includes('finance');
    return false;
  });
};
