import React, { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

const NotificationAlert = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Notifications</button>
      <NotificationDropdown
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
    </div>
  );
};

export default NotificationAlert;
