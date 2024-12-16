import { NotificationIcon } from '@/icons';
import React from 'react';

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
      className={`alert-btn flex items-center ${notificationBtnClass}`}
      onClick={toggleDropdown}
    >
      <NotificationIcon />
    </button>
  );
};

export default NotificationButton;
