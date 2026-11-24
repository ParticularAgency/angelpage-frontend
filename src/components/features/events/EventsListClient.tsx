'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Heart, Radio, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/elements';
import type { CommunityEventRecord } from '@/lib/server-api';
import { useGetEventsQuery } from '@/store/api/angelpageApi';
import EventCard from './EventCard';
import EventsListSkeleton from './EventsListSkeleton';
import { filterEvents, getDonationProgress } from './eventUtils';

type EventsListClientProps = {
  initialEvents?: CommunityEventRecord[];
};

const FILTER_TABS = [
  { id: '', label: 'All', icon: Sparkles },
  { id: 'donation', label: 'Giving', icon: Heart },
  { id: 'live_session', label: 'Live', icon: Radio },
  { id: 'general', label: 'Community', icon: Calendar },
] as const;

export default function EventsListClient({
  initialEvents = [],
}: EventsListClientProps) {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: events = [], isFetching, isLoading } = useGetEventsQuery({
    limit: 48,
    eventType: filter || undefined,
  });

  const sourceEvents =
    events.length > 0 || filter !== '' ? events : initialEvents;

  const displayed = useMemo(
    () => filterEvents(sourceEvents, { search, eventType: '' }),
    [sourceEvents, search],
  );

  const stats = useMemo(() => {
    const donations = sourceEvents.filter(
      (e: CommunityEventRecord) => e.eventType === 'donation',
    );
    const totalRaised = donations.reduce(
      (sum: number, e: CommunityEventRecord) =>
        sum + getDonationProgress(e).raised,
      0,
    );
    return {
      total: sourceEvents.length,
      live: sourceEvents.filter(
        (e: CommunityEventRecord) => e.eventType === 'live_session',
      ).length,
      giving: donations.length,
      raised: totalRaised,
    };
  }, [sourceEvents]);

  const showSkeleton = (isLoading || isFetching) && displayed.length === 0;
  const hasFilters = Boolean(search || filter);
  const spotlight = !hasFilters && displayed.length > 0 ? displayed[0] : null;
  const gridEvents = spotlight ? displayed.slice(1) : displayed;

  return (
    <div className="min-h-[60vh] bg-[#FAF9FC]">
      <section className="relative overflow-hidden border-b border-[#E8D4F4]/50 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(97,17,146,0.09),transparent)]"
          aria-hidden
        />
        <div className="custom-container relative py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8D4F4] bg-[#FCF2FF]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#611192]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              AngelPage community
            </div>
            <h1 className="font-primary text-3xl text-mono-100 md:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Events &amp; giving
            </h1>
            <p className="body-small mx-auto mt-4 max-w-lg text-mono-70 md:text-base">
              Curated drives, live moments, and polls — each with a clear way to
              participate and make a difference.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Events', value: stats.total, accent: 'text-[#611192]' },
              { label: 'Giving', value: stats.giving, accent: 'text-emerald-700' },
              { label: 'Live', value: stats.live, accent: 'text-rose-700' },
              {
                label: 'Raised',
                value:
                  stats.raised > 0 ? `£${stats.raised.toLocaleString()}` : '—',
                accent: 'text-[#611192]',
              },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/6 bg-white/90 px-4 py-4 text-center shadow-xs backdrop-blur-xs"
              >
                <p className={`font-primary text-xl md:text-2xl ${stat.accent}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-mono-70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-mono-20/80 bg-white/90 backdrop-blur-xl">
        <div className="custom-container py-4">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mono-70"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, causes, or hosts…"
                className="w-full rounded-2xl border border-black/6 bg-[#FAF9FC] py-3.5 pl-11 pr-4 text-sm shadow-xs transition focus:border-[#611192] focus:outline-hidden focus:ring-2 focus:ring-[#611192]/10"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FILTER_TABS.map(tab => {
                const Icon = tab.icon;
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id || 'all'}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-[#611192] text-white shadow-md shadow-[#611192]/20'
                        : 'border border-black/6 bg-white text-mono-80 hover:border-[#E8D4F4] hover:bg-[#FCF2FF]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {tab.label}
                  </button>
                );
              })}
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilter('');
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-mono-70 transition hover:bg-[#FCF2FF] hover:text-[#611192]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="custom-container py-10 md:py-14">
        <p className="mb-8 text-center text-sm text-mono-70">
          <span className="font-semibold text-mono-100">{displayed.length}</span>{' '}
          event{displayed.length === 1 ? '' : 's'}
          {search ? ` matching “${search}”` : ''}
        </p>

        {showSkeleton ? (
          <EventsListSkeleton count={6} columns={3} />
        ) : displayed.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-[#E8D4F4] bg-white px-8 py-16 text-center shadow-xs">
            <Calendar
              className="mx-auto h-10 w-10 text-[#611192]/35"
              strokeWidth={1.5}
              aria-hidden
            />
            <h2 className="font-primary mt-4 text-xl text-mono-100">No events found</h2>
            <p className="body-small mt-2 text-mono-70">
              Try a different filter or check back soon for new opportunities.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl space-y-8">
            {spotlight && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#611192]">
                  Featured
                </p>
                <EventCard event={spotlight} variant="featured" />
              </div>
            )}
            {gridEvents.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {gridEvents.map(event => (
                  <EventCard key={event._id} event={event} showActions />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/charity/find-a-charity">
            <Button variant="primary">Find a charity</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="text-primary-color-100!">
              Back to home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
