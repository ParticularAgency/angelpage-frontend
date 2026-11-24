'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { connectSocket } from '@/utils/socketClient';

interface NotificationItem {
  _id: string;
  notificationType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsCentre = () => {
  const { data: session } = useSession() || {};
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const headers = { Authorization: `Bearer ${session?.token}` };

  const load = useCallback(async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${api}/notification/all`, { headers });
      setItems(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      ToastService.error('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [api, session?.token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!session?.user?.id || !session?.token) return;
    const socket = connectSocket(session.user.id, session.token);
    const onLive = (notification: NotificationItem) => {
      if (!notification?._id) return;
      setItems(prev =>
        prev.some(item => item._id === notification._id)
          ? prev
          : [notification, ...prev],
      );
      if (!notification.isRead) setUnreadCount(count => count + 1);
    };
    socket.on('new-notification', onLive);
    return () => {
      socket.off('new-notification', onLive);
    };
  }, [session?.user?.id, session?.token]);

  const markAllRead = async () => {
    try {
      await axios.patch(`${api}/notification/read-all`, {}, { headers });
      ToastService.success('All notifications marked as read.');
      load();
    } catch {
      ToastService.error('Could not mark notifications as read.');
    }
  };

  const removeOne = async (id: string) => {
    try {
      await axios.delete(`${api}/notification/${id}`, { headers });
      setItems(prev => prev.filter(n => n._id !== id));
    } catch {
      ToastService.error('Could not remove notification.');
    }
  };

  if (loading) {
    return <p className="body-small text-mono-70 py-8">Loading notifications…</p>;
  }

  return (
    <div className="notifications-centre space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="body-bold-large text-mono-100">Notifications</h3>
          <p className="caption text-mono-70">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#E6E3E7] bg-white p-10 text-center">
          <p className="body-small text-mono-70">No notifications yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map(n => (
            <li
              key={n._id}
              className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${
                n.isRead ? 'bg-white border-[#E6E3E7]' : 'bg-[#FCF2FF] border-[#611192]/20'
              }`}
            >
              <div>
                <p className="caption text-[#611192] font-semibold uppercase">
                  {n.notificationType?.replace(/_/g, ' ')}
                </p>
                <p className="body-small text-mono-100 mt-1">{n.message}</p>
                <p className="caption text-mono-70 mt-2">
                  {new Date(n.createdAt).toLocaleString('en-GB')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeOne(n._id)}
                className="caption text-mono-70 hover:text-red-600 shrink-0"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsCentre;
