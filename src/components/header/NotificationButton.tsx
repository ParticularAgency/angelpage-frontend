'use client';

import React from 'react';
import { NotificationIcon } from '@/icons';

interface NotificationButtonProps {
  toggleDropdown: () => void;
  notificationBtnClass?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  toggleDropdown,
  notificationBtnClass,
}) => {
  return (
    <button
      aria-label="Toggle Notifications Dropdown"
      className={`alert-btn flex items-center ${notificationBtnClass}`}
      onClick={toggleDropdown}
    >
      <NotificationIcon />
    </button>
  );
};

export default NotificationButton;
