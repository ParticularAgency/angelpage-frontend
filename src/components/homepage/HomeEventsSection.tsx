'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Radio,
  Share2,
  TrendingUp,
  User,
} from 'lucide-react';
import EventShareModal, {
  type EventSharePayload,
} from '@/components/features/events/EventShareModal';
import { EventCardSkeleton, SkeletonLine } from '@/components/common/loading/Skeleton';
import dynamic from 'next/dynamic';

const EventDonationModal = dynamic(
  () => import('@/components/features/events/EventDonationModal'),
  { ssr: false },
);
import { getDonationProgress } from '@/components/features/events/eventUtils';
import { buildDonationCheckoutUrl } from '@/lib/eventDonationFlow';
import type { CommunityEventRecord } from '@/lib/server-api';
import { useGetEventsQuery } from '@/store/api/angelpageApi';

const FALLBACK_IMAGES = {
  donation: '/images/events/charity_event_hero.jpg',
  poll: '/images/events/community_poll_bg.jpg',
  live: '/images/events/donation_hands.jpg',
};

type BentoEvent = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  targetDate: Date;
  eventType: string;
  donationUrl?: string;
  liveStreamUrl?: string;
  authorName?: string;
  category?: string;
  pollOptions: { id: number; text: string; votes: number }[];
};

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const CompactCountdown = ({ targetDate }: { targetDate: Date }) => {
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="flex w-fit items-center gap-1.5 rounded-full border border-[#E6E3E7] bg-white px-2.5 py-1">
      <Clock className="h-3 w-3 text-[#611192]" aria-hidden />
      <div className="flex items-center gap-1 text-[10px] tracking-wider text-[#3B055C]">
        <span>{String(timeLeft.days).padStart(2, '0')}d</span>
        <span className="text-[#6B686E]">:</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-[#6B686E]">:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
      </div>
    </div>
  );
};

const voteStorageKey = (eventId: string) => `angelpage-home-poll-${eventId}`;

function toBentoEvent(
  event: CommunityEventRecord,
  fallbackImage: string,
  fallbackOptions?: { id: number; text: string; votes: number }[],
): BentoEvent {
  const end = event.endAt || event.startAt;
  const targetDate = end ? new Date(end) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return {
    _id: event._id,
    slug: event.slug || event._id,
    title: event.title,
    description:
      event.excerpt ||
      event.description ||
      'Help deliver crucial support directly to families in need.',
    image: event.coverImage || fallbackImage,
    targetDate,
    eventType: event.eventType,
    donationUrl: event.donationUrl,
    liveStreamUrl: event.liveStreamUrl,
    authorName: event.authorName,
    category: event.category,
    pollOptions:
      event.pollOptions?.map((opt, idx) => ({
        id: idx + 1,
        text: opt.text,
        votes: opt.votes || 0,
      })) ||
      fallbackOptions ||
      [],
  };
}

function buildDemoEvents(): {
  donation: BentoEvent;
  poll: BentoEvent;
  live: BentoEvent;
} {
  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 12);
  futureDate1.setHours(futureDate1.getHours() + 5);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 2);
  futureDate2.setHours(futureDate2.getHours() + 10);

  return {
    donation: {
      _id: 'demo-donation',
      slug: 'events',
      title: 'Global Food Relief Drive',
      description:
        'Help deliver crucial grains, flour, baby milk formula, and clean water directly to families surviving devastating flash floods.',
      image: FALLBACK_IMAGES.donation,
      targetDate: futureDate1,
      eventType: 'donation',
      pollOptions: [],
    },
    poll: {
      _id: 'demo-poll',
      slug: 'events',
      title: 'Next Resource Allocation Poll',
      description:
        'Directly shape upcoming logistics. Choose where East Africa emergency grant funds route next week.',
      image: FALLBACK_IMAGES.poll,
      targetDate: futureDate2,
      eventType: 'poll',
      pollOptions: [
        { id: 1, text: 'Disaster Food Relief packs', votes: 142 },
        { id: 2, text: 'Emergency Water wells', votes: 98 },
        { id: 3, text: 'Maternal Care tent supply', votes: 76 },
      ],
    },
    live: {
      _id: 'demo-live',
      slug: 'events',
      title: 'Ground Impact Live Stream',
      description:
        'Stream directly from East Africa. Speak with medical coordinators on the ground, and see equipment funded by your contributions.',
      image: FALLBACK_IMAGES.live,
      targetDate: futureDate2,
      eventType: 'live_session',
      authorName: 'Dr. Sarah Jenkins',
      category: 'East Africa Depot',
      pollOptions: [],
    },
  };
}

const DonationColumnCard = ({
  event,
  raisedAmount,
  onNavigate,
  onShare,
  onDonate,
}: {
  event: BentoEvent;
  raisedAmount: number;
  onNavigate: (slug: string) => void;
  onShare: (event: BentoEvent) => void;
  onDonate: (event: BentoEvent, amount: number) => void;
}) => {
  const [amount, setAmount] = useState<number | null>(50);
  const donation = getDonationProgress(event as unknown as CommunityEventRecord);
  const target = donation.goal || 10000;
  const [isDonating, setIsDonating] = useState(false);

  const percentProgress = target
    ? Math.min(100, Math.round((raisedAmount / target) * 100))
    : 0;

  const handleDonate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!amount) return;
    if (event._id.startsWith('demo-')) {
      onNavigate(event.slug || 'events');
      return;
    }
    setIsDonating(true);
    onDonate(event, amount);
    setIsDonating(false);
  };

  return (
    <article
      onClick={() => onNavigate(event.slug)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] bg-[#0B0112]"
    >
      <div className="relative h-[340px] w-full overflow-hidden sm:h-56">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 767px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0112] via-[#0B0112]/35 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#611192] px-3 py-1 text-[11px] font-medium text-white!">
            <Heart className="h-3 w-3" aria-hidden />
            Appeal
          </span>
          <CompactCountdown targetDate={event.targetDate} />
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onShare(event);
          }}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#611192]"
          aria-label="Share this appeal"
        >
          <Share2 className="h-4 w-4" aria-hidden />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-primary max-w-lg text-4xl leading-none text-white! sm:text-3xl">
            {event.title}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 bg-white p-6" onClick={e => e.stopPropagation()}>
        <p className="text-sm leading-6 text-[#5C5560]">{event.description}</p>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#0B0112]">
              ${raisedAmount.toLocaleString()} raised
            </span>
            <span className="font-medium text-[#611192]">{percentProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#F2E8F8]">
            <div className="h-full rounded-full bg-[#611192]" style={{ width: `${percentProgress}%` }} />
          </div>
          <p className="mt-2 text-xs text-[#8A7E90]">Goal ${target.toLocaleString()}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[20, 50, 100, 250].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className={`rounded-full py-2 text-sm font-medium ${
                amount === val ? 'bg-[#611192] text-white!' : 'bg-[#FCF2FF] text-[#611192]!'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleDonate}
          disabled={isDonating || !amount}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#611192] py-3 text-sm font-medium text-white! disabled:opacity-50"
        >
          {isDonating ? 'Opening checkout' : `Give $${amount}`}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
};

const PollColumnCard = ({
  event,
  onNavigate,
  onShare,
}: {
  event: BentoEvent;
  onNavigate: (slug: string) => void;
  onShare: (event: BentoEvent) => void;
}) => {
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [votes, setVotes] = useState(
    () => event.pollOptions.map(opt => opt.votes) || [142, 98, 76],
  );
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(voteStorageKey(event._id));
      if (stored !== null) setVotedOption(Number(stored));
    } catch {
      // ignore
    }
  }, [event._id]);

  const totalVotes = votes.reduce((acc, curr) => acc + curr, 0) || 1;

  const handleVote = async (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (votedOption !== null || voting) return;

    setVoting(true);
    try {
      if (!event._id.startsWith('demo-')) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}/poll/vote`,
          { optionIndex: idx },
        );
        const updated = res.data.pollOptions as { votes?: number }[];
        if (Array.isArray(updated)) {
          setVotes(updated.map(opt => opt.votes || 0));
        }
      } else {
        setVotes(prev => {
          const next = [...prev];
          next[idx] = (next[idx] || 0) + 1;
          return next;
        });
      }
      setVotedOption(idx);
      localStorage.setItem(voteStorageKey(event._id), String(idx));
    } catch {
      setVotes(prev => {
        const next = [...prev];
        next[idx] = (next[idx] || 0) + 1;
        return next;
      });
      setVotedOption(idx);
    } finally {
      setVoting(false);
    }
  };

  return (
    <article
      onClick={() => onNavigate(event.slug)}
      className="overflow-hidden rounded-[28px] bg-white"
    >
      <div className="relative h-36">
        <Image src={event.image} alt={event.title} fill className="object-cover" sizes="40vw" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0112]/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#611192]!">
              <TrendingUp className="h-3 w-3" aria-hidden />
              Vote
            </span>
            <h3 className="font-primary mt-2 text-2xl leading-none text-white!">{event.title}</h3>
          </div>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onShare(event);
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#611192]"
            aria-label="Share this vote"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="space-y-2 p-4" onClick={e => e.stopPropagation()}>
        {event.pollOptions.map((option, index) => {
          const isVoted = votedOption === index;
          const currentVotes = votes[index] || 0;
          const pct = Math.round((currentVotes / totalVotes) * 100);
          return (
            <button
              key={option.id}
              type="button"
              onClick={e => handleVote(e, index)}
              disabled={votedOption !== null || voting}
              className={`relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-3 py-2.5 text-left text-sm ${
                isVoted ? 'bg-[#611192] text-white!' : 'bg-[#FCF2FF] text-[#0B0112]!'
              }`}
            >
              {votedOption !== null && !isVoted && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  className="absolute inset-y-0 left-0 bg-[#E8D4F4]"
                />
              )}
              <span className="relative z-10 pr-3">{option.text}</span>
              <span className={`relative z-10 text-xs ${isVoted ? 'text-white!' : 'text-[#611192]!'}`}>
                {votedOption !== null ? `${pct}%` : currentVotes}
              </span>
            </button>
          );
        })}
        {votedOption !== null && (
          <p className="pt-1 text-center text-xs text-[#8A7E90]">{totalVotes} votes</p>
        )}
      </div>
    </article>
  );
};

const LiveColumnCard = ({
  event,
  onNavigate,
  onShare,
}: {
  event: BentoEvent;
  onNavigate: (slug: string) => void;
  onShare: (event: BentoEvent) => void;
}) => {
  const [rsvped, setRsvped] = useState(false);

  const handleRsvp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRsvped(prev => !prev);
    if (event.liveStreamUrl) {
      window.open(event.liveStreamUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      onClick={() => onNavigate(event.slug)}
      className="overflow-hidden rounded-[28px] bg-[#3B055C]"
    >
      <div className="relative h-36">
        <Image src={event.image} alt={event.title} fill className="object-cover" sizes="40vw" />
        <div className="absolute inset-0 bg-[#3B055C]/35" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#611192]!">
          <Radio className="h-3 w-3" aria-hidden />
          Live
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onShare(event);
          }}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#611192]"
          aria-label="Share this live event"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
      <div className="p-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-primary text-2xl leading-none text-white!">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/80!">{event.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-white/80!">
          <User className="h-3.5 w-3.5" aria-hidden />
          {event.authorName || 'Angelpage host'}
          {event.category ? ` · ${event.category}` : ''}
        </p>
        <button
          type="button"
          onClick={handleRsvp}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-medium text-[#611192]!"
        >
          {rsvped ? (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Saved
            </>
          ) : (
            'Remind me'
          )}
        </button>
      </div>
    </article>
  );
};

export default function HomeEventsSection() {
  const router = useRouter();
  const { data: apiEvents = [], isLoading } = useGetEventsQuery({ limit: 24 });
  const events = apiEvents as CommunityEventRecord[];

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedShareEvent, setSelectedShareEvent] =
    useState<EventSharePayload | null>(null);

  const bento = useMemo(() => {
    const demo = buildDemoEvents();

    const donationApi = events.find(e => e.eventType === 'donation');
    const pollApi = events.find(
      e => Boolean(e.pollQuestion && (e.pollOptions?.length ?? 0) > 0),
    );
    const liveApi = events.find(e => e.eventType === 'live_session');

    return {
      donation: donationApi
        ? toBentoEvent(donationApi, FALLBACK_IMAGES.donation)
        : demo.donation,
      donationSource: donationApi || null,
      poll: pollApi
        ? toBentoEvent(pollApi, FALLBACK_IMAGES.poll, demo.poll.pollOptions)
        : demo.poll,
      live: liveApi
        ? toBentoEvent(liveApi, FALLBACK_IMAGES.live)
        : demo.live,
    };
  }, [events]);

  const [donationModal, setDonationModal] = useState<{
    event: CommunityEventRecord;
    amount: number;
  } | null>(null);
  const [donationRaisedMap, setDonationRaisedMap] = useState<Record<string, number>>({});

  const donationRaised =
    donationRaisedMap[bento.donation._id] ??
    getDonationProgress(
      (bento.donationSource || (bento.donation as unknown as CommunityEventRecord)) as CommunityEventRecord,
    ).raised;

  const handleOpenDonation = (_bentoEvent: BentoEvent, amount: number) => {
    if (!bento.donationSource?.slug) {
      router.push('/events');
      return;
    }
    router.push(
      buildDonationCheckoutUrl(bento.donationSource, {
        amount,
      }),
    );
  };

  const handleShare = (event: BentoEvent) => {
    setSelectedShareEvent({
      id: event.slug || event._id,
      title: event.title,
      description: event.description,
      tag:
        event.eventType === 'donation'
          ? 'FEATURED GOAL'
          : event.eventType === 'live_session'
            ? 'LIVE STREAM'
            : 'COMMUNITY POLL',
      url:
        typeof window !== 'undefined'
          ? `${window.location.origin}/events/${event.slug}`
          : `/events/${event.slug}`,
    });
    setIsShareOpen(true);
  };

  const handleNavigate = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  if (isLoading) {
    return (
      <section className="border-y border-[#E6E3E7] bg-[#FCF2FF] py-16">
        <div className="custom-container">
          <div className="mb-8 flex flex-col gap-3">
            <SkeletonLine className="h-3 w-40" />
            <SkeletonLine className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FCF2FF] py-16">
      <div className="custom-container">
        <div className="mb-8 flex items-end justify-between gap-6 sm:flex-col sm:items-start">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
              Events
            </p>
            <h2 className="font-primary mt-2 text-[2.6rem] leading-none text-[#0B0112]">
              Give beside the shop
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#5C5560]">
              One appeal to support, one vote to shape, and one live moment to follow.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full bg-[#611192] px-5 py-2.5 text-sm font-medium text-white!"
          >
            All events
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-12 items-start gap-5 sm:grid-cols-1">
          <div className="col-span-7 sm:col-span-full">
            <DonationColumnCard
              event={bento.donation}
              raisedAmount={donationRaised}
              onNavigate={handleNavigate}
              onShare={handleShare}
              onDonate={handleOpenDonation}
            />
          </div>
          <div className="col-span-5 flex flex-col gap-5 sm:col-span-full">
            <PollColumnCard
              event={bento.poll}
              onNavigate={handleNavigate}
              onShare={handleShare}
            />
            <LiveColumnCard
              event={bento.live}
              onNavigate={handleNavigate}
              onShare={handleShare}
            />
          </div>
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
        event={donationModal?.event || null}
        defaultAmount={donationModal?.amount}
        onClose={() => setDonationModal(null)}
      />
    </section>
  );
}
