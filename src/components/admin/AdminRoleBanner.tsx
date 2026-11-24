'use client';

import React from 'react';
import {
  ADMIN_ROLE_DESCRIPTIONS,
  getAdminRoleLabel,
  getTabsForRole,
  isAdminRole,
} from '@/constants/adminPanels';

const AdminRoleBanner = ({
  role,
  permissions,
}: {
  role?: string;
  permissions?: string[];
}) => {
  if (!isAdminRole(role)) return null;

  const tabs = getTabsForRole(role, permissions);
  const description = role ? ADMIN_ROLE_DESCRIPTIONS[role] : '';

  return (
    <div className="mb-6 rounded-xl border border-primary-color-100/30 bg-[#FCF2FF] px-5 py-4">
      <p className="body-bold-small text-mono-100">
        {getAdminRoleLabel(role)} dashboard
      </p>
      <p className="body-caption text-mono-70 mt-1">{description}</p>
      <p className="caption text-mono-70 mt-2">
        {tabs.length} panel{tabs.length === 1 ? '' : 's'}:{' '}
        {tabs.map(t => t.label).join(' · ')}
      </p>
    </div>
  );
};

export default AdminRoleBanner;
