import { NotificationIcon } from '@/icons';
import React, { useState } from 'react';

const NotificationAlert = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // Default tab

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleTabChange = (tab: 'messages' | 'notifications') => {
    setActiveTab(tab);
  };

  return (
    <div className="notification-alert-box flex items-center sm:hidden relative">
      <button className="alert-btn" onClick={toggleDropdown}>
        <NotificationIcon />
      </button>
      {isDropdownOpen && (
        <div className="alert-dropdown-screen absolute right-0 z-10 bg-white shadow-lg rounded-md">
          <div className="tabs flex border-b">
            <button
              className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => handleTabChange('messages')}
            >
              Messages
            </button>
            <button
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
            </button>
          </div>
          <div className="tab-content p-4">
            {activeTab === 'messages' ? (
              <div>
                <p>No new messages</p>
                {/* Example message */}
                {/* <p>User: Hello, I need help!</p> */}
              </div>
            ) : (
              <div>
                <p>No new notifications</p>
                {/* Example notification */}
                {/* <p>New charity event coming up!</p> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAlert;
