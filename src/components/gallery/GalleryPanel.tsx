'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import SocialPostingToggles, {
  defaultSocialPostingPrefs,
  type SocialPostingPrefs,
} from '@/components/product/SocialPostingToggles';

type GalleryItem = {
  _id: string;
  title: string;
  slug: string;
  caption?: string;
  kind: string;
  status: string;
  media: {
    url: string;
    thumbnailUrl?: string;
    mediaType: string;
  };
  authorName?: string;
};

type UploadMode = 'photo' | 'reel' | 'record' | 'camera' | 'document';

interface GalleryPanelProps {
  allowModeration?: boolean;
}

const GalleryPanel = ({ allowModeration = false }: GalleryPanelProps) => {
  const { data: session } = useSession() || {};
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [mode, setMode] = useState<UploadMode>('photo');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('impact');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [socialPosting, setSocialPosting] = useState<SocialPostingPrefs>(
    defaultSocialPostingPrefs(),
  );
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [recording, setRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const loadItems = useCallback(async () => {
    if (!token) return;
    try {
      const url = allowModeration
        ? `${api}/gallery/admin/all`
        : `${api}/gallery/mine`;
      const params = allowModeration && statusFilter ? { status: statusFilter } : {};
      const res = await axios.get(url, { headers, params });
      setItems(res.data.items || []);
    } catch {
      ToastService.error('Could not load gallery.');
    }
  }, [api, token, allowModeration, statusFilter]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const setSelectedFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => {
    stopCamera();
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: mode === 'record',
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      ToastService.error('Camera access denied or unavailable.');
    }
  };

  useEffect(() => {
    if (mode === 'camera' || mode === 'record') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [mode]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const f = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(f);
      ToastService.success('Photo captured — add title and publish.');
    }, 'image/jpeg', 0.92);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    });
    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const f = new File([blob], `reel-${Date.now()}.webm`, { type: 'video/webm' });
      setSelectedFile(f);
      setRecording(false);
      ToastService.success('Reel recorded — add title and publish.');
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const submitItem = async (publishNow = false) => {
    if (!title.trim()) {
      ToastService.error('Title is required.');
      return;
    }
    if (!file) {
      ToastService.error('Add or capture media first.');
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append('media', file);
      body.append('title', title);
      body.append('caption', caption);
      if (tags.trim()) {
        body.append(
          'tags',
          JSON.stringify(
            tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean),
          ),
        );
      }
      body.append(
        'kind',
        mode === 'reel' || mode === 'record' ? 'reel' : mode === 'document' ? 'document' : 'photo',
      );
      body.append('socialPosting', JSON.stringify(socialPosting));
      if (allowModeration && publishNow) body.append('publishNow', 'true');

      await axios.post(`${api}/gallery`, body, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });

      ToastService.success(
        allowModeration && publishNow
          ? 'Published to gallery & social queue.'
          : 'Submitted for review.',
      );
      setTitle('');
      setCaption('');
      setTags('impact');
      setSelectedFile(null);
      await loadItems();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Upload failed.';
      ToastService.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const shareItem = async (id: string) => {
    await axios.post(
      `${api}/gallery/${id}/share`,
      { platforms: ['facebook', 'instagram', 'tiktok', 'twitter'] },
      { headers },
    );
    ToastService.success('Sharing queued.');
  };

  const publishItem = async (id: string) => {
    await axios.patch(`${api}/gallery/${id}/publish`, {}, { headers });
    ToastService.success('Published.');
    loadItems();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Remove this gallery item?')) return;
    await axios.delete(`${api}/gallery/${id}`, { headers });
    loadItems();
  };

  const acceptMap: Record<UploadMode, string> = {
    photo: 'image/jpeg,image/png,image/webp',
    reel: 'video/mp4,video/webm,video/quicktime',
    record: 'video/*',
    camera: 'image/*',
    document: 'image/*,application/pdf',
  };

  return (
    <div className="gallery-panel max-w-3xl space-y-8">
      <div>
        <h3 className="body-bold-large text-mono-100">Gallery & reels</h3>
        <p className="caption text-mono-70 mt-2">
          Post photos, record or upload reels, and share to social media. Published items appear on{' '}
          <a href="/reels" className="underline text-primary-color-100" target="_blank" rel="noreferrer">
            /reels
          </a>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['photo', 'Upload photo'],
            ['camera', 'Take photo'],
            ['reel', 'Upload reel'],
            ['record', 'Record reel'],
            ['document', 'Document'],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setSelectedFile(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs capitalize ${
              mode === m
                ? 'bg-primary-color-100 text-white'
                : 'bg-mono-20 hover:bg-[#FCF2FF]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-mono-40 bg-white p-6 space-y-4">
        {(mode === 'camera' || mode === 'record') && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              className="w-full max-h-80 rounded-lg bg-black object-contain"
              playsInline
              muted={mode === 'camera'}
            />
            <div className="flex gap-2">
              {mode === 'camera' ? (
                <Button type="button" variant="primary" onClick={capturePhoto}>
                  Capture photo
                </Button>
              ) : recording ? (
                <Button type="button" variant="primary" onClick={stopRecording}>
                  Stop recording
                </Button>
              ) : (
                <Button type="button" variant="primary" onClick={startRecording}>
                  Start recording
                </Button>
              )}
            </div>
          </div>
        )}

        {mode !== 'camera' && mode !== 'record' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptMap[mode]}
              className="hidden"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </Button>
          </div>
        )}

        {preview && (
          <div className="rounded-lg overflow-hidden border border-mono-40">
            {file?.type.startsWith('video/') ? (
              <video src={preview} controls className="w-full max-h-96" />
            ) : (
              <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
            )}
          </div>
        )}

        <input
          className="input w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="textarea w-full"
          placeholder="Caption (optional)"
          rows={2}
          value={caption}
          onChange={e => setCaption(e.target.value)}
        />
        <input
          className="input w-full"
          placeholder="Tags (comma-separated, e.g. impact, thank-you)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <p className="caption text-mono-70 -mt-2">
          Use tag <strong>impact</strong> for thank-you stories donors can find on the reels page.
        </p>

        <SocialPostingToggles value={socialPosting} onChange={setSocialPosting} />

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="primary"
            disabled={uploading}
            onClick={() => submitItem(allowModeration)}
          >
            {uploading ? 'Uploading…' : allowModeration ? 'Publish now' : 'Submit for review'}
          </Button>
          {allowModeration && (
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() => submitItem(false)}
            >
              Save as pending
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="body-small font-medium">
            {allowModeration ? 'Moderation queue' : 'Your gallery'} ({items.length})
          </p>
          {allowModeration && (
            <select
              className="border rounded-lg px-2 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="pending_review">Pending</option>
              <option value="published">Published</option>
              <option value="">All</option>
            </select>
          )}
        </div>

        <div className="grid gap-4">
          {items.map(item => (
            <div
              key={item._id}
              className="flex gap-4 rounded-lg border border-mono-40 p-4 items-start"
            >
              <img
                src={item.media.thumbnailUrl || item.media.url}
                alt=""
                className="w-20 h-20 object-cover rounded-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="body-small font-medium truncate">{item.title}</p>
                <p className="caption text-mono-70">
                  {item.kind} · {item.status}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.status === 'published' && (
                    <a
                      href={`/reels?item=${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="caption underline text-primary-color-100"
                    >
                      View
                    </a>
                  )}
                  {item.status === 'published' && (
                    <Button type="button" variant="secondary" onClick={() => shareItem(item._id)}>
                      Share to socials
                    </Button>
                  )}
                  {allowModeration && item.status === 'pending_review' && (
                    <Button type="button" variant="primary" onClick={() => publishItem(item._id)}>
                      Approve
                    </Button>
                  )}
                  <Button type="button" variant="secondary" onClick={() => deleteItem(item._id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPanel;
