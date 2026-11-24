'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { UserIcon } from '@/icons';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { isAdminRole } from '@/constants/adminPanels';
import {
  getAccountPathForRole,
} from '@/utils/navigationPaths';

interface UserAccountMenuProps {
  className?: string;
  dropdownPlacement?: 'below' | 'above';
  showLabel?: boolean;
  label?: string;
}

const UserAccountMenu = ({
  className = '',
  dropdownPlacement = 'below',
  showLabel = false,
  label = 'Account',
}: UserAccountMenuProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const accountPath = getAccountPathForRole(
    userRole,
    userId,
    (session?.user as { charityId?: string })?.charityId
  );
  const isAdmin = isAdminRole(userRole);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      ToastService.success('Logout successful!');
      setIsOpen(false);
      router.push('/auth/login');
    } catch (error) {
      ToastService.error('Failed to logout. Please try again.');
      console.error('Logout Error:', error);
    }
  };

  const dropdownPositionClass =
    dropdownPlacement === 'above'
      ? 'bottom-full right-0 mb-2'
      : 'top-full right-0 mt-2';

  if (!session?.user?.id) {
    return (
      <Link
        href="/auth/login"
        className={`user-account flex items-center ${showLabel ? 'flex-col gap-[13px]' : ''} ${className}`}
      >
        <div className={showLabel ? 'icons-box' : ''}>
          <UserIcon />
        </div>
        {showLabel && (
          <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
            {label}
          </p>
        )}
      </Link>
    );
  }

  return (
    <div
      className={`user-account-dropdown-area relative ${showLabel ? 'text-center' : ''} ${className}`}
      ref={menuRef}
    >
      <button
        type="button"
        className={`user-account flex items-center cursor-pointer ${showLabel ? 'flex-col gap-[13px] w-full' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <div className={showLabel ? 'icons-box' : ''}>
          <UserIcon />
        </div>
        {showLabel && (
          <p className="link-title font-secondary font-normal text-center text-mono-100 text-body-small xxs:text-[13px] leading-[150%]">
            {label}
          </p>
        )}
      </button>

      {isOpen && (
        <div
          className={`user-account-dropdown absolute z-999 w-[200px] rounded-lg border border-mono-40 bg-white py-2 shadow-lg ${dropdownPositionClass}`}
        >
          <Link
            href={accountPath}
            className="block px-4 py-2 body-small text-mono-100 hover:bg-[#FCF2FF]"
            onClick={() => setIsOpen(false)}
          >
            {isAdmin ? 'Admin dashboard' : 'Account overview'}
          </Link>
          {isAdmin && (
            <Link
              href="/"
              className="block px-4 py-2 body-small text-mono-100 hover:bg-[#FCF2FF]"
              onClick={() => setIsOpen(false)}
            >
              View storefront
            </Link>
          )}
          <button
            type="button"
            className="block w-full text-left px-4 py-2 body-small text-mono-100 hover:bg-[#FCF2FF]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
