'use client';

import React, { useEffect, useState } from 'react';
import { NotificationIcon } from '@/icons';
import { useSession } from 'next-auth/react';
import axios from 'axios';


const NotificationButton = ({
  toggleDropdown,
  notificationBtnClass,
}) => {
  const { data: session, status } = useSession();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setError] = useState(null); 
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

      if (response.data.success) {
        setNotificationsCount(response.data.notifications?.length || 0);
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

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, [session, status]);

  return (
    <button
      aria-label="Toggle Notifications Dropdown"
      className={`alert-btn relative flex items-center ${notificationBtnClass}`}
      onClick={toggleDropdown}
    >
      {loading ? (
        <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-gray-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
          ...
        </span>
      ) : notificationsCount > 0 ? (
        <span className="absolute top-[-8px] w-5 h-5 right-[-8px] bg-red-500 text-white text-[11px] flex items-center justify-center rounded-full p-1">
          {notificationsCount}
        </span>
      ) : null}
      <NotificationIcon />
    </button>
  );
};

export default NotificationButton;
