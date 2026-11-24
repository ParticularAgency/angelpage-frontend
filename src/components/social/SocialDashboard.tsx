'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

type SocialLog = {
  _id: string;
  platform: string;
  status: string;
  trigger: string;
  error?: string;
  createdAt: string;
  productId?: { name?: string };
};

type ScheduledPost = {
  _id: string;
  scheduledFor: string;
  status: string;
  platforms: string[];
  productId?: { name?: string };
};

const SocialDashboard = () => {
  const { data: session } = useSession() || {};
  const [logs, setLogs] = useState<SocialLog[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    productId: '',
    scheduledFor: '',
    platforms: 'facebook,instagram',
  });

  const headers = session?.token
    ? { Authorization: `Bearer ${session.token}` }
    : undefined;

  const load = useCallback(async () => {
    if (!session?.token) return;
    try {
      const [logRes, schedRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/social/logs`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/social/scheduled`, { headers }),
      ]);
      setLogs(logRes.data.logs || []);
      setScheduled(schedRes.data.posts || []);
    } catch {
      ToastService.error('Could not load social post data.');
    }
  }, [session?.token]);

  useEffect(() => {
    load();
  }, [load]);

  const triggerPost = async () => {
    if (!scheduleForm.productId.trim()) {
      ToastService.error('Enter a product ID.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/social/trigger`,
        {
          productId: scheduleForm.productId.trim(),
          platforms: scheduleForm.platforms.split(',').map((s) => s.trim()),
        },
        { headers },
      );
      ToastService.success('Post queued.');
      setTimeout(load, 2000);
    } catch {
      ToastService.error('Failed to queue post.');
    }
  };

  const schedulePost = async () => {
    if (!scheduleForm.productId || !scheduleForm.scheduledFor) {
      ToastService.error('Product ID and date/time required.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/social/schedule`,
        {
          productId: scheduleForm.productId.trim(),
          scheduledFor: scheduleForm.scheduledFor,
          platforms: scheduleForm.platforms.split(',').map((s) => s.trim()),
        },
        { headers },
      );
      ToastService.success('Post scheduled.');
      await load();
    } catch {
      ToastService.error('Schedule failed.');
    }
  };

  const cancelScheduled = async (id: string) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/social/scheduled/${id}`,
      { headers },
    );
    await load();
  };

  return (
    <div className="social-dashboard space-y-8 max-w-3xl">
      <div>
        <h3 className="body-bold-large text-mono-100">Social posting</h3>
        <p className="caption text-mono-70 mt-2">
          Manual posts, scheduled posts, and logs for Facebook, Instagram, TikTok, and Twitter.
        </p>
      </div>

      <div className="rounded-xl border border-mono-40 p-6 space-y-3">
        <p className="body-small font-medium">Post or schedule</p>
        <input
          className="input w-full"
          placeholder="Product ID"
          value={scheduleForm.productId}
          onChange={(e) =>
            setScheduleForm({ ...scheduleForm, productId: e.target.value })
          }
        />
        <input
          className="input w-full"
          placeholder="Platforms (comma-separated)"
          value={scheduleForm.platforms}
          onChange={(e) =>
            setScheduleForm({ ...scheduleForm, platforms: e.target.value })
          }
        />
        <input
          type="datetime-local"
          className="input w-full"
          value={scheduleForm.scheduledFor}
          onChange={(e) =>
            setScheduleForm({ ...scheduleForm, scheduledFor: e.target.value })
          }
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" type="button" onClick={triggerPost}>
            Post now
          </Button>
          <Button variant="secondary" type="button" onClick={schedulePost}>
            Schedule
          </Button>
        </div>
      </div>

      <div>
        <p className="body-small font-medium mb-3">Scheduled ({scheduled.length})</p>
        {scheduled.map((s) => (
          <div
            key={s._id}
            className="flex justify-between items-center border border-mono-40 rounded-lg p-3 mb-2"
          >
            <div>
              <p className="caption">{s.productId?.name || s._id}</p>
              <p className="caption text-mono-70">
                {new Date(s.scheduledFor).toLocaleString()} · {s.status} ·{' '}
                {s.platforms?.join(', ')}
              </p>
            </div>
            {s.status === 'scheduled' && (
              <Button variant="secondary" type="button" onClick={() => cancelScheduled(s._id)}>
                Cancel
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <p className="body-small font-medium mb-3">Recent logs</p>
        <div className="max-h-80 overflow-y-auto space-y-2">
          {logs.map((log) => (
            <div
              key={log._id}
              className="border border-mono-40 rounded-lg p-3 text-sm"
            >
              <span className="font-medium">{log.platform}</span> ·{' '}
              <span
                className={
                  log.status === 'success'
                    ? 'text-green-700'
                    : log.status === 'failed'
                      ? 'text-error'
                      : ''
                }
              >
                {log.status}
              </span>{' '}
              · {log.trigger}
              <p className="text-mono-70 text-xs">
                {log.productId?.name} · {new Date(log.createdAt).toLocaleString()}
              </p>
              {log.error && <p className="text-error text-xs">{log.error}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;
