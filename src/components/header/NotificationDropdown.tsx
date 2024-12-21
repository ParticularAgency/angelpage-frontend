import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '../elements';
import Image from 'next/image';

interface NotificationDropdownProps {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isDropdownOpen,
  toggleDropdown,
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>(
    'messages'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data for messages and notifications
  // const messages = [
    // {
    //   id: 1,
    //   image: '/images/notification/msg-user-img1.jpeg',
    //   text: 'Your item has been successfully listed! Get ready for potential buyers.',
    //   time: '2 hours ago',
    // },
    // {
    //   id: 2,
    //   image: '/images/notification/msg-user-img2.jpeg',
    //   text: 'You received a new offer on your listing. Check it out now!',
    //   time: '1 day ago',
    // },
  // ];

  // const notifications = [
    // {}
    // {
    //   id: 1,
    //   image: '/images/notification/admin-msg.svg',
    //   text: 'Your profile is now verified. Start exploring more features!',
    //   time: '3 hours ago',
    // },
    // {
    //   id: 2,
    //   image: '/images/notification/alart-img1.png',
    //   text: 'A new product has been added in your favorite category!',
    //   time: '2 days ago',
    // },
  // ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      toggleDropdown(); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleTabChange = (tab: 'messages' | 'notifications') => {
    setActiveTab(tab);
  };

  return (
    <div ref={dropdownRef}>
      {isDropdownOpen && (
        <div className="alert-dropdown-screen notification-main-wrapper w-[362px] top-[52px] sm:w-full sm:top-20 absolute right-0 z-[999] bg-mono-0">
          <div className="tabs notification-main-tab-header relative flex gap-0 sm:pt-8">
            <button
              type="button"
              className="dropdown-close-btn absolute p-2 items-center gap-1 top-0 right-2 hidden sm:flex"
              onClick={toggleDropdown}
            >
              <span className="body-small text-mono-100">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M10.791 1.1898L1.20703 10.7738"
                  stroke="#474648"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.794 10.7796L1.20203 1.18561"
                  stroke="#474648"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] px-5 body-small sm:py-3 text-center ${
                activeTab === 'messages'
                  ? 'active text-mono-100'
                  : 'text-mono-70'
              }`}
              onClick={() => handleTabChange('messages')}
            >
              Messages
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] px-5 body-small sm:py-3 text-center ${
                activeTab === 'notifications'
                  ? 'active text-mono-100'
                  : 'text-mono-70'
              }`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'messages' ? (
              // messages.length === 0 ? (
                <>
                  <div className="not-found-screen-design flex flex-col items-center pt-20 pb-24 custom-container">
                    <Image
                      src="/images/notification/notification-icon.svg"
                      width={80}
                      height={80}
                      className="w-[34px] h-10 mb-5"
                      alt="notify icon"
                    />
                    <h5 className="body-bold-small text-mono-100 font-medium font-secondary mb-2 text-center">
                      No massage yet
                    </h5>
                    <p className="body-small text-center font-secondary font-regular text-mono-90 max-w-[227px] w-full mx-auto">
                      This is where you’ll receive your massage
                    </p>
                  </div>
                </>
              // ) 
              // : (
              //   <div className="notification-massage-area">
              //     <ul className="notification-msg-list">
              //       {messages.map(message => (
              //         <li
              //           key={message.id}
              //           className="notification-msg-list-item flex items-start gap-3 px-7 pt-4 pb-4"
              //         >
              //           <Image
              //             src={message.image}
              //             alt="notification massage image"
              //             width={48}
              //             height={48}
              //             className="w-12 h-12 object-cover rounded-full min-w-12 min-h-12"
              //           />
              //           <div className="massage-content relative">
              //             <p className="massage-text font-secondary caption text-mono-100 mb-[6px] text-left">
              //               {message.text}
              //             </p>
              //             <div className="massage-time text-mono-100 eyebrow-small text-left">
              //               {message.time}
              //             </div>
              //           </div>
              //         </li>
              //       ))}
              //     </ul>
              //   </div>
              // )
            )
             :
              // notifications.length === 0 ? (
              <>
                <div className="not-found-screen-design flex flex-col items-center pt-20 pb-24 custom-container">
                  <Image
                    src="/images/notification/notification-icon.svg"
                    width={80}
                    height={80}
                    className="w-[34px] h-10 mb-5"
                    alt="notify icon"
                  />
                  <h5 className="body-bold-small text-mono-100 font-medium font-secondary mb-2 text-center">
                    No notifications yet
                  </h5>
                  <p className="body-small text-center font-secondary font-regular text-mono-90 max-w-[227px] w-full mx-auto">
                    This is where you’ll receive your notifications
                  </p>
                </div>
              </>
            // ) 
            // : (
            //   <div className="notification-alert-area">
            //     <ul className="notification-alert-list">
            //       {notifications.map(notification => (
            //         <li
            //           key={notification.id}
            //           className="notification-alert-list-item flex items-start gap-3 px-7 pt-4 pb-4"
            //         >
            //           <Image
            //             src={notification.image}
            //             alt="notification alert image"
            //             width={48}
            //             height={48}
            //             className="w-12 min-w-12 h-auto object-fill"
            //           />
            //           <div className="alert-content relative">
            //             <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
            //               {notification.text}
            //             </p>
            //             <div className="alert-time text-mono-100 eyebrow-small">
            //               {notification.time}
            //             </div>
            //           </div>
            //         </li>
            //       ))}
            //     </ul>
            //   </div>
            // )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
