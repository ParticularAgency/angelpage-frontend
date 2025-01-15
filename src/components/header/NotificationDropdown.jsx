
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  removeNotification,
} from '@/store/notificationSlice';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '../elements';
import { ToastService } from '../elements/notifications/ToastService';
import Link from 'next/link';
import io from 'socket.io-client';


const NotificationDropdown = ({ isDropdownOpen, toggleDropdown }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const dispatch = useDispatch();
  const { data: session, status } = useSession() || '';
  const {
    notifications,
    unreadCount,
    status: notificationsStatus,
    // error,
  } = useSelector(state => state.notifications);
  const router = useRouter();
  // const [notifications, setNotifications] = useState([]);
  // const [notificationsCount, setNotificationsCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (session?.user?.id) {
      console.log('Fetching messages for user ID:', session.user.id);
      fetchUnreadMessages(session.user.id);
    }
  }, [session]);

  const fetchUnreadMessages = async userId => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/message/unread-messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      console.log('Fetched unread messages:', response.data.messages);

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

  // Initialize Socket.IO client and listen for new notifications
  useEffect(() => {
    if (status === 'authenticated' && session?.token) {
      // Fetch notifications on initial load
      dispatch(fetchNotifications(session.token));
    }

    // Establish Socket.IO connection
    const socket = io('http://localhost:5000'); // Connect to Socket.IO server

    // Listen for 'new-notification' event and trigger fetch
    socket.on('new-notification', () => {
      if (session?.token) {
        dispatch(fetchNotifications(session.token)); // Fetch the latest notifications immediately
      }
    });

    // Cleanup socket on component unmount
    return () => {
      socket.disconnect(); // Cleanup when the component unmounts
    };
  }, [dispatch, session, status]);

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    if (session?.token) {
      dispatch(markAllNotificationsAsRead(session.token));
      ToastService.success('All notifications marked as read');
    }
  };

  const handleRemoveNotification = notificationId => {
    if (session?.token) {
      dispatch(removeNotification({ notificationId, token: session.token }));
    }
  };

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
              {notificationsStatus === 'loading' ? (
                <span class="relative left-auto w-5 h-5 bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  ...
                </span>
              ) : unreadCount > 0 ? (
                <span class="relative left-auto w-5 h-5 bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'messages' ? (
              error || messages.length === 0 ? (
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
                      {messages.map(message => {
                        return message.recipient?._id === session?.user?.id ? (
                          <li
                            key={message._id}
                            className="notification-alert-list-item flex items-center justify-between gap-3 px-7 pt-4 pb-4"
                          >
                            <div className="alert-content relative">
                              <p className="alert-text font-secondary caption text-mono-100 mb-[6px]">
                                {message?.content}
                              </p>
                              <div className="alert-time text-mono-100 eyebrow-small">
                                {new Date(message?.createdAt).toLocaleString()}
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
                        ) : null;
                      })}
                    </ul>
                  </div>
                  <div className="notification-alert-area-footer w-full flex justify-center py-3 px-5 sm:py-2">
                    <Link href="/messaging/chat">
                      <Button
                        variant="accend-link"
                        className="caption text-center !p-0 !h-auto text-[#575757]"
                        // onClick={markAllNotificationAsRead}
                      >
                        View all Message
                      </Button>
                    </Link>
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
                    onClick={handleMarkAllNotificationsAsRead}
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
