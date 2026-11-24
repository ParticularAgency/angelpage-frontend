'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import AiAssistButton from '@/components/ai/AiAssistButton';
import { suggestEvent } from '@/lib/aiApi';

interface CommunityEvent {
  _id: string;
  title: string;
  status: string;
  eventType: string;
  featuredOnHomepage?: boolean;
  slug: string;
}

const EventsAdmin: React.FC = () => {
  const { data: session } = useSession() || {};
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    description: '',
    eventType: 'donation',
    category: 'community',
    donationGoal: '',
    donationUrl: '',
    liveStreamUrl: '',
    pollQuestion: '',
    pollOptions: '',
    featuredOnHomepage: false,
    publishNow: true,
    topic: '',
  });
  const [aiLoading, setAiLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;

  const fetchEvents = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${api}/events/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: statusFilter ? { status: statusFilter } : {},
      });
      setEvents(res.data.events || []);
    } catch {
      ToastService.error('Failed to load events.');
    }
  }, [api, token, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const publishEvent = async (eventId: string) => {
    try {
      await axios.patch(
        `${api}/events/${eventId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastService.success('Event published.');
      fetchEvents();
    } catch {
      ToastService.error('Failed to publish event.');
    }
  };

  const createEvent = async () => {
    if (!form.title.trim()) {
      ToastService.error('Title is required.');
      return;
    }
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'pollOptions' && val) {
          const options = String(val)
            .split('\n')
            .map(t => t.trim())
            .filter(Boolean);
          body.append('pollOptions', JSON.stringify(options));
        } else if (typeof val === 'boolean') {
          body.append(key, String(val));
        } else if (val !== '' && val !== undefined) {
          body.append(key, String(val));
        }
      });
      body.append('status', form.publishNow ? 'published' : 'pending_review');

      await axios.post(`${api}/events`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      ToastService.success('Event created.');
      setEditorOpen(false);
      fetchEvents();
    } catch {
      ToastService.error('Failed to create event.');
    }
  };

  const handleAiEvent = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      const result = await suggestEvent(
        {
          title: form.title,
          excerpt: form.excerpt,
          description: form.description,
          eventType: form.eventType,
          category: form.category,
          donationGoal: form.donationGoal,
          topic: form.topic,
        },
        token,
      );
      setForm(f => ({
        ...f,
        title: result.title || f.title,
        excerpt: result.excerpt || f.excerpt,
        description: result.description || f.description,
        eventType: result.eventType || f.eventType,
        category: result.category || f.category,
        topic: result.topic || f.topic,
        pollQuestion: result.pollQuestion || f.pollQuestion,
        pollOptions: result.pollOptions?.length
          ? result.pollOptions.join('\n')
          : f.pollOptions,
      }));
      ToastService.success('AI suggested event copy.');
    } catch {
      ToastService.error('Event AI assist failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="events-admin mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="body-bold-large text-mono-100">Events & donations</h3>
          <p className="body-caption text-mono-70 mt-1">
            Create donation drives, live sessions, or polls. Featured items appear on the homepage.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending_review">Pending review</option>
            <option value="published">Published</option>
          </select>
          <Button variant="primary" onClick={() => setEditorOpen(!editorOpen)}>
            {editorOpen ? 'Close' : 'New event'}
          </Button>
        </div>
      </div>

      {editorOpen && (
        <div className="mb-8 rounded-xl border bg-white p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <p className="body-small font-medium">New event</p>
            <AiAssistButton
              label="✨ AI suggest title & description"
              loading={aiLoading}
              onClick={handleAiEvent}
            />
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Topic or theme (optional — AI uses this)"
            value={form.topic}
            onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Short excerpt"
            rows={2}
            value={form.excerpt}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Full description"
            rows={4}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border rounded-lg px-3 py-2"
              value={form.eventType}
              onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}
            >
              <option value="donation">Donation</option>
              <option value="live_session">Live session</option>
              <option value="general">General event</option>
            </select>
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Donation goal (£)"
              value={form.donationGoal}
              onChange={e => setForm(f => ({ ...f, donationGoal: e.target.value }))}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Donation URL"
              value={form.donationUrl}
              onChange={e => setForm(f => ({ ...f, donationUrl: e.target.value }))}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Live stream URL"
              value={form.liveStreamUrl}
              onChange={e => setForm(f => ({ ...f, liveStreamUrl: e.target.value }))}
            />
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Poll question (optional)"
            value={form.pollQuestion}
            onChange={e => setForm(f => ({ ...f, pollQuestion: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Poll options (one per line)"
            rows={3}
            value={form.pollOptions}
            onChange={e => setForm(f => ({ ...f, pollOptions: e.target.value }))}
          />
          <label className="flex items-center gap-2 body-small">
            <input
              type="checkbox"
              checked={form.featuredOnHomepage}
              onChange={e =>
                setForm(f => ({ ...f, featuredOnHomepage: e.target.checked }))
              }
            />
            Feature on homepage
          </label>
          <label className="flex items-center gap-2 body-small">
            <input
              type="checkbox"
              checked={form.publishNow}
              onChange={e => setForm(f => ({ ...f, publishNow: e.target.checked }))}
            />
            Publish immediately
          </label>
          <Button variant="primary" onClick={createEvent}>
            Save event
          </Button>
        </div>
      )}

      <ul className="space-y-3">
        {events.map(ev => (
          <li
            key={ev._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
          >
            <div>
              <p className="body-bold-small">{ev.title}</p>
              <p className="caption text-mono-70">
                {ev.eventType} · {ev.status}
                {ev.featuredOnHomepage ? ' · Featured' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {ev.status === 'published' && (
                <a
                  href={`/events/${ev.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-caption underline text-primary-color-100"
                >
                  View
                </a>
              )}
              {ev.status !== 'published' && (
                <Button variant="primary" onClick={() => publishEvent(ev._id)}>
                  Publish
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsAdmin;
