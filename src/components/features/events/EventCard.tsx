'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import type { CommunityEventRecord } from '@/lib/server-api';
import DonationProgress from './DonationProgress';
import EventActionButtons from './EventActionButtons';
import {
  formatShortDate,
  getDonationProgress,
  getEventTiming,
  getEventTypeConfig,
  getCountdownLabel,
  hasActivePoll,
} from './eventUtils';

type EventCardProps = {
  event: CommunityEventRecord;
  variant?: 'default' | 'compact' | 'horizontal' | 'featured';
  showActions?: boolean;
  className?: string;
};

function TimingBadge({
  timing,
  startAt,
  inverted = false,
}: {
  timing: ReturnType<typeof getEventTiming>;
  startAt?: string;
  inverted?: boolean;
}) {
  if (timing === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-xs">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Live
      </span>
    );
  }
  if (timing === 'upcoming') {
    const countdown = getCountdownLabel(startAt);
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-xs ${
          inverted
            ? 'bg-white/15 text-white backdrop-blur-xs'
            : 'bg-white text-[#611192]'
        }`}
      >
        {countdown || 'Soon'}
      </span>
    );
  }
  if (timing === 'ended') {
    return (
      <span className="rounded-full bg-mono-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase text-white">
        Ended
      </span>
    );
  }
  return null;
}

function EventImageBlock({
  event,
  typeConfig,
  timing,
  pollActive,
  aspectClass,
  inverted = false,
}: {
  event: CommunityEventRecord;
  typeConfig: ReturnType<typeof getEventTypeConfig>;
  timing: ReturnType<typeof getEventTiming>;
  pollActive: boolean;
  aspectClass: string;
  inverted?: boolean;
}) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-mono-20 ${aspectClass}`}>
      <Image
        src={event.coverImage || '/images/products/card-placeholder-image.webp'}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div
        className={`absolute inset-0 ${
          inverted
            ? 'bg-linear-to-r from-[#1a0a24]/80 via-[#1a0a24]/35 to-transparent'
            : 'bg-linear-to-t from-black/55 via-black/10 to-transparent'
        }`}
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs ${typeConfig.bg} ${typeConfig.accent}`}
        >
          {typeConfig.shortLabel}
        </span>
        <TimingBadge timing={timing} startAt={event.startAt} inverted={inverted} />
      </div>
      {pollActive && (
        <span className="absolute bottom-3 left-3 rounded-full bg-[#611192]/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs">
          Poll open
        </span>
      )}
    </div>
  );
}

function EventMeta({
  event,
  className = '',
}: {
  event: CommunityEventRecord;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-mono-70 ${className}`}>
      {event.startAt && (
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3 text-[#611192]" strokeWidth={2} aria-hidden />
          {formatShortDate(event.startAt)}
        </span>
      )}
      {event.authorName && (
        <span className="inline-flex items-center gap-1 truncate">
          <User className="h-3 w-3 shrink-0" aria-hidden />
          {event.authorName}
        </span>
      )}
    </div>
  );
}

export default function EventCard({
  event,
  variant = 'default',
  showActions = false,
  className = '',
}: EventCardProps) {
  const typeConfig = getEventTypeConfig(event.eventType);
  const timing = getEventTiming(event);
  const donation = getDonationProgress(event);
  const pollActive = hasActivePoll(event);
  const detailHref = `/events/${event.slug}`;

  if (variant === 'featured') {
    return (
      <Link
        href={detailHref}
        className={`group relative block overflow-hidden rounded-3xl border border-[#E8D4F4]/60 bg-[#1a0a24] shadow-xl shadow-[#611192]/10 transition hover:shadow-2xl hover:shadow-[#611192]/15 ${className}`}
      >
        <div className="relative min-h-[220px] md:min-h-[280px]">
          <Image
            src={event.coverImage || '/images/products/card-placeholder-image.webp'}
            alt={event.title}
            fill
            className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.03]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#1a0a24]/95 via-[#1a0a24]/70 to-[#1a0a24]/25" />
          <div className="relative flex h-full flex-col justify-end p-6 md:p-8 lg:p-10">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${typeConfig.bg} ${typeConfig.accent}`}
              >
                {typeConfig.shortLabel}
              </span>
              <TimingBadge timing={timing} startAt={event.startAt} inverted />
            </div>
            <h3 className="font-primary mt-4 max-w-2xl text-2xl leading-tight text-white md:text-3xl lg:text-4xl">
              {event.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-white/80 line-clamp-2 md:text-base">
              {event.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <EventMeta event={event} className="text-white/70!" />
              {event.eventType === 'donation' && donation.goal > 0 && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  £{donation.raised.toLocaleString()} raised · {donation.percent}%
                </span>
              )}
            </div>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#611192] transition group-hover:bg-[#FCF2FF]">
              View featured event
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={`group flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-xs transition-all duration-300 hover:border-[#E8D4F4] hover:shadow-lg hover:shadow-[#611192]/6 sm:flex-row ${className}`}
      >
        <Link href={detailHref} className="relative w-full shrink-0 sm:w-[200px] md:w-[240px]">
          <EventImageBlock
            event={event}
            typeConfig={typeConfig}
            timing={timing}
            pollActive={pollActive}
            aspectClass="aspect-16/10 sm:aspect-auto sm:h-full sm:min-h-[148px]"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
          <Link href={detailHref} className="flex-1">
            <EventMeta event={event} className="mb-2" />
            <h3 className="font-primary text-base font-semibold leading-snug text-mono-100 line-clamp-2 transition group-hover:text-[#611192] md:text-lg">
              {event.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mono-70 line-clamp-2">
              {event.excerpt}
            </p>
            {event.eventType === 'donation' && donation.goal > 0 && (
              <div className="mt-3 max-w-sm">
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="font-semibold text-[#611192]">
                    £{donation.raised.toLocaleString()}
                  </span>
                  <span className="text-mono-70">£{donation.goal.toLocaleString()}</span>
                </div>
                <DonationProgress
                  raised={donation.raised}
                  goal={donation.goal}
                  percent={donation.percent}
                  size="sm"
                  showLabels={false}
                />
              </div>
            )}
          </Link>
          {showActions && (
            <div className="mt-4 border-t border-mono-20/80 pt-3">
              <EventActionButtons event={event} size="sm" />
            </div>
          )}
        </div>
      </article>
    );
  }

  const isCompact = variant === 'compact';
  const imageAspect = isCompact ? 'aspect-5/3' : 'aspect-4/3';
  const padding = isCompact ? 'p-4' : 'p-5';

  const cardShell = `group flex h-full flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-xs transition-all duration-300 hover:border-[#E8D4F4] hover:shadow-lg hover:shadow-[#611192]/8 ${className}`;

  const body = (
    <div className={`flex flex-1 flex-col ${padding}`}>
      <EventMeta event={event} className="mb-2" />
      <h3
        className={`font-primary font-semibold leading-snug text-mono-100 line-clamp-2 transition-colors group-hover:text-[#611192] ${isCompact ? 'text-base' : 'text-lg'}`}
      >
        {event.title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-mono-70 line-clamp-2">
        {event.excerpt}
      </p>
      {event.eventType === 'donation' && donation.goal > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-[11px]">
            <span className="font-semibold text-[#611192]">
              £{donation.raised.toLocaleString()} raised
            </span>
            <span className="text-mono-70">Goal £{donation.goal.toLocaleString()}</span>
          </div>
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
        <p className="mt-2 rounded-lg bg-[#FCF2FF] px-2.5 py-1.5 text-[11px] text-[#611192] line-clamp-1">
          {event.pollQuestion}
        </p>
      )}
      {showActions ? (
        <div className="mt-4 border-t border-mono-20/80 pt-3">
          <EventActionButtons event={event} size="sm" />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between border-t border-mono-20/80 pt-3">
          <span className="text-sm font-semibold text-[#611192]">View event</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCF2FF] text-[#611192] transition group-hover:bg-[#611192] group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      )}
    </div>
  );

  if (showActions) {
    return (
      <article className={cardShell}>
        <Link href={detailHref} className="block">
          <EventImageBlock
            event={event}
            typeConfig={typeConfig}
            timing={timing}
            pollActive={pollActive}
            aspectClass={imageAspect}
          />
        </Link>
        {body}
      </article>
    );
  }

  return (
    <Link href={detailHref} className={cardShell}>
      <EventImageBlock
        event={event}
        typeConfig={typeConfig}
        timing={timing}
        pollActive={pollActive}
        aspectClass={imageAspect}
      />
      {body}
    </Link>
  );
}
