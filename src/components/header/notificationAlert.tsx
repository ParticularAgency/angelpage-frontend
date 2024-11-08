import React, { useState } from 'react';
import NotificationButton from './NotificationButton';
import NotificationDropdown from './NotificationDropdown';

const NotificationAlert: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="notification-alert-box">
      <NotificationButton toggleDropdown={toggleDropdown} />
      <NotificationDropdown
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
    </div>
  );
};

export default NotificationAlert;
