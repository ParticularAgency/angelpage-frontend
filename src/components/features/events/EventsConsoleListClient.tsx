'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Heart,
  MapPin,
  Radio,
  Search,
  Share2,
  SlidersHorizontal,
  Tag,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import EventShareModal, {
  type EventSharePayload,
} from '@/components/features/events/EventShareModal';
import { EventCardSkeleton, SkeletonLine } from '@/components/common/loading/Skeleton';
import EventDonationModal from '@/components/features/events/EventDonationModal';
import { buildDonationCheckoutUrl } from '@/lib/eventDonationFlow';
import {
  formatEventDate,
  getCountdownLabel,
  getDonationProgress,
  hasActivePoll,
} from '@/components/features/events/eventUtils';
import type { CommunityEventRecord } from '@/lib/server-api';
import { useGetEventsQuery } from '@/store/api/angelpageApi';

type Props = {
  initialEvents?: CommunityEventRecord[];
};

type DisplayType = 'donation' | 'poll' | 'live' | 'volunteer';

type ListingEvent = {
  id: string;
  slug: string;
  type: DisplayType;
  title: string;
  description: string;
  image: string;
  tag: string;
  author: string;
  prospect: string;
  impactText: string;
  location?: string;
  target?: number;
  raised?: number;
  votes?: number;
  endsIn?: string;
  time?: string;
  requiredVolunteers?: number;
  joinedVolunteers?: number;
  startAt?: string;
  endAt?: string;
};

type TabId = 'all' | DisplayType;

const FALLBACK_IMAGES = {
  donation: '/images/events/charity_event_hero.jpg',
  poll: '/images/events/community_poll_bg.jpg',
  live: '/images/events/donation_hands.jpg',
  volunteer: '/images/events/charity_event_hero.jpg',
};

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }> | null;
}> = [
  { id: 'all', label: 'All Initiatives', icon: null },
  { id: 'donation', label: 'Donation Drives', icon: Heart },
  { id: 'poll', label: 'Community Polls', icon: TrendingUp },
  { id: 'live', label: 'Live Streams', icon: Radio },
  { id: 'volunteer', label: 'Volunteer', icon: Users },
];

function getDisplayType(event: CommunityEventRecord): DisplayType {
  if (event.eventType === 'donation') return 'donation';
  if (event.eventType === 'live_session') return 'live';
  if (hasActivePoll(event)) return 'poll';
  return 'volunteer';
}

function tagForType(type: DisplayType): string {
  switch (type) {
    case 'donation':
      return 'FEATURED DIRECT AID';
    case 'poll':
      return 'ACTIVE DEMOCRACY';
    case 'live':
      return 'RADICAL TRANSPARENCY';
    default:
      return 'VOLUNTEER NETWORK';
  }
}

function prospectForType(type: DisplayType, category?: string): string {
  if (category) return category;
  switch (type) {
    case 'donation':
      return 'Direct Food Aid';
    case 'poll':
      return 'Community Guidance';
    case 'live':
      return 'Live Telemetry';
    default:
      return 'Direct Logistics & Care';
  }
}

function impactForEvent(event: CommunityEventRecord, type: DisplayType): string {
  if (type === 'donation') {
    const { goal } = getDonationProgress(event);
    return goal ? `Target £${goal.toLocaleString()}` : 'Direct survival support';
  }
  if (type === 'poll') {
    const votes = (event.pollOptions || []).reduce((s, o) => s + (o.votes || 0), 0);
    return votes ? `Decides community priorities (${votes} votes)` : 'Community budget guidance';
  }
  if (type === 'live') {
    return 'Real-time ground reporting';
  }
  return 'Volunteer coordination & logistics';
}

function toListingEvent(event: CommunityEventRecord): ListingEvent {
  const type = getDisplayType(event);
  const donation = getDonationProgress(event);
  const votes = (event.pollOptions || []).reduce((s, o) => s + (o.votes || 0), 0);
  const countdown = getCountdownLabel(event.startAt);

  return {
    id: event._id,
    slug: event.slug || event._id,
    type,
    title: event.title,
    description:
      event.excerpt ||
      event.description ||
      'Support verified on-ground humanitarian action with full transparency.',
    image:
      event.coverImage ||
      FALLBACK_IMAGES[type === 'volunteer' ? 'volunteer' : type],
    tag: tagForType(type),
    author: event.authorName || 'Angelpage Team',
    prospect: prospectForType(type, event.category),
    impactText: impactForEvent(event, type),
    location: event.category || 'Angelpage Network',
    target: donation.goal || undefined,
    raised: donation.raised || undefined,
    votes: type === 'poll' ? votes : undefined,
    endsIn: event.endAt ? formatEventDate(event.endAt) || undefined : undefined,
    time: countdown || (event.startAt ? formatEventDate(event.startAt) || undefined : undefined),
    requiredVolunteers: type === 'volunteer' ? 15 : undefined,
    joinedVolunteers: type === 'volunteer' ? 8 : undefined,
    startAt: event.startAt,
    endAt: event.endAt,
  };
}

function buildDemoEvents(): ListingEvent[] {
  return [
    {
      id: 'demo-1',
      slug: 'events',
      type: 'donation',
      title: 'Global Food Relief Drive',
      description:
        'Delivering grains, clean oil, infant formulas, and essential sanitization packs directly to isolated families who survived recent devastating flash floods.',
      image: FALLBACK_IMAGES.donation,
      tag: 'FEATURED DIRECT AID',
      author: 'Md. Zakir Hosen',
      target: 10000,
      raised: 6850,
      prospect: 'Direct Food Aid',
      impactText: 'Provides 20,000 warm meals',
      location: 'East Africa Camp',
    },
    {
      id: 'demo-2',
      slug: 'events',
      type: 'poll',
      title: 'Next Resource Allocation Poll',
      description:
        'Your voice determines where our medical supply team deploys next month. Vote now to guide real-world change.',
      image: FALLBACK_IMAGES.poll,
      tag: 'ACTIVE DEMOCRACY',
      author: 'Angelpage Team',
      votes: 316,
      endsIn: '2 days left',
      prospect: 'Community Guidance',
      impactText: 'Decides £50,000 deployment',
      location: 'Consensus Portal',
    },
    {
      id: 'demo-3',
      slug: 'events',
      type: 'live',
      title: 'Emergency Medical Field Report',
      description:
        'Stream directly from our newly built frontline maternal clinics. Hear stories from our surgeons and see the live impact of your gifts.',
      image: FALLBACK_IMAGES.live,
      tag: 'RADICAL TRANSPARENCY',
      author: 'Dr. Sarah Jenkins',
      time: 'In 3 hours',
      prospect: 'Live Telemetry',
      impactText: 'Real-time ground reporting',
      location: 'Maternal Clinic',
    },
    {
      id: 'demo-4',
      slug: 'events',
      type: 'volunteer',
      title: 'Frontline Medical Support Network',
      description:
        'Join our team as a remote telemedicine coordinator or field volunteer. Assist with logistics, dispatch coordinates, and remote administrative triage for medical camps.',
      image: FALLBACK_IMAGES.volunteer,
      tag: 'VOLUNTEER NETWORK',
      author: 'Amina Al-Mansoor',
      requiredVolunteers: 15,
      joinedVolunteers: 8,
      prospect: 'Direct Logistics & Care',
      impactText: 'Triage and dispatch medical supplies',
      location: 'Sanaa Central Clinic',
    },
    {
      id: 'demo-5',
      slug: 'events',
      type: 'volunteer',
      title: 'Digital Distribution Audit Liaison',
      description:
        'Help audit real-time supply chain logs. Work remotely to cross-verify distribution receipts with local on-grid food distribution photos.',
      image: FALLBACK_IMAGES.poll,
      tag: 'AUDIT & TRANSPARENCY',
      author: 'Md. Zakir Hosen',
      requiredVolunteers: 10,
      joinedVolunteers: 6,
      prospect: 'Supply Chain Auditing',
      impactText: 'Audits £100,000 grain transfers',
      location: 'Digital Remote Grid',
    },
  ];
}

function toIcsDate(iso?: string) {
  if (!iso) return '20260715T150000Z';
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function getGoogleCalendarUrl(ev: {
  title: string;
  desc: string;
  start: string;
  end: string;
  location: string;
}) {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.start}/${ev.end}&details=${encodeURIComponent(ev.desc)}&location=${encodeURIComponent(ev.location)}`;
}

function getAppleCalendarUrl(ev: {
  title: string;
  desc: string;
  start: string;
  end: string;
  location: string;
}) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${ev.start}`,
    `DTEND:${ev.end}`,
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.desc}`,
    `LOCATION:${ev.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

type Suggestion = {
  id: string;
  text: string;
  type: 'tag' | 'location';
};

function buildSuggestions(events: ListingEvent[], query: string): Suggestion[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  const pool: Suggestion[] = [];
  events.forEach(event => {
    if (event.title.toLowerCase().includes(term)) {
      pool.push({ id: `${event.id}-title`, text: event.title, type: 'tag' });
    }
    if (event.author.toLowerCase().includes(term)) {
      pool.push({ id: `${event.id}-author`, text: event.author, type: 'tag' });
    }
    if (event.prospect.toLowerCase().includes(term)) {
      pool.push({ id: `${event.id}-prospect`, text: event.prospect, type: 'tag' });
    }
    if (event.location?.toLowerCase().includes(term)) {
      pool.push({ id: `${event.id}-loc`, text: event.location, type: 'location' });
    }
  });

  const unique = Array.from(new Map(pool.map(s => [s.text, s])).values());
  return unique.slice(0, 8);
}

export default function EventsConsoleListClient({ initialEvents = [] }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShareEvent, setSelectedShareEvent] =
    useState<EventSharePayload | null>(null);
  const [donationModal, setDonationModal] = useState<{
    event: CommunityEventRecord;
    amount?: number;
  } | null>(null);

  const { data: apiEvents = [], isLoading } = useGetEventsQuery({ limit: 48 });
  const sourceEvents: CommunityEventRecord[] =
    (apiEvents as CommunityEventRecord[]).length > 0
      ? (apiEvents as CommunityEventRecord[])
      : initialEvents;

  const eventRecordById = useMemo(() => {
    const map = new Map<string, CommunityEventRecord>();
    sourceEvents.forEach(event => map.set(event._id, event));
    return map;
  }, [sourceEvents]);

  const allListingEvents = useMemo(() => {
    const mapped = sourceEvents.map(toListingEvent);
    return mapped.length > 0 ? mapped : buildDemoEvents();
  }, [sourceEvents]);

  const stats = useMemo(() => {
    const giving = allListingEvents.filter(e => e.type === 'donation').length;
    const polls = allListingEvents.filter(e => e.type === 'poll').length;
    const live = allListingEvents.filter(e => e.type === 'live').length;
    const totalRaised = allListingEvents
      .filter(e => e.type === 'donation')
      .reduce((sum, e) => sum + (e.raised || 0), 0);

    return [
      {
        label: 'ACTIVE CAMPAIGNS',
        value: String(allListingEvents.length).padStart(2, '0'),
        color: 'text-[#611192]',
        desc: 'Direct humanitarian aid',
      },
      {
        label: 'DEMOCRATIC POLLS',
        value: String(polls).padStart(2, '0'),
        color: 'text-slate-800',
        desc: 'Decentralized funding control',
      },
      {
        label: 'LIVE BROADCASTS',
        value: String(live).padStart(2, '0'),
        color: 'text-red-600',
        desc: 'Real-time telemetry',
      },
      {
        label: 'TOTAL DISBURSED',
        value: totalRaised ? `£${(totalRaised / 1000).toFixed(1)}K` : '£2.4M',
        color: 'text-blue-950',
        desc: 'Zero administrative leakage',
      },
    ];
  }, [allListingEvents]);

  const filteredEvents = useMemo(() => {
    return allListingEvents.filter(event => {
      const matchesTab = activeTab === 'all' || event.type === activeTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.author.toLowerCase().includes(q) ||
        (event.location && event.location.toLowerCase().includes(q)) ||
        event.prospect.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [allListingEvents, activeTab, searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = window.setTimeout(() => {
      setSuggestions(buildSuggestions(allListingEvents, searchQuery));
      setIsLoadingSuggestions(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [searchQuery, allListingEvents]);

  const openShare = (event: ListingEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedShareEvent({
      id: event.slug,
      title: event.title,
      description: event.description,
      tag: event.tag,
      url:
        typeof window !== 'undefined'
          ? `${window.location.origin}/events/${event.slug}`
          : `/events/${event.slug}`,
    });
    setIsShareOpen(true);
  };

  const actionLabel = (type: DisplayType) => {
    if (type === 'donation') return 'Support Cause';
    if (type === 'poll') return 'Cast Vote';
    if (type === 'live') return 'Join Stream';
    return 'Apply to Volunteer';
  };

  const openDonation = (event: ListingEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const record = eventRecordById.get(event.id);
    router.push(
      buildDonationCheckoutUrl(
        { slug: record?.slug || event.slug },
        { amount: 50 },
      ),
    );
  };

  if (isLoading && allListingEvents.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCF2FF] py-16">
        <div className="mx-auto max-w-7xl px-8 sm:px-4">
          <div className="mb-8 flex flex-col gap-3">
            <SkeletonLine className="h-3 w-40" />
            <SkeletonLine className="h-8 w-72" />
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FCF2FF] py-16 text-[#0B0112]">
      <div className="relative z-10 mx-auto max-w-7xl px-8 sm:px-4">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[#611192]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to home
        </Link>

        <div className="mb-12 rounded-3xl bg-white px-8 py-8 sm:px-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
            Giving
          </p>
          <h1 className="mt-3 font-primary text-[48px] leading-none text-[#0B0112] sm:text-[34px]">
            Events
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#3B055C]">
            Appeals, votes, and live moments from the Angelpage community. Open an event to read it, share it, or give.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['90% to charity', 'Secure checkout', 'USA first, Canada & UK'].map(
              item => (
                <span
                  key={item}
                  className="rounded-full bg-[#F2E8F8] px-3 py-1 text-[12px] font-medium text-[#611192]"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mb-14 grid grid-cols-4 gap-5 lg:mb-8 lg:grid-cols-2 sm:-mx-4 sm:mb-8 sm:flex sm:snap-x sm:snap-mandatory sm:grid-cols-1 sm:gap-4 sm:overflow-x-auto sm:px-4 sm:pb-4 sm:scrollbar-none">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="group relative w-auto overflow-hidden rounded-2xl border border-[#E6E3E7] bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md sm:w-[260px] sm:shrink-0 sm:snap-align-start"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-slate-200 transition-colors group-hover:bg-[#611192]" />
              <div className={`mb-1 font-primary text-4xl font-bold md:text-3xl sm:text-2xl ${stat.color}`}>
                {stat.value}
              </div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-1 sm:text-[9px]">
                {stat.label}
              </div>
              <p className="text-xs font-light leading-snug text-slate-600">{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 flex flex-row items-center justify-between gap-4 rounded-3xl border border-[#E6E3E7] bg-white p-5 shadow-xs lg:flex-col">
          <div className="relative w-96 lg:w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search by target, coordinator, tag..."
              className="w-full rounded-xl border border-[#E6E3E7] bg-slate-50 py-3 pl-11 pr-4 font-sans text-xs text-slate-900 placeholder-slate-400 transition-all focus:border-blue-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900/10"
            />
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />

            <AnimatePresence>
              {showSuggestions && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-hidden overflow-y-auto rounded-2xl border border-[#E6E3E7] bg-white shadow-xl"
                >
                  {isLoadingSuggestions ? (
                    <div className="flex items-center gap-2 p-4 font-mono text-xs text-slate-400">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-900 border-t-transparent" />
                      Fetching suggestions...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="py-2">
                      <div className="mb-1 border-b border-slate-150 px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Suggested Results
                      </div>
                      {suggestions.map(suggestion => {
                        const Icon = suggestion.type === 'location' ? MapPin : Tag;
                        return (
                          <button
                            key={suggestion.id}
                            type="button"
                            onMouseDown={e => {
                              e.preventDefault();
                              setSearchQuery(suggestion.text);
                              setShowSuggestions(false);
                            }}
                            className="group flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <Icon
                                className={`h-3.5 w-3.5 shrink-0 ${suggestion.type === 'location' ? 'text-emerald-500' : 'text-[#611192]'}`}
                                aria-hidden
                              />
                              <span className="truncate text-xs font-medium text-slate-700 group-hover:text-slate-900">
                                {suggestion.text}
                              </span>
                            </div>
                            <span className="shrink-0 rounded-sm bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-slate-500 group-hover:bg-blue-50 group-hover:text-[#611192]">
                              {suggestion.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 font-mono text-xs font-light text-slate-500">
                      No matches found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex w-auto shrink-0 justify-end gap-1.5 lg:-mx-5 lg:w-full lg:snap-x lg:overflow-x-auto lg:px-5 lg:pb-2 lg:scrollbar-none sm:-mx-5 sm:w-full sm:snap-x sm:overflow-x-auto sm:px-5 sm:pb-2 sm:scrollbar-none">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 snap-align-start items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-3 text-xs font-semibold tracking-wider transition-all duration-300 active:scale-95 ${
                    activeTab === tab.id
                      ? 'border-blue-900 bg-[#611192] text-white shadow-md shadow-blue-900/10'
                      : 'border-[#E6E3E7] bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-[#E6E3E7] pb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            FEED // Showing {filteredEvents.length} Verified Initiatives
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Sorting: Dynamic Relevance
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map(event => {
                  const percent =
                    event.raised && event.target
                      ? Math.round((event.raised / event.target) * 100)
                      : 0;
                  const calStart = toIcsDate(event.startAt);
                  const calEnd = toIcsDate(event.endAt || event.startAt);
                  const calPayload = {
                    title: event.title,
                    desc: event.description,
                    start: calStart,
                    end: calEnd,
                    location: event.location || 'Angelpage Network',
                  };

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => router.push(`/events/${event.slug}`)}
                      className="group flex cursor-pointer flex-row overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white transition duration-300 hover:border-[#611192] md:flex-col"
                    >
                      <div className="relative h-auto min-h-[220px] w-[35%] shrink-0 overflow-hidden bg-[#FCF2FF] md:h-56 md:w-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 35vw"
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-[#611192] px-3 py-1 text-[11px] font-medium text-white">
                          {event.type}
                        </div>
                      </div>

                      <div className="relative flex w-[65%] flex-col justify-between bg-white p-8 md:w-full lg:p-6 sm:p-5">
                        <div className="absolute right-6 top-6 z-20 flex items-center gap-2 sm:hidden">
                          <button
                            type="button"
                            onClick={e => openShare(event, e)}
                            className="flex items-center gap-1.5 rounded-full border border-[#E6E3E7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#611192]"
                            title="Share this appeal"
                          >
                            <Share2 className="h-3 w-3 text-[#611192]" aria-hidden />
                            <span>Share</span>
                          </button>

                          <div className="group/cal relative">
                            <button
                              type="button"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1.5 rounded-xl border border-[#E6E3E7] bg-slate-50 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-950"
                              title="Add to Calendar"
                            >
                              <Calendar className="h-3 w-3 text-[#611192]" aria-hidden />
                              <span>Calendar</span>
                            </button>

                            <div className="absolute right-0 z-30 mt-1.5 hidden w-40 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-white shadow-xl group-hover/cal:block">
                              <a
                                href={getGoogleCalendarUrl(calPayload)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-2 border-b border-slate-800/50 px-3.5 py-2.5 text-[10px] text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                Google Calendar
                              </a>
                              <a
                                href={getAppleCalendarUrl(calPayload)}
                                download={`${event.title.replace(/\s+/g, '_')}.ics`}
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-2 px-3.5 py-2.5 text-[10px] text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Apple / iCal
                              </a>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#611192]">
                                {event.tag}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="font-mono text-[10px] font-medium uppercase text-slate-500">
                                {event.prospect}
                              </span>
                            </div>

                            <div
                              className="hidden items-center gap-1.5 sm:flex"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={e => openShare(event, e)}
                                className="rounded-xl border border-[#E6E3E7] bg-slate-50 p-2 text-slate-600 shadow-xs transition-all active:scale-95"
                                title="Share this appeal"
                              >
                                <Share2 className="h-3.5 w-3.5 text-[#611192]" aria-hidden />
                              </button>
                            </div>
                          </div>

                          <h3 className="mb-2 font-primary text-2xl font-semibold leading-tight text-slate-950 transition-colors group-hover:text-[#611192] md:text-xl sm:text-lg">
                            {event.title}
                          </h3>

                          <p className="mb-6 text-sm font-light leading-relaxed text-slate-600 lg:text-xs">
                            {event.description}
                          </p>
                        </div>

                        <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          {event.type === 'donation' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[10px] font-medium uppercase text-slate-500">
                                  PLEDGE STATUS
                                </span>
                                <span className="font-mono text-xs font-bold text-[#611192]">
                                  {percent}% RAISED
                                </span>
                              </div>
                              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${percent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="h-full rounded-full bg-[#611192]"
                                />
                              </div>
                              <div className="flex items-center justify-between pt-1 text-[11px] font-medium">
                                <span className="text-slate-700">
                                  £{event.raised?.toLocaleString()} of £
                                  {event.target?.toLocaleString()} secured
                                </span>
                                <span className="font-bold text-[#611192]">
                                  🎯 {event.impactText}
                                </span>
                              </div>
                            </div>
                          )}

                          {event.type === 'poll' && (
                            <div className="flex flex-row items-center justify-between gap-2 text-xs sm:flex-col sm:items-start">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#611192]" />
                                <span className="font-medium text-slate-700">
                                  Community Consensus:{' '}
                                  <strong className="text-slate-950">
                                    {event.votes} votes logged
                                  </strong>
                                </span>
                              </div>
                              <span className="font-mono text-[11px] font-bold uppercase text-[#611192]">
                                🎯 Impact: {event.impactText}
                              </span>
                            </div>
                          )}

                          {event.type === 'live' && (
                            <div className="flex flex-row items-center justify-between gap-2 text-xs sm:flex-col sm:items-start">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 animate-ping rounded-full bg-red-600" />
                                <span className="font-medium text-slate-700">
                                  Telemetry Briefing:{' '}
                                  <strong className="text-slate-950">{event.time}</strong>
                                </span>
                              </div>
                              <span className="animate-pulse font-mono text-[11px] font-bold uppercase text-red-600">
                                🎯 Broadcast: {event.impactText}
                              </span>
                            </div>
                          )}

                          {event.type === 'volunteer' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[10px] font-medium uppercase text-slate-500">
                                  VOLUNTEER FILL RATE
                                </span>
                                <span className="font-mono text-xs font-bold text-[#611192]">
                                  {event.requiredVolunteers
                                    ? Math.round(
                                        ((event.joinedVolunteers || 0) /
                                          event.requiredVolunteers) *
                                          100,
                                      )
                                    : 0}
                                  % CAPACITY
                                </span>
                              </div>
                              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: event.requiredVolunteers
                                      ? `${Math.round(((event.joinedVolunteers || 0) / event.requiredVolunteers) * 100)}%`
                                      : '0%',
                                  }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="h-full rounded-full bg-[#611192]"
                                />
                              </div>
                              <div className="flex items-center justify-between pt-1 text-[11px] font-medium">
                                <span className="text-slate-700">
                                  {event.joinedVolunteers} of {event.requiredVolunteers}{' '}
                                  positions pledged
                                </span>
                                <span className="font-bold text-[#611192]">
                                  🎯 {event.impactText}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E6E3E7] bg-slate-100">
                              <User className="h-4 w-4 text-slate-600" aria-hidden />
                            </div>
                            <div>
                              <span className="block font-mono text-[11px] font-semibold uppercase leading-none text-slate-400">
                                Coordinator
                              </span>
                              <span className="text-[11px] font-medium text-slate-800">
                                {event.author}
                              </span>
                            </div>
                          </div>

                          {event.type === 'donation' || event.type === 'volunteer' ? (
                            <button
                              type="button"
                              onClick={e => openDonation(event, e)}
                              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#611192] transition-colors hover:text-slate-950"
                            >
                              {event.type === 'donation' ? 'Support cause' : 'Give'}
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                            </button>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#611192] transition-colors group-hover:text-slate-950">
                              {actionLabel(event.type)}
                              <ArrowRight className="h-4 w-4 text-[#611192] transition-transform group-hover:translate-x-1.5 group-hover:text-slate-950" />
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E6E3E7] bg-white py-20 text-center shadow-xs">
                <p className="mb-3 text-sm font-light text-slate-400">
                  No matching initiatives found
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                  className="rounded-xl border border-blue-900/20 bg-blue-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#611192] shadow-xs transition-all hover:bg-[#611192] hover:text-white"
                >
                  Reset Portal Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <EventShareModal
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setSelectedShareEvent(null);
        }}
        event={selectedShareEvent}
      />

      <EventDonationModal
        open={Boolean(donationModal)}
        event={donationModal?.event ?? null}
        defaultAmount={donationModal?.amount}
        onClose={() => setDonationModal(null)}
      />
    </div>
  );
}
