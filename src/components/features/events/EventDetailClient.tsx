'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Play,
  Quote,
  Radio,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { sanitizeHtml } from '@/lib/sanitize';
import type { CommunityEventRecord } from '@/lib/server-api';
import { useGetEventBySlugQuery, useGetEventsQuery } from '@/store/api/angelpageApi';
import EventAttendanceTicket from './EventAttendanceTicket';
import EventConfetti from './EventConfetti';
import EventShareModal, { type EventSharePayload } from './EventShareModal';
import EventDonationModal from './EventDonationModal';
import { buildDonationCheckoutUrl } from '@/lib/eventDonationFlow';
import {
  formatEventDate,
  formatEventTime,
  getAppleCalendarUrl,
  getDisplayEventType,
  getDonationProgress,
  getEventTiming,
  getGoogleCalendarUrl,
  hasActivePoll,
  resolveEventFunds,
  toIcsDate,
} from './eventUtils';

type EventDetailClientProps = {
  slug: string;
  initialEvent?: CommunityEventRecord | null;
};

const FALLBACK_IMAGES = {
  donation: '/images/events/charity_event_hero.jpg',
  poll: '/images/events/community_poll_bg.jpg',
  live: '/images/events/donation_hands.jpg',
  general: '/images/events/charity_event_hero.jpg',
};

const voteStorageKey = (eventId: string) => `angelpage-event-poll-${eventId}`;

function getEventTag(displayType: string) {
  if (displayType === 'donation') return 'FEATURED DIRECT AID';
  if (displayType === 'poll') return 'ACTIVE DEMOCRACY';
  if (displayType === 'live') return 'RADICAL TRANSPARENCY';
  return 'VERIFIED INITIATIVE';
}

function getImpactStats(
  event: CommunityEventRecord,
  displayType: string,
  donation: { raised: number; goal: number; percent: number },
  pollVotes: number,
) {
  if (displayType === 'donation') {
    return [
      { label: 'Meals Delivered', value: `${Math.max(1, Math.round(donation.raised / 2)).toLocaleString()}+` },
      { label: 'Funds Raised', value: `£${donation.raised.toLocaleString()}` },
      { label: 'Goal Progress', value: `${donation.percent}%` },
    ];
  }
  if (displayType === 'poll') {
    return [
      { label: 'Votes Logged', value: pollVotes.toLocaleString() },
      { label: 'Options', value: String(event.pollOptions?.length || 3) },
      { label: 'Status', value: 'Active' },
    ];
  }
  if (displayType === 'live') {
    return [
      { label: 'Broadcast', value: 'Live' },
      { label: 'Category', value: event.category || 'Healthcare' },
      { label: 'Coordinator', value: event.authorName?.split(' ')[0] || 'Team' },
    ];
  }
  return [
    { label: 'Category', value: event.category || 'Community' },
    { label: 'Type', value: 'Open' },
    { label: 'Coordinator', value: event.authorName?.split(' ')[0] || 'Team' },
  ];
}

function getProspects(event?: CommunityEventRecord | null) {
  const displayType = event ? getDisplayEventType(event) : 'general';
  if (displayType === 'donation') {
    const funds = resolveEventFunds(event);
    return funds.map(fund => ({
      title: fund.percent ? `${fund.percent}% ${fund.label}` : fund.label,
      desc: fund.description || '',
    }));
  }
  if (displayType === 'poll') {
    return [
      { title: 'Democratic Allocation', desc: 'Budget shifts based on final poll percentages.' },
      { title: 'Live Progress Logs', desc: 'Voters receive telemetry updates when deployments move.' },
    ];
  }
  return [
    { title: 'Radical Transparency', desc: 'See the physical impact of community contributions.' },
    { title: 'Interactive QA', desc: 'Connect with coordinators and field teams directly.' },
  ];
}

const DEMO_FEELINGS = [
  {
    name: 'Amara (Mother of 3)',
    message:
      'The support arrived when we needed it most. Knowing people miles away think of us gives us strength to rebuild.',
    sentiment: 'Overwhelming Relief',
  },
  {
    name: 'Elder Yusuf',
    message:
      'It is not just about supplies. It is about dignity. Delivering with respect makes us feel we are one human family.',
    sentiment: 'Restored Dignity',
  },
];

const DEMO_DONOR_QUOTES = [
  {
    name: 'Clara M.',
    location: 'London, UK',
    quote:
      'Knowing my gift translates directly on the ground without bureaucratic delay gives me complete confidence.',
    amount: '£150',
    time: '3 hours ago',
  },
  {
    name: 'David K.',
    location: 'Edinburgh',
    quote:
      'Seeing actual field reports makes this the only charity platform I fully trust now.',
    amount: '£75',
    time: 'Yesterday',
  },
  {
    name: 'Maya R.',
    location: 'Bristol',
    quote:
      'The live progress feedback is stunning. Even a small contribution feeds a family for a week.',
    amount: '£25',
    time: '3 days ago',
  },
];

const TOP_DONORS_SEED = [
  { name: 'Sophia L.', amount: 2500, badge: 'Global Trustee', location: 'London, UK' },
  { name: 'Md. Zakir Hosen', amount: 1200, badge: 'Lead Catalyst', location: 'Dhaka, BD' },
  { name: 'Aris Thorne', amount: 850, badge: 'Core Patron', location: 'New York, US' },
];

export default function EventDetailClient({ slug, initialEvent }: EventDetailClientProps) {
  const router = useRouter();
  const { data: fetchedEvent, isLoading } = useGetEventBySlugQuery(slug, { skip: !slug });
  const { data: relatedEvents = [] } = useGetEventsQuery({ limit: 12 });
  const resolved = fetchedEvent ?? initialEvent;

  const [pollOptions, setPollOptions] = useState<{ text: string; votes?: number }[]>(
    resolved?.pollOptions ?? [],
  );
  const [votedIdx, setVotedIdx] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorNameInput, setDonorNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCinematicOverlay, setShowCinematicOverlay] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [raisedAmt, setRaisedAmt] = useState(0);
  const [topDonors, setTopDonors] = useState(TOP_DONORS_SEED);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationDefaultAmount, setDonationDefaultAmount] = useState(50);

  useEffect(() => {
    if (!resolved) return;
    setPollOptions(resolved.pollOptions ?? []);
    setRaisedAmt(Number(resolved.donationRaised) || 0);
    setTicketId(`AP-TKT-${resolved._id.slice(-6).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
    setSuccess(false);
    setShowCinematicOverlay(false);
    setVotedIdx(null);
    setHasVoted(false);
    try {
      const stored = localStorage.getItem(voteStorageKey(resolved._id));
      if (stored) {
        setHasVoted(true);
        setVotedIdx(Number(stored));
      }
    } catch {
      /* ignore */
    }
  }, [resolved?._id]);

  const displayType = resolved ? getDisplayEventType(resolved) : 'general';
  const timing = resolved ? getEventTiming(resolved) : 'open';
  const donation = resolved ? getDonationProgress(resolved) : { raised: 0, goal: 0, percent: 0 };
  const pollVotesTotal = pollOptions.reduce(
    (sum: number, opt: { votes?: number }) => sum + (opt.votes || 0),
    0,
  );
  const percentProgress =
    donation.goal > 0 ? Math.min(100, Math.round((raisedAmt / donation.goal) * 100)) : 0;
  const finalDonationValue = selectedAmount || Number(customAmount) || 0;

  const coverImage =
    resolved?.coverImage ||
    FALLBACK_IMAGES[displayType as keyof typeof FALLBACK_IMAGES] ||
    FALLBACK_IMAGES.general;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/events/${slug}`
      : `/events/${slug}`;

  const recommended = useMemo(() => {
    if (!resolved) return [];
    const events = relatedEvents as CommunityEventRecord[];
    const others = events.filter(e => e._id !== resolved._id && e.slug !== slug);
    const sameCategory = others.filter(e => e.category && e.category === resolved.category);
    return (sameCategory.length >= 3 ? sameCategory : others).slice(0, 3);
  }, [relatedEvents, resolved, slug]);

  const calPayload = useMemo(() => {
    if (!resolved) return null;
    return {
      title: resolved.title,
      desc: resolved.excerpt,
      start: toIcsDate(resolved.startAt),
      end: toIcsDate(resolved.endAt || resolved.startAt),
      location: resolved.category || 'Angelpage Network',
    };
  }, [resolved]);

  const shareEvent: EventSharePayload | null = resolved
    ? {
        id: resolved.slug,
        title: resolved.title,
        description: resolved.excerpt,
        tag: getEventTag(displayType),
        url: shareUrl,
      }
    : null;

  const triggerCelebration = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 5000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch {
      ToastService.error('Could not copy link.');
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (!resolved || hasVoted) return;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${resolved._id}/poll/vote`,
      { optionIndex },
    );
    const updated = res.data.pollOptions as { text: string; votes: number }[];
    setPollOptions(updated);
    setVotedIdx(optionIndex);
    setHasVoted(true);
    localStorage.setItem(voteStorageKey(resolved._id), String(optionIndex));
    return updated;
  };

  const openDonationCheckout = (amount: number) => {
    if (!resolved?.slug) return;
    router.push(buildDonationCheckoutUrl(resolved, { amount }));
  };

  const handleActionSubmit = async () => {
    if (!resolved) return;
    setIsSubmitting(true);

    try {
      if (displayType === 'poll') {
        if (votedIdx === null) return;
        await handleVote(votedIdx);
      } else if (displayType === 'donation') {
        if (finalDonationValue <= 0) return;
        openDonationCheckout(finalDonationValue);
        return;
      } else if (displayType === 'live' && resolved.liveStreamUrl) {
        window.open(resolved.liveStreamUrl, '_blank', 'noopener,noreferrer');
      }

      setSuccess(true);
      setShowCinematicOverlay(true);
      triggerCelebration();
    } catch {
      ToastService.error('Action could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDonate = (amt: number) => {
    openDonationCheckout(amt);
  };

  const handleSocialShare = (platform: string) => {
    if (!resolved) return;
    let shareText = `Support "${resolved.title}" on Angelpage — verified direct impact:`;
    if (displayType === 'poll') {
      shareText = `Cast your vote on "${resolved.title}" on Angelpage:`;
    } else if (displayType === 'live') {
      shareText = `Join the live stream "${resolved.title}" on Angelpage:`;
    }
    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    } else {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading && !initialEvent) {
    return <FullScreenLoader label="Loading event" />;
  }

  if (!resolved) {
    return (
      <section className="custom-container py-24 text-center">
        <h1 className="font-primary text-3xl text-slate-950">Event not found</h1>
        <Link href="/events" className="mt-8 inline-block">
          <Button variant="primary">Browse events</Button>
        </Link>
      </section>
    );
  }

  const safeDescription = sanitizeHtml(resolved.description || resolved.excerpt || '');
  const longDesc = resolved.excerpt || 'This initiative is executed with complete transparency and verified ground impact.';
  const impactStats = getImpactStats(resolved, displayType, donation, pollVotesTotal);
  const prospects = getProspects(resolved);
  const eventDate = formatEventDate(resolved.startAt) || 'Date TBC';
  const eventTime = formatEventTime(resolved.startAt) || 'Time TBC';
  const eventLocation = resolved.category || 'Angelpage Network';

  return (
    <div className="relative min-h-screen bg-[#FCF2FF] pb-16 text-[#0B0112]">
      <EventConfetti active={confettiActive} />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30"
        aria-hidden
      />

      {/* Success overlay */}
      <AnimatePresence>
        {showCinematicOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl md:p-6"
            >
              <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                <Check className="h-7 w-7 stroke-[3px] text-[#611192]" aria-hidden />
              </div>
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#611192]">
                Gift confirmed
              </span>

              {displayType === 'donation' ? (
                <>
                  <h2 className="mb-2 font-primary text-3xl font-bold text-slate-950 md:text-2xl">
                    Thank you for giving
                  </h2>
                  <div className="my-5">
                    <span className="font-mono text-5xl font-bold text-primary-color-100 md:text-4xl">
                      ${animatedValue || finalDonationValue}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      Allocated to your selected fund
                    </span>
                  </div>
                </>
              ) : displayType === 'poll' ? (
                <>
                  <h2 className="mb-2 font-primary text-3xl font-bold text-slate-950 md:text-2xl">
                    Vote Registered
                  </h2>
                  <div className="my-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                    <CheckCircle className="h-3.5 w-3.5 text-[#611192]" aria-hidden />
                    Vote saved
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-2 font-primary text-3xl font-bold text-slate-950 md:text-2xl">
                    RSVP Confirmed
                  </h2>
                  <div className="my-4 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-700">
                    <Radio className="h-3.5 w-3.5 animate-pulse text-red-600" aria-hidden />
                    Alert Activated
                  </div>
                </>
              )}

              <div className="mb-6 text-left">
                <EventAttendanceTicket
                  eventTitle={resolved.title}
                  eventDate={eventDate}
                  eventLocation={eventLocation}
                  ticketId={ticketId}
                />
              </div>

              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  BROADCAST YOUR IMPACT
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialShare('twitter')}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Twitter / X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCinematicOverlay(false);
                    router.push('/reels');
                  }}
                  className="flex-1 rounded-xl bg-[#611192] py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#3B055C]"
                >
                  Watch Category Reels
                </button>
                <button
                  type="button"
                  onClick={() => setShowCinematicOverlay(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-850"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky header */}
      <div className="sticky top-[80px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3.5 text-xs tracking-wider lg:px-6 sm:px-4">
          <Link
            href="/events"
            className="flex items-center gap-2 font-bold uppercase text-slate-500 transition-colors hover:text-[#611192]"
          >
            ← Back to events
          </Link>
          <div className="hidden items-center gap-2 font-medium text-slate-400 sm:flex">
            <Link href="/" className="hover:text-[#611192]">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-[#611192]">
              Events
            </Link>
            <span>/</span>
            <span className="max-w-[200px] truncate font-bold text-[#611192]">{resolved.title}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-[11px] font-bold text-slate-800 transition-all hover:bg-slate-200"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-600" aria-hidden />
            <span>{copyStatus || 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative flex min-h-[400px] w-full items-end overflow-hidden border-b border-slate-200 bg-slate-950 py-10 md:min-h-[320px]">
        <Image
          src={coverImage}
          alt={resolved.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0112]/80 via-[#0B0112]/25 to-[#0B0112]/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 lg:px-6 sm:px-4">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xs">
            {getEventTag(displayType)}
          </div>
          <h1 className="mb-3 max-w-4xl font-primary text-6xl font-bold leading-tight text-white drop-shadow-xs lg:text-5xl md:text-4xl sm:text-3xl">
            {resolved.title}
          </h1>
          <p className="mb-6 max-w-2xl text-sm font-light leading-relaxed text-slate-300 lg:text-xs">
            {resolved.excerpt}
          </p>

          <div className="flex w-full flex-row items-center justify-between gap-4 font-mono text-xs text-white md:flex-col md:items-start">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xs">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xs">
                <Clock className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden />
                <span>{eventTime}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden />
                <span className="max-w-[200px] truncate xs:max-w-[130px]">{eventLocation}</span>
              </div>
            </div>

            <div className="flex w-auto shrink-0 items-center gap-2 md:w-full">
              {calPayload && (
                <div className="group relative flex-1 md:flex-none">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-[#611192] px-4 py-2.5 font-bold text-white shadow-md transition-all hover:bg-[#3B055C] active:scale-95 sm:py-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    <span>Calendar</span>
                  </button>
                  <div className="absolute bottom-full left-0 z-40 mb-2 hidden w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-white shadow-xl group-hover:block group-focus-within:block sm:bottom-auto sm:right-0 sm:top-full sm:mb-0 sm:mt-2 sm:left-auto">
                    <a
                      href={getGoogleCalendarUrl(calPayload)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 border-b border-slate-800/50 px-4 py-2.5 text-xs text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Google Calendar
                    </a>
                    <a
                      href={getAppleCalendarUrl(calPayload)}
                      download={`${resolved.title.replace(/\s+/g, '_')}.ics`}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Apple / iCal
                    </a>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-700 px-4 py-2.5 font-bold text-white shadow-md transition-all hover:bg-emerald-800 active:scale-95 md:flex-none sm:py-1.5"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main bento layout */}
      <div className="relative z-10 mx-auto mt-10 max-w-7xl px-8 lg:px-6 sm:px-4">
        <div className="grid grid-cols-12 items-start gap-8 lg:grid-cols-1">
          {/* Left column */}
          <div className="col-span-8 space-y-6 lg:col-span-full">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6">
              <h2 className="mb-4 font-primary text-2xl font-bold text-slate-950 md:text-xl">
                Core Mission Overview
              </h2>
              {safeDescription ? (
                <div
                  className="prose prose-sm mb-6 max-w-none font-light leading-relaxed text-slate-600 md:prose-base"
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
              ) : (
                <p className="mb-6 text-sm font-light leading-relaxed text-slate-600">{longDesc}</p>
              )}

              {displayType === 'donation' && donation.goal > 0 && (
                <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="mb-2 flex items-end justify-between text-xs">
                    <span className="font-mono text-[10px] font-semibold uppercase text-slate-500">
                      Where gifts go
                    </span>
                    <span className="text-sm font-bold text-[#611192]">
                      {percentProgress}% of £{donation.goal.toLocaleString()} Raised
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentProgress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full bg-[#611192]"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between font-mono text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-[#611192]">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      £{raisedAmt.toLocaleString()} committed on-grid
                    </span>
                    <span>Target: £{donation.goal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 md:grid-cols-1">
                {impactStats.map(stat => (
                  <div key={stat.label} className="text-center">
                    <span className="block font-primary text-3xl font-bold text-[#611192] md:text-2xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {displayType === 'donation' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6">
                <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <ShieldCheck className="h-5 w-5 text-[#611192]" aria-hidden />
                  <h3 className="font-primary text-xl font-bold text-slate-950 md:text-lg">
                    Trust Ledger Allocation Rules
                  </h3>
                </div>
                <div className="space-y-3">
                  {prospects.map((prospect, idx) => (
                    <div
                      key={prospect.title}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-900/30"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 font-mono text-xs font-bold text-slate-800">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                          {prospect.title}
                        </h4>
                        <p className="mt-1 text-[11px] font-light leading-relaxed text-slate-600">
                          {prospect.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6">
              <div className="mb-6 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Quote className="h-5 w-5 text-[#611192]" aria-hidden />
                <div>
                  <h3 className="font-primary text-xl font-bold text-slate-950 md:text-lg">
                    Beneficiary Sentiment Analysis
                  </h3>
                  <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                    Audited ground-truth emotional logs
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                {DEMO_FEELINGS.map(feel => (
                  <div
                    key={feel.name}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{feel.name}</span>
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-[#611192]">
                        {feel.sentiment}
                      </span>
                    </div>
                    <p className="text-xs font-light italic leading-relaxed text-slate-600">
                      &ldquo;{feel.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {displayType === 'poll' && resolved.pollQuestion && (
              <div
                id="poll"
                className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6"
              >
                <div className="mb-6 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <BarChart3 className="h-5 w-5 text-[#611192]" aria-hidden />
                  <div>
                    <h3 className="font-primary text-xl font-bold text-slate-950 md:text-lg">
                      Community Consensus Poll
                    </h3>
                    <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                      {pollVotesTotal} votes logged
                    </p>
                  </div>
                </div>
                <h4 className="mb-4 text-sm font-semibold leading-relaxed text-slate-900">
                  {resolved.pollQuestion}
                </h4>
                <div className="space-y-2.5">
                  {pollOptions.map((option, idx) => {
                    const pct =
                      pollVotesTotal > 0
                        ? Math.round(((option.votes || 0) / pollVotesTotal) * 100)
                        : 0;
                    const isSelected = votedIdx === idx;
                    if (hasVoted) {
                      return (
                        <div key={option.text} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-medium ${isSelected ? 'font-bold text-[#611192]' : 'text-slate-600'}`}
                            >
                              {isSelected && '✓ '}
                              {option.text}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-slate-900">
                              {pct}% ({option.votes || 0} votes)
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${isSelected ? 'bg-[#611192]' : 'bg-slate-400'}`}
                            />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={option.text}
                        type="button"
                        onClick={() => setVotedIdx(idx)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-blue-900 bg-blue-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-900/30'
                        }`}
                      >
                        <span>{option.text}</span>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Select →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Award className="h-5 w-5 text-[#611192]" aria-hidden />
                  <div>
                    <h3 className="font-primary text-xl font-bold text-slate-950 md:text-lg">
                      Past Donors&apos; Ledger
                    </h3>
                    <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                      Verified public feedback logs
                    </p>
                  </div>
                </div>
                <div className="hidden items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 sm:flex">
                  <Heart className="h-3.5 w-3.5 fill-red-500/10 text-red-600" aria-hidden />
                  <span>Verified Angels</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
                {DEMO_DONOR_QUOTES.map(quote => (
                  <div
                    key={quote.name}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4.5"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between border-b border-slate-200/50 pb-2">
                        <div>
                          <span className="block text-xs font-bold leading-tight text-slate-900">
                            {quote.name}
                          </span>
                          <span className="block font-mono text-[9px] font-semibold uppercase text-slate-400">
                            {quote.location}
                          </span>
                        </div>
                        <span className="rounded-full border border-slate-300 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-800">
                          {quote.amount}
                        </span>
                      </div>
                      <p className="text-[11px] font-light italic leading-relaxed text-slate-600">
                        &ldquo;{quote.quote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3 font-mono text-[9px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 stroke-[3px] text-emerald-500" aria-hidden />
                        Impact Checked
                      </span>
                      <span>{quote.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-8 shadow-xs md:p-6">
              <div className="flex flex-row items-center justify-between gap-6 md:flex-col">
                <div>
                  <h3 className="mb-1 font-primary text-lg font-bold text-slate-950 md:text-base">
                    Encourage Others to Act
                  </h3>
                  <p className="max-w-md text-xs font-light leading-relaxed text-slate-500">
                    Humanitarian progress accelerates when the community spreads the word.
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2 md:w-full md:justify-start">
                  <button
                    type="button"
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-50"
                  >
                    Twitter / X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 transition-all hover:bg-emerald-100"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-6">
              <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <Image src={coverImage} alt="" fill className="object-cover opacity-80 mix-blend-luminosity" />
                    <Play className="absolute h-4 w-4 text-[#611192]" fill="currentColor" aria-hidden />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Watch Recipient Testimonials
                    </h4>
                    <p className="mt-0.5 text-[10px] font-light text-slate-500">
                      Explore video reels of real recipients and field deployment events.
                    </p>
                  </div>
                </div>
                <Link
                  href="/reels"
                  className="flex w-auto items-center justify-center gap-2 rounded-xl bg-[#611192] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-colors hover:bg-[#3B055C] sm:w-full"
                >
                  <Play className="h-3.5 w-3.5" fill="currentColor" aria-hidden />
                  Category Reels ({resolved.category || 'Impact'})
                </Link>
              </div>
            </div>
          </div>

          {/* Right column — action console */}
          <div className="sticky top-[150px] col-span-4 space-y-6 lg:static lg:col-span-full">
            {(
              <div className="relative overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white p-5 shadow-xs">
                <div className="absolute left-0 top-0 h-[3px] w-full bg-emerald-500" />
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                    ⚡ Quick-Donate Express
                  </span>
                  <span className="rounded-sm bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600">
                    1-TAP
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickDonate(amt)}
                      className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 font-mono text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      £{amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
              <div className="absolute left-0 top-0 h-[3px] w-full bg-[#611192]" />
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="action-terminal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-500">
                        Action Console
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[9px] font-semibold uppercase text-slate-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span>GRID CONSOLE</span>
                      </div>
                    </div>

                    {displayType === 'donation' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-2">
                          {[10, 25, 50, 100].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(val);
                                setCustomAmount('');
                              }}
                              className={`rounded-xl border py-3 text-xs font-bold transition-all ${
                                selectedAmount === val
                                  ? 'border-white bg-white text-slate-950 shadow-md'
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
                              }`}
                            >
                              £{val}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Or enter custom amount
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={customAmount}
                              onChange={e => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                              }}
                              placeholder="Enter pound sterling"
                              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-8 pr-4 font-sans text-xs text-white focus:border-blue-900 focus:outline-hidden"
                            />
                            <DollarSign className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" aria-hidden />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Your Name (For Leaderboard)
                          </label>
                          <input
                            type="text"
                            value={donorNameInput}
                            onChange={e => setDonorNameInput(e.target.value)}
                            placeholder="Anonymous Angel"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 font-sans text-xs text-white focus:border-blue-900 focus:outline-hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleActionSubmit}
                          disabled={isSubmitting || finalDonationValue <= 0 || timing === 'ended'}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#611192] py-4 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#3B055C] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <>
                              Commit £{finalDonationValue} — Stripe checkout
                              <Heart className="h-4 w-4" aria-hidden />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {displayType === 'poll' && (
                      <div className="space-y-4">
                        <p className="text-xs font-light leading-relaxed text-slate-300">
                          Your vote locks onto our budget processor. Select a target below:
                        </p>
                        <div className="space-y-2.5">
                          {pollOptions.map((opt, idx) => (
                            <button
                              key={opt.text}
                              type="button"
                              onClick={() => setVotedIdx(idx)}
                              className={`flex w-full gap-3 rounded-xl border p-3.5 text-left text-xs transition-all ${
                                votedIdx === idx
                                  ? 'border-blue-500 bg-blue-950/40 text-white shadow-md'
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                                  votedIdx === idx
                                    ? 'border-blue-500 font-bold text-blue-500'
                                    : 'border-slate-700 text-slate-700'
                                }`}
                              >
                                {votedIdx === idx && '✓'}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleActionSubmit}
                          disabled={isSubmitting || votedIdx === null || hasVoted || timing === 'ended'}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#611192] py-4 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#3B055C] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <>
                              Cast Official Vote
                              <BarChart3 className="h-4 w-4" aria-hidden />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {displayType === 'live' && (
                      <div className="space-y-4 py-4 text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-red-900/30 bg-red-650/10">
                          <Radio className="h-6 w-6 animate-pulse text-red-500" aria-hidden />
                        </div>
                        <h4 className="text-sm font-semibold text-white">Radical Stream Commencing</h4>
                        <p className="text-[11px] font-light leading-relaxed text-slate-300">
                          This field camp stream is open-access. Set a calendar hook alert.
                        </p>
                        <button
                          type="button"
                          onClick={handleActionSubmit}
                          disabled={isSubmitting || timing === 'ended'}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#611192] py-4 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#3B055C] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            'Set Notification RSVP'
                          )}
                        </button>
                      </div>
                    )}

                    {displayType === 'general' && (
                      <div className="space-y-4 py-2 text-center">
                        <p className="text-xs font-light leading-relaxed text-slate-300">
                          Explore this verified initiative and share it with your network.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsShareOpen(true)}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#611192] py-4 text-[14px] font-semibold text-white"
                        >
                          <Share2 className="h-4 w-4" aria-hidden />
                          Share this appeal
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-5 py-4 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                      <Check className="h-7 w-7 animate-bounce text-emerald-400" aria-hidden />
                    </div>
                    <h4 className="font-primary text-xl font-bold text-white">Action Secured!</h4>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
                    >
                      Back to Console
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {displayType === 'donation' && (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" aria-hidden />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                      Top Donors Leaderboard
                    </h4>
                  </div>
                  <span className="rounded-sm bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600">
                    LIVE RANKINGS
                  </span>
                </div>
                <div className="space-y-2">
                  {topDonors.slice(0, 5).map((donor, index) => (
                    <div
                      key={`${donor.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300/40 bg-slate-200/60 font-mono text-[10px] font-bold text-slate-700">
                          {index + 1}
                        </span>
                        <div>
                          <span className="block font-bold leading-tight text-slate-800">{donor.name}</span>
                          <span className="font-mono text-[9px] uppercase text-slate-400">
                            {donor.badge} // {donor.location}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#611192]">
                        £{donor.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                <User className="h-5 w-5 text-slate-600" aria-hidden />
              </div>
              <h5 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Host Coordinator
              </h5>
              <p className="text-xs font-bold leading-none text-slate-900">
                {resolved.authorName || 'Angelpage Team'}
              </p>
              <p className="mt-2 text-[10px] text-slate-500">Accredited Angelpage supervisor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="relative z-10 mx-auto mb-8 mt-16 max-w-7xl border-t border-slate-200 px-8 pt-12 lg:px-6 sm:px-4">
          <div className="mb-8 flex flex-row items-end justify-between md:flex-col md:items-start">
            <div>
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#611192]">
                DIVERSE IMPACT PATHS
              </span>
              <h3 className="font-primary text-2xl font-bold text-slate-950 md:text-xl">
                Recommended for You
              </h3>
              <p className="mt-1 max-w-lg text-xs font-light text-slate-500">
                Based on the currently viewed category, we suggest these verified initiatives.
              </p>
            </div>
            {resolved.category && (
              <span className="mt-4 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 md:mt-0">
                Category: {resolved.category}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
            {recommended.map(rec => {
              const recType = getDisplayEventType(rec);
              const recDonation = getDonationProgress(rec);
              const pct =
                recDonation.goal > 0
                  ? Math.min(100, Math.round((recDonation.raised / recDonation.goal) * 100))
                  : 0;
              const recImage =
                rec.coverImage ||
                FALLBACK_IMAGES[recType as keyof typeof FALLBACK_IMAGES] ||
                FALLBACK_IMAGES.general;

              return (
                <motion.div
                  key={rec._id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group flex cursor-pointer flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
                  onClick={() => router.push(`/events/${rec.slug}`)}
                >
                  <div>
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                      <Image
                        src={recImage}
                        alt={rec.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-slate-950/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          {recType}
                        </span>
                      </div>
                    </div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="rounded-md border border-blue-100/50 bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#611192]">
                        {rec.category || 'Impact'}
                      </span>
                      <span className="font-mono text-[9px] uppercase text-slate-400">
                        BY {(rec.authorName || 'Team').split(' ')[0]}
                      </span>
                    </div>
                    <h4 className="mb-2 line-clamp-1 text-sm font-bold leading-tight text-slate-950 transition-colors group-hover:text-[#611192]">
                      {rec.title}
                    </h4>
                    <p className="mb-4 line-clamp-2 text-[11px] font-light leading-relaxed text-slate-500">
                      {rec.excerpt}
                    </p>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    {recType === 'donation' && recDonation.goal > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-400">RAISED</span>
                          <span className="font-bold text-[#611192]">
                            £{recDonation.raised.toLocaleString()}{' '}
                            <span className="text-slate-300">/</span> £
                            {recDonation.goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#611192]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-950 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all group-hover:bg-[#3B055C]">
                      View Details
                      <ChevronRight className="h-3 w-3" aria-hidden />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:flex">
        <div className="flex w-full flex-wrap justify-center gap-2">
          {displayType === 'donation' && (
            <button
              type="button"
              onClick={handleActionSubmit}
              disabled={finalDonationValue <= 0}
              className="flex-1 rounded-xl bg-[#611192] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white"
            >
              Donate £{finalDonationValue || 50}
            </button>
          )}
          {displayType === 'poll' && (
            <button
              type="button"
              onClick={handleActionSubmit}
              disabled={votedIdx === null || hasVoted}
              className="flex-1 rounded-xl bg-[#611192] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white"
            >
              Cast Vote
            </button>
          )}
          {displayType === 'live' && (
            <button
              type="button"
              onClick={handleActionSubmit}
              className="flex-1 rounded-xl bg-[#611192] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white"
            >
              RSVP
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-xs font-bold text-slate-700"
          >
            Share
          </button>
        </div>
      </div>

      <EventShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        event={shareEvent}
      />

      {resolved && displayType === 'donation' && (
        <EventDonationModal
          open={donationModalOpen}
          event={resolved}
          defaultAmount={donationDefaultAmount}
          onClose={() => setDonationModalOpen(false)}
        />
      )}
    </div>
  );
}
