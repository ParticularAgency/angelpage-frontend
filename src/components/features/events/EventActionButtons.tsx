'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, ExternalLink, Radio } from 'lucide-react';
import type { CommunityEventRecord } from '@/lib/server-api';
import { getEventTiming, hasActivePoll } from './eventUtils';

type EventActionButtonsProps = {
  event: CommunityEventRecord;
  size?: 'sm' | 'md';
  showDetails?: boolean;
  stacked?: boolean;
};

export default function EventActionButtons({
  event,
  size = 'sm',
  showDetails = true,
  stacked = false,
}: EventActionButtonsProps) {
  const timing = getEventTiming(event);
  const pollActive = hasActivePoll(event);
  const isEnded = timing === 'ended';
  const detailHref = `/events/${event.slug}`;

  const btn =
    size === 'sm'
      ? 'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.98]'
      : `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.98] ${stacked ? 'w-full' : ''}`;

  return (
    <div
      className={
        stacked
          ? 'flex w-full flex-col gap-2.5'
          : 'flex flex-wrap items-center gap-2'
      }
    >
      {event.eventType === 'donation' && event.donationUrl && !isEnded && (
        <a
          href={event.donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-[#611192] text-white shadow-md shadow-[#611192]/25 hover:bg-[#4d0d75]`}
        >
          Donate now
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
      {event.eventType === 'live_session' && event.liveStreamUrl && !isEnded && (
        <a
          href={event.liveStreamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-rose-600 text-white shadow-md shadow-rose-600/25 hover:bg-rose-700`}
        >
          <Radio className="h-3.5 w-3.5" aria-hidden />
          {timing === 'live' ? 'Join live' : 'Watch'}
        </a>
      )}
      {pollActive && !isEnded && (
        <Link
          href={`${detailHref}#poll`}
          className={`${btn} bg-[#611192] text-white shadow-md shadow-[#611192]/25 hover:bg-[#4d0d75]`}
        >
          <BarChart3 className="h-3.5 w-3.5" aria-hidden />
          Vote now
        </Link>
      )}
      {showDetails && (
        <Link
          href={detailHref}
          className={`${btn} border border-[#E8D4F4] bg-white text-[#611192] hover:border-[#611192]/30 hover:bg-[#FCF2FF]`}
        >
          Details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
