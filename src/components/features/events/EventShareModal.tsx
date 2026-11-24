'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Heart, Link2, Share2, X } from 'lucide-react';

export type EventSharePayload = {
  id: string;
  title: string;
  description: string;
  tag?: string;
  url?: string;
};

type EventShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event: EventSharePayload | null;
};

const TRUST = ['90% to charity', 'Secure giving', 'USA, Canada & UK'];

export default function EventShareModal({
  isOpen,
  onClose,
  event,
}: EventShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!event) return '';
    return (
      event.url ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}/events/${event.id}`
        : `/events/${event.id}`)
    );
  }, [event]);

  if (!isOpen || !event) return null;

  const shareText = `Support “${event.title}” on Angelpage. Ninety percent of each gift supports the charity.`;

  const platforms = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({ title: event.title, text: shareText, url: shareUrl });
    } catch {
      // The person closed the system share sheet.
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10050] flex items-center justify-center px-4">
        <motion.button
          type="button"
          aria-label="Close share dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B0112]/45"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-appeal-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(97,17,146,0.18)]"
          onClick={eventClick => eventClick.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
                Angelpage
              </p>
              <h2
                id="share-appeal-title"
                className="mt-2 font-primary text-[28px] leading-none text-[#0B0112]"
              >
                Share this appeal
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E8F8] text-[#3B055C]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="px-6 pt-5 pb-6">
            <div className="rounded-2xl bg-[#FCF2FF] px-4 py-4">
              {event.tag ? (
                <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#611192] uppercase">
                  {event.tag}
                </span>
              ) : null}
              <h3 className="mt-2 font-primary text-[22px] leading-tight text-[#0B0112]">
                {event.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#6B686E]">
                {event.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {TRUST.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E3E7] px-3 py-1 text-[12px] text-[#3B055C]"
                >
                  <Heart className="h-3 w-3 text-[#611192]" aria-hidden />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E6E3E7] bg-white p-2">
              <Link2 className="ml-2 h-4 w-4 shrink-0 text-[#611192]" aria-hidden />
              <p className="min-w-0 flex-1 truncate text-[13px] text-[#3B055C]">
                {shareUrl}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#611192] px-4 text-[13px] font-semibold text-white"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleNativeShare}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#611192] text-[14px] font-semibold text-[#611192]"
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Share from this device
            </button>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {platforms.map(platform => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target={platform.name === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center rounded-2xl border border-[#E6E3E7] text-[13px] font-medium text-[#0B0112] hover:border-[#611192] hover:text-[#611192]"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
