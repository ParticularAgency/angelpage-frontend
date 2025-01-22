'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationIcon } from '@/icons';
import { fetchNotifications } from '@/store/notificationSlice';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import io from 'socket.io-client';

const NotificationButton = ({ toggleDropdown, notificationBtnClass }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [messagesCount, setMessagesCount] = useState(0);
  // const [loading , setLoading] = useState(false);
  const { status: notificationsStatus, unreadCount } = useSelector(
    state => state.notifications
  );

  const [error, setError] = useState(null);
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

    // setLoading(true);

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

      console.log('Fetched test messages:', response.data);

      if (response.data.success) {
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
      // setLoading(false);
    }
  };
  //  if (status === 'loading') return <p>Loading session...</p>;
  //  if (!session) return <p>Please log in to view your messages.</p>;
  //  if (loading) return <p>Loading messages...</p>;
  const totalNumber = messagesCount + unreadCount;
  return (
    <button
      aria-label="Toggle Notifications Dropdown"
      className={`alert-btn relative flex items-center ${notificationBtnClass}`}
      onClick={toggleDropdown}
    >
      <p>{console.log(error)}</p>
      {notificationsStatus === 'loading' ? (
        <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
          ...
        </span>
      ) : totalNumber > 0 ? (
        <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
          {totalNumber}
        </span>
      ) : null}
      <NotificationIcon />
    </button>
  );
};

export default NotificationButton;
