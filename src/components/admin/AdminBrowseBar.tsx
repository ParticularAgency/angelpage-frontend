'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isAdminRole } from '@/constants/adminPanels';

const AdminBrowseBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  if (!isAdminRole(role)) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="bg-primary-color-100 text-mono-0 py-2 px-4 text-center body-caption z-9998 relative">
      <span>Admin mode — </span>
      <Link href="/admin" className="underline font-medium">
        Back to dashboard
      </Link>
      <span className="mx-2">·</span>
      <Link href="/" className="underline opacity-90">
        View storefront
      </Link>
    </div>
  );
};

export default AdminBrowseBar;
