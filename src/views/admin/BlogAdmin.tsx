'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import Link from 'next/link';
import AiAssistButton from '@/components/ai/AiAssistButton';
import TagPills from '@/components/ai/TagPills';
import { enhanceBlogSeo } from '@/lib/aiApi';

interface BlogPost {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: string;
  category?: string;
  authorRole?: string;
  createdAt: string;
}

const BlogAdmin: React.FC = () => {
  const { data: session } = useSession() || {};
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
  });
  const [aiLoading, setAiLoading] = useState(false);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${api}/blog/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: statusFilter ? { status: statusFilter } : {},
      });
      setPosts(res.data.posts || []);
    } catch {
      ToastService.error('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, [api, token, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const publishPost = async (postId: string) => {
    try {
      await axios.patch(
        `${api}/blog/${postId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastService.success('Post published.');
      fetchPosts();
    } catch {
      ToastService.error('Failed to publish post.');
    }
  };

  const createPost = async () => {
    if (!form.title.trim()) {
      ToastService.error('Title is required.');
      return;
    }
    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('excerpt', form.excerpt);
      body.append('content', form.content);
      body.append('category', form.category);
      body.append('status', 'published');
      if (form.tags.length) {
        body.append('tags', JSON.stringify(form.tags));
      }

      await axios.post(`${api}/blog`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      ToastService.success('Post published.');
      setForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'general',
        tags: [],
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      });
      setEditorOpen(false);
      fetchPosts();
    } catch {
      ToastService.error('Failed to create post.');
    }
  };

  const handleAiBlog = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      const result = await enhanceBlogSeo(
        {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
        },
        token,
      );
      setForm(f => ({
        ...f,
        title: result.title || f.title,
        excerpt: result.excerpt || f.excerpt,
        content: result.content || f.content,
        category: result.category || f.category,
        tags: result.tags || f.tags,
        metaTitle: result.metaTitle || f.metaTitle,
        metaDescription: result.metaDescription || f.metaDescription,
        keywords: result.keywords || f.keywords,
      }));
      ToastService.success('AI generated SEO-friendly blog copy.');
    } catch {
      ToastService.error('Blog AI assist failed. Check GEMINI_API_KEY.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="blog-admin mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="body-bold-large text-mono-100">Blog</h3>
          <p className="body-caption text-mono-70 mt-1">
            Published posts appear on <Link href="/blog" className="underline">/blog</Link> and the homepage.
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
            <option value="draft">Draft</option>
          </select>
          <Button variant="primary" onClick={() => setEditorOpen(!editorOpen)}>
            {editorOpen ? 'Close editor' : 'New post'}
          </Button>
        </div>
      </div>

      {editorOpen && (
        <div className="mb-8 rounded-xl border bg-white p-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="body-small font-medium">New post</p>
            <AiAssistButton
              label="✨ AI SEO title, tags & content"
              loading={aiLoading}
              onClick={handleAiBlog}
            />
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="SEO meta title (optional)"
            value={form.metaTitle}
            onChange={e => setForm({ ...form, metaTitle: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={e => setForm({ ...form, excerpt: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="SEO meta description"
            value={form.metaDescription}
            onChange={e =>
              setForm({ ...form, metaDescription: e.target.value })
            }
          />
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {['general', 'stories', 'impact', 'sustainability', 'fashion', 'community', 'guides', 'news'].map(
              c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ),
            )}
          </select>
          <TagPills
            tags={form.tags}
            onRemove={tag =>
              setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
            }
          />
          {form.keywords.length > 0 && (
            <p className="caption text-mono-70">
              Keywords: {form.keywords.join(', ')}
            </p>
          )}
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[160px]"
            placeholder="Content (HTML or plain text)"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
          <Button variant="primary" onClick={createPost}>
            Publish now
          </Button>
        </div>
      )}

      {loading ? (
        <p className="body-small text-mono-70">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="body-small text-mono-70">No posts in this filter.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post._id}
              className="rounded-xl border bg-white p-5 flex flex-wrap justify-between gap-4"
            >
              <div>
                <p className="body-bold-small text-mono-100">{post.title}</p>
                <p className="caption text-mono-70 mt-1">
                  {post.status} · {post.authorRole || 'author'} ·{' '}
                  {new Date(post.createdAt).toLocaleDateString('en-GB')}
                </p>
                {post.excerpt && (
                  <p className="body-small text-mono-80 mt-2">{post.excerpt}</p>
                )}
              </div>
              {post.status === 'pending_review' && (
                <Button variant="primary" onClick={() => publishPost(post._id)}>
                  Approve & publish
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
