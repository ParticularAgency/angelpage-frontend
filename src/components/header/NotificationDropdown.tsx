import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../elements';
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
                  style={{ stroke: '#474648', strokeOpacity: '1' }}
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.794 10.7796L1.20203 1.18561"
                  stroke="#474648"
                  style={{ stroke: '#474648', strokeOpacity: '1' }}
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] px-5 body-small sm:py-3 text-center  ${activeTab === 'messages' ? 'active text-mono-100' : 'text-mono-70'}`}
              onClick={() => handleTabChange('messages')}
            >
              Messages
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] px-5 body-small sm:py-3 text-center  ${activeTab === 'notifications' ? 'active text-mono-100' : 'text-mono-70'}`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'messages' ? (
              <div className="notification-massage-area">
                <div className="notification-massage-area-content pt-0 px-0">
                  <ul className="notification-msg-list">
                    <li className="notification-msg-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/msg-user-img1.jpeg"
                        alt="notification massage image"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-full min-w-12 min-h-12"
                      />
                      <div className="massage-content relative">
                        <p className="massage-text font-secondary caption text-mono-100 mb-[6px] text-left">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="massage-time text-mono-100 eyebrow-small text-left">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="notification-msg-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/msg-user-img1.jpeg"
                        alt="notification massage image"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-full min-w-12 min-h-12"
                      />
                      <div className="massage-content relative">
                        <p className="massage-text font-secondary caption text-mono-100 mb-[6px] text-left">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="massage-time text-mono-100 eyebrow-small text-left">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="notification-msg-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/msg-user-img1.jpeg"
                        alt="notification massage image"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-full min-w-12 min-h-12"
                      />
                      <div className="massage-content relative">
                        <p className="massage-text font-secondary caption text-mono-100 mb-[6px] text-left">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="massage-time text-mono-100 eyebrow-small text-left">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="notification-msg-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/msg-user-img1.jpeg"
                        alt="notification massage image"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-full min-w-12 min-h-12"
                      />
                      <div className="massage-content relative">
                        <p className="massage-text font-secondary caption text-mono-100 mb-[6px] text-left">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="massage-time text-mono-100 eyebrow-small text-left">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="notification-massage-area-footer w-full flex justify-center py-3 px-5 sm:py-2">
                  <Button
                    variant="accend-link"
                    className="caption text-center !p-0 !h-auto text-[#575757]"
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
            ) : (
              <div className="notification-alert-area">
                <div className="notification-alert-area-content pt-0 px-0">
                  <ul className="notification-alert-list">
                    <li className="notification-alert-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/admin-msg.svg"
                        alt="notification alert image"
                        width={48}
                        height={48}
                        className="w-12 min-w-12 h-auto object-fill"
                      />
                      <div className="alert-content relative">
                        <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="alert-time text-mono-100 eyebrow-small">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="notification-alert-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/alart-img1.png"
                        alt="notification alert image"
                        width={48}
                        height={48}
                        className="w-12 min-w-12 h-auto object-fill"
                      />
                      <div className="alert-content relative">
                        <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="alert-time text-mono-100 eyebrow-small">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                    <li className="notification-alert-list-item flex items-start gap-3 px-7 pt-4 pb-4">
                      <Image
                        src="/images/notification/alart-img2.png"
                        alt="notification alert image"
                        width={48}
                        height={48}
                        className="w-12 min-w-12 h-auto object-fill"
                      />
                      <div className="alert-content relative">
                        <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                          Your item has been successfully listed! Get ready for
                          potential buyers to check it out. Keep an eye on your
                          notifications for offers or questions!
                        </p>
                        <div className="alert-time text-mono-100 eyebrow-small">
                          42 min ago
                        </div>
                        <button
                          type="button"
                          className="absolute p-1 top-0 -right-4"
                        >
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
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10.794 10.7796L1.20203 1.18561"
                              stroke="#474648"
                              style={{ stroke: '#474648', strokeOpacity: '1' }}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="notification-alert-area-footer w-full flex justify-center py-3 px-5 sm:py-2">
                  <Button
                    variant="accend-link"
                    className="caption text-center !p-0 !h-auto text-[#575757]"
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
