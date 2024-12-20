'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/elements';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional variant for styling
  onLogout?: () => void; // Optional callback function
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'primary',
  onLogout,
}) => {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      ToastService.success('Logout successful!');

      // Call optional callback function after successful logout, if provided
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      ToastService.error('Failed to logout. Please try again.');
      console.error('Logout Error:', error);
    }
  };

  return (
    <>
      <Button variant={variant} className='mt-0' onClick={handleLogout}>
        Logout
      </Button>
   
    </>
  );
};

export default LogoutButton;
