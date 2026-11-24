'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  ExternalLink,
  Heart,
  Radio,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/components/elements';
import type { CommunityEventRecord } from '@/lib/server-api';
import DonationProgress from '@/components/features/events/DonationProgress';
import {
  formatShortDate,
  getDonationProgress,
  getEventTiming,
  getEventTypeConfig,
  hasActivePoll,
} from '@/components/features/events/eventUtils';

type HomeEventTileProps = {
  event: CommunityEventRecord;
  featured?: boolean;
};

const TYPE_ACCENT = {
  donation: {
    bar: 'bg-linear-to-b from-emerald-400 to-emerald-600',
    glow: 'hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]',
    chip: 'from-emerald-500 to-emerald-600',
  },
  live_session: {
    bar: 'bg-linear-to-b from-rose-400 to-rose-600',
    glow: 'hover:shadow-[0_12px_40px_rgba(244,63,94,0.15)]',
    chip: 'from-rose-500 to-rose-600',
  },
  general: {
    bar: 'bg-linear-to-b from-[#8B3AB8] to-[#611192]',
    glow: 'hover:shadow-[0_12px_40px_rgba(97,17,146,0.18)]',
    chip: 'from-[#8B3AB8] to-[#611192]',
  },
} as const;

function getAccent(eventType?: string) {
  if (eventType === 'donation') return TYPE_ACCENT.donation;
  if (eventType === 'live_session') return TYPE_ACCENT.live_session;
  return TYPE_ACCENT.general;
}

export default function HomeEventTile({
  event,
  featured = false,
}: HomeEventTileProps) {
  const typeConfig = getEventTypeConfig(event.eventType);
  const timing = getEventTiming(event);
  const donation = getDonationProgress(event);
  const pollActive = hasActivePoll(event);
  const accent = getAccent(event.eventType);
  const isDonation = event.eventType === 'donation';
  const isLiveSession = event.eventType === 'live_session';
  const isLive = timing === 'live';
  const isEnded = timing === 'ended';
  const dateLabel = formatShortDate(event.startAt);
  const detailHref = `/events/${event.slug}`;

  const imageSize = featured
    ? 'h-[108px] w-[108px] sm:h-[128px] sm:w-[128px]'
    : 'h-[88px] w-[88px] sm:h-[100px] sm:w-[100px]';

  return (
    <article
      className={`group relative flex overflow-hidden rounded-2xl border border-white/80 bg-white/95 backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 ${accent.glow} ${featured ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'}`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accent.bar}`} aria-hidden />

      <div className={`relative ml-1 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-md ${imageSize}`}>
        <Image
          src={event.coverImage || '/images/products/card-placeholder-image.webp'}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '128px' : '100px'}
        />
        {isLive && (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-rose-700/90 to-transparent px-2 pb-1.5 pt-4">
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 pl-3 sm:pl-4">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full bg-linear-to-r ${accent.chip} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs`}
            >
              {isDonation && <Heart className="h-3 w-3" aria-hidden />}
              {isLiveSession && <Radio className="h-3 w-3" aria-hidden />}
              {!isDonation && !isLiveSession && (
                <BarChart3 className="h-3 w-3" aria-hidden />
              )}
              {typeConfig.shortLabel}
            </span>
            {dateLabel && (
              <span className="inline-flex items-center gap-1 text-[11px] text-mono-70">
                <Calendar className="h-3 w-3" strokeWidth={2} aria-hidden />
                {dateLabel}
              </span>
            )}
          </div>

          <Link href={detailHref} className="block min-w-0">
            <h3
              className={`font-primary font-semibold leading-snug text-mono-100 line-clamp-1 transition-colors group-hover:text-[#611192] ${featured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}
            >
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-mono-70 line-clamp-2 sm:text-sm">
              {event.excerpt}
            </p>
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-mono-70">
            {event.authorName && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3 shrink-0" aria-hidden />
                {event.authorName}
              </span>
            )}
            {isDonation && donation.goal > 0 && (
              <span className="font-semibold text-emerald-700">
                £{donation.raised.toLocaleString()}
                <span className="font-normal text-mono-70">
                  {' '}
                  / £{donation.goal.toLocaleString()} · {donation.percent}%
                </span>
              </span>
            )}
          </div>

          {isDonation && donation.goal > 0 && (
            <div className="max-w-sm pt-0.5">
              <DonationProgress
                raised={donation.raised}
                goal={donation.goal}
                percent={donation.percent}
                size="sm"
                showLabels={false}
              />
            </div>
          )}

          {pollActive && event.pollQuestion && (
            <p className="flex items-start gap-1.5 rounded-lg bg-[#FCF2FF] px-2.5 py-1.5 text-[11px] text-[#611192]">
              <BarChart3 className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              <span className="line-clamp-1">{event.pollQuestion}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isDonation && event.donationUrl && !isEnded && (
            <a
              href={event.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:shadow-md">
                Donate
                <ExternalLink className="h-3 w-3" aria-hidden />
              </span>
            </a>
          )}
          {isLiveSession && event.liveStreamUrl && !isEnded && (
            <a
              href={event.liveStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:shadow-md">
                {isLive ? 'Join live' : 'Watch'}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </span>
            </a>
          )}
          {pollActive && !isEnded && (
            <Link href={`${detailHref}#poll`} className="inline-flex">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#8B3AB8] to-[#611192] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:shadow-md">
                Vote
                <BarChart3 className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          )}
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#611192] transition hover:gap-2"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
