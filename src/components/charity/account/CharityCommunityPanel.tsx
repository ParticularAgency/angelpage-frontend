'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import AiAssistButton from '@/components/ai/AiAssistButton';
import TagPills from '@/components/ai/TagPills';
import { enhanceBlogSeo, suggestEvent } from '@/lib/aiApi';

const CharityCommunityPanel = () => {
  const { data: session } = useSession() || {};
  const [tab, setTab] = useState<'blog' | 'events'>('blog');
  const [myPosts, setMyPosts] = useState<{ title: string; status: string }[]>(
    []
  );
  const [myEvents, setMyEvents] = useState<{ title: string; status: string }[]>(
    []
  );
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'stories',
    tags: [] as string[],
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    excerpt: '',
    description: '',
    eventType: 'donation',
    category: 'community',
    topic: '',
    donationGoal: '',
    donationUrl: '',
    liveStreamUrl: '',
    pollQuestion: '',
    pollOptions: '',
  });
  const [aiLoading, setAiLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;

  const loadMine = useCallback(async () => {
    if (!token) return;
    try {
      const [blogRes, eventsRes] = await Promise.all([
        axios.get(`${api}/blog/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${api}/events/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMyPosts(blogRes.data.posts || []);
      setMyEvents(eventsRes.data.events || []);
    } catch {
      /* optional */
    }
  }, [api, token]);

  useEffect(() => {
    loadMine();
  }, [loadMine]);

  const submitBlog = async () => {
    if (!blogForm.title.trim()) {
      ToastService.error('Title is required.');
      return;
    }
    try {
      const body = new FormData();
      body.append('title', blogForm.title);
      body.append('excerpt', blogForm.excerpt);
      body.append('content', blogForm.content);
      body.append('category', blogForm.category);
      body.append('status', 'pending_review');
      if (blogForm.tags.length) {
        body.append('tags', JSON.stringify(blogForm.tags));
      }

      await axios.post(`${api}/blog`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      ToastService.success('Blog submitted for review.');
      setBlogForm({ title: '', excerpt: '', content: '', category: 'stories', tags: [] });
      loadMine();
    } catch {
      ToastService.error('Failed to submit blog post.');
    }
  };

  const submitEvent = async () => {
    if (!eventForm.title.trim()) {
      ToastService.error('Title is required.');
      return;
    }
    try {
      const body = new FormData();
      Object.entries(eventForm).forEach(([key, val]) => {
        if (key === 'pollOptions' && val) {
          const options = String(val)
            .split('\n')
            .map(t => t.trim())
            .filter(Boolean);
          body.append('pollOptions', JSON.stringify(options));
        } else if (val) {
          body.append(key, String(val));
        }
      });

      await axios.post(`${api}/events`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      ToastService.success('Event submitted for review.');
      setEventForm({
        title: '',
        excerpt: '',
        description: '',
        eventType: 'donation',
        category: 'community',
        topic: '',
        donationGoal: '',
        donationUrl: '',
        liveStreamUrl: '',
        pollQuestion: '',
        pollOptions: '',
      });
      loadMine();
    } catch {
      ToastService.error('Failed to submit event.');
    }
  };

  const aiBlog = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      const result = await enhanceBlogSeo(blogForm, token);
      setBlogForm(f => ({
        ...f,
        title: result.title || f.title,
        excerpt: result.excerpt || f.excerpt,
        content: result.content || f.content,
        category: result.category || f.category,
        tags: result.tags || f.tags,
      }));
      ToastService.success('AI generated blog SEO copy.');
    } catch {
      ToastService.error('Blog AI failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const aiEvent = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      const result = await suggestEvent(eventForm, token);
      setEventForm(f => ({
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
      ToastService.success('AI suggested event details.');
    } catch {
      ToastService.error('Event AI failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="charity-community-panel max-w-2xl">
      <p className="body-small text-mono-70 mb-6">
        Share stories and run donation or live events. Posts are reviewed by Angelpage before going live on the blog and homepage.
      </p>

      <div className="flex gap-2 mb-6">
        {(['blog', 'events'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full body-caption capitalize ${
              tab === t
                ? 'bg-primary-color-100 text-white'
                : 'bg-mono-20 hover:bg-[#FCF2FF]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'blog' ? (
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <div className="flex flex-wrap justify-between gap-3 items-center">
            <h3 className="body-bold-small">New blog post</h3>
            <AiAssistButton
              label="✨ AI SEO assist"
              loading={aiLoading}
              onClick={aiBlog}
            />
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Title"
            value={blogForm.title}
            onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Excerpt"
            rows={2}
            value={blogForm.excerpt}
            onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Article content"
            rows={6}
            value={blogForm.content}
            onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
          />
          <TagPills tags={blogForm.tags} />
          <Button variant="primary" onClick={submitBlog}>
            Submit for review
          </Button>
          {myPosts.length > 0 && (
            <div className="pt-4 border-t">
              <p className="caption text-mono-70 mb-2">Your posts</p>
              <ul className="space-y-1">
                {myPosts.map((p, i) => (
                  <li key={i} className="body-caption">
                    {p.title} — <span className="text-mono-70">{p.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <div className="flex flex-wrap justify-between gap-3 items-center">
            <h3 className="body-bold-small">New event</h3>
            <AiAssistButton
              label="✨ AI suggest event"
              loading={aiLoading}
              onClick={aiEvent}
            />
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Topic or theme (optional)"
            value={eventForm.topic}
            onChange={e => setEventForm(f => ({ ...f, topic: e.target.value }))}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Title"
            value={eventForm.title}
            onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
          />
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={eventForm.eventType}
            onChange={e =>
              setEventForm(f => ({ ...f, eventType: e.target.value }))
            }
          >
            <option value="donation">Donation drive</option>
            <option value="live_session">Live session</option>
            <option value="general">Community event</option>
          </select>
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Short summary"
            rows={2}
            value={eventForm.excerpt}
            onChange={e => setEventForm(f => ({ ...f, excerpt: e.target.value }))}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Details"
            rows={4}
            value={eventForm.description}
            onChange={e =>
              setEventForm(f => ({ ...f, description: e.target.value }))
            }
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Donation goal (£)"
            value={eventForm.donationGoal}
            onChange={e =>
              setEventForm(f => ({ ...f, donationGoal: e.target.value }))
            }
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Donation or live URL"
            value={eventForm.donationUrl || eventForm.liveStreamUrl}
            onChange={e => {
              const v = e.target.value;
              setEventForm(f => ({
                ...f,
                donationUrl: f.eventType === 'donation' ? v : f.donationUrl,
                liveStreamUrl:
                  f.eventType === 'live_session' ? v : f.liveStreamUrl,
              }));
            }}
          />
          <Button variant="primary" onClick={submitEvent}>
            Submit for review
          </Button>
          {myEvents.length > 0 && (
            <div className="pt-4 border-t">
              <p className="caption text-mono-70 mb-2">Your events</p>
              <ul className="space-y-1">
                {myEvents.map((e, i) => (
                  <li key={i} className="body-caption">
                    {e.title} — <span className="text-mono-70">{e.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharityCommunityPanel;
