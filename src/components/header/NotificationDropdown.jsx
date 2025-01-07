import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '../elements';
import { ToastService } from '../elements/notifications/ToastService';

// interface NotificationDropdownProps {
//   isDropdownOpen: boolean;
//   toggleDropdown: () => void;
// }

const NotificationDropdown = ({
  isDropdownOpen,
  toggleDropdown,
}) => {
  const [activeTab, setActiveTab] = useState('messages');
  const { data: session, status } = useSession() || '';
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState([]);
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
    const [ setError] = useState(null);
  const dropdownRef = useRef(null);
useEffect(() => {
  if (session?.user?.id) {
    console.log('Fetching messages for user ID:', session.user.id);
    fetchUnreadMessages(session.user.id);
  }
}, [session]);

const fetchUnreadMessages = async (userId) => {
  if (!userId) {
    console.error('User ID is missing. Cannot fetch unread messages.');
    setError('User ID is missing.');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    console.log('Fetching unread messages for user ID:', userId);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/message/messages/recipient/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    console.log('Fetched messages:', response.data);

    if (response.data.success) {
      setMessages(response.data.messages || []);
      setMessagesCount(response.data.messages.length || []);
    } else {
      setMessages([]);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);

    if (error.response?.status === 404) {
      setMessages([]);
      setError('No messages found for this user.');
    } else {
      setError('Failed to load messages.');
    }
  } finally {
    setLoading(false);
  }
};


  const fetchNotifications = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setError('User is not authenticated.');
      return;
    }
    try {
    setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/alert`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log(response?.data?.notifications);
      setNotificationsCount(response?.data?.notifications?.length);
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      } else {
        setError(response.data.error || 'Failed to fetch notifications.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAllNotificationAsRead = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setError('User is not authenticated.');
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      setNotifications(
        prevNotifications =>
          prevNotifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
        ToastService.success(response?.data?.notifications?.message)
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error.message);
    }
  };

  const handleRemoveNotification = async notificationId => {
    if (status !== 'authenticated' || !session?.user) {
      setError('User is not authenticated.');
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      // Update the state to remove the notification locally
      setNotifications(prevNotifications =>
        prevNotifications.filter(
          notification => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error('Failed to remove notification:', error.message);
    }
  };
  useEffect(() => {
    if (isDropdownOpen) {
      fetchNotifications();
    }
  }, [isDropdownOpen, session, status]);

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown();
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

  const handleTabChange = tab => {
    setActiveTab(tab);
  };
//  if (status === 'loading') return <p>Loading session...</p>;
//  if (error) return <p>{error}</p>;
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
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] flex justify-center items-center gap-2 px-5 relative body-small sm:py-3 text-center ${
                activeTab === 'messages'
                  ? 'active text-mono-100'
                  : 'text-mono-70'
              }`}
              onClick={() => handleTabChange('messages')}
            >
              Messages
              {loading ? (
                <span class="relative left-auto w-5 h-5 bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  ...
                </span>
              ) : messagesCount > 0 ? (
                <span class="relative left-auto w-5 h-5 bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  {messagesCount}
                </span>
              ) : null}
            </button>
            <button
              className={`tab-button w-1/2 py-[18px] flex justify-center items-center gap-2 px-5 relative body-small sm:py-3 text-center ${
                activeTab === 'notifications'
                  ? 'active text-mono-100'
                  : 'text-mono-70'
              }`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
              {loading ? (
                <span class="relative left-auto w-5 h-5 bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  ...
                </span>
              ) : notificationsCount > 0 ? (
                <span class="relative left-auto w-5 h-5 bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  {notificationsCount}
                </span>
              ) : null}
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'messages' ? (
              messages.length === 0 ? (
                <div className="not-found-screen-design flex flex-col items-center pt-20 pb-24 custom-container">
                  <Image
                    src="/images/notification/notification-icon.svg"
                    width={80}
                    height={80}
                    className="w-[34px] h-10 mb-5"
                    alt="notify icon"
                  />
                  <h5 className="body-bold-small text-mono-100 font-medium font-secondary mb-2 text-center">
                    No messages yet
                  </h5>
                  <p className="body-small text-center font-secondary font-regular text-mono-90 max-w-[227px] w-full mx-auto">
                    This is where you’ll receive your messages
                  </p>
                </div>
              ) : (
                <div className="notification-alert-area">
                  <div className="notification-alert-area-content pt-0 px-0">
                    <ul className="notification-alert-list">
                      {messages.map(message => (
                        <li
                          key={message._id}
                          className="notification-alert-list-item flex items-center justify-between gap-3 px-7 pt-4 pb-4"
                        >
                        
                          <div className="alert-content relative">
                            <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                              {message.content}
                            </p>
                            <div className="alert-time text-mono-100 eyebrow-small">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="accend-link"
                            className="link-btn-msg-area text-[10px] !p-0 !underline !text-primary-color-100"
                            onClick={() =>
                              router.push(
                                `/messaging/chat/${message.conversationId}`
                              )
                            }
                          >
                            View
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </div>
                
              )
            ) : notifications.length === 0 ? (
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
            ) : (
              <div className="notification-alert-area">
                <div className="notification-alert-area-content pt-0 px-0">
                  <ul className="notification-alert-list">
                    {notifications.map(notification => (
                      <li
                        key={notification?._id}
                        className={`notification-alert-list-item flex items-start gap-3 px-7 pt-4 pb-4 ${
                          !notification?.isRead ? 'bg-[#F1F1F7]' : ''
                        }`}
                      >
                        <Image
                          src={
                            notification?.metadata?.productImage?.url ||
                            notification?.metadata?.profileImage
                          }
                          alt={
                            notification?.metadata?.productImage?.altText ||
                            notification?.metadata?.charityName
                          }
                          width={48}
                          height={48}
                          className="w-12 min-w-12 h-auto object-fill"
                        />
                        <div className="alert-content relative">
                          <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                            {notification?.message}
                          </p>
                          <div className="alert-time text-mono-100 eyebrow-small">
                            {new Date(notification?.createdAt).toLocaleString()}
                          </div>

                          <button
                            type="button"
                            className="absolute p-1 top-0 -right-4"
                            onClick={() =>
                              handleRemoveNotification(notification._id)
                            }
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
                                style={{
                                  stroke: '#474648',
                                  strokeOpacity: '1',
                                }}
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.794 10.7796L1.20203 1.18561"
                                stroke="#474648"
                                style={{
                                  stroke: '#474648',
                                  strokeOpacity: '1',
                                }}
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="notification-alert-area-footer w-full flex justify-center py-3 px-5 sm:py-2">
                  <Button
                    variant="accend-link"
                    className="caption text-center !p-0 !h-auto text-[#575757]"
                    onClick={markAllNotificationAsRead}
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
