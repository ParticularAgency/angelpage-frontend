'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/elements';

const STEPS = [
  {
    id: 'discover',
    number: '1',
    title: 'Discover',
    description: 'Browse giving drives, live sessions, and community polls.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'act',
    number: '2',
    title: 'Take action',
    description: 'Donate to a cause, join a live stream, or cast your vote.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'share',
    number: '3',
    title: 'Share impact',
    description: 'Spread the word so more people can support UK charities.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
] as const;

type EventsFlowGuideProps = {
  variant?: 'full' | 'compact';
  showCtas?: boolean;
  className?: string;
};

export default function EventsFlowGuide({
  variant = 'full',
  showCtas = true,
  className = '',
}: EventsFlowGuideProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`rounded-2xl border border-[#E8D4F4]/80 bg-white/90 backdrop-blur-xs shadow-xs ${isCompact ? 'p-5' : 'p-6 md:p-8'} ${className}`}
    >
      <p className="caption uppercase tracking-[0.15em] text-[#611192] font-semibold">
        How it works
      </p>
      <h3
        className={`font-primary text-mono-100 mt-1 ${isCompact ? 'text-lg' : 'text-xl md:text-2xl'}`}
      >
        Three simple steps to make a difference
      </h3>

      <ol className={`mt-5 space-y-4 ${isCompact ? 'space-y-3' : ''}`}>
        {STEPS.map(step => (
          <li key={step.id} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCF2FF] text-[#611192]">
              {step.icon}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-mono-100">
                <span className="text-[#611192] mr-1.5">{step.number}.</span>
                {step.title}
              </p>
              <p className="text-xs text-mono-70 mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {showCtas && (
        <div className={`flex flex-col gap-2 ${isCompact ? 'mt-5' : 'mt-6'}`}>
          <Link href="/events">
            <Button variant="primary" className="w-full">
              Browse events &amp; giving
            </Button>
          </Link>
          <Link href="/charity/find-a-charity">
            <Button variant="secondary" className="w-full text-primary-color-100!">
              Find a charity partner
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export const EVENT_TYPE_HINTS = {
  donation: {
    label: 'Giving drive',
    action: 'Tap an event → Donate now → funds go to the charity.',
    cta: 'Give now',
  },
  live_session: {
    label: 'Live session',
    action: 'Open the event → Watch live when it starts → share with friends.',
    cta: 'Join live',
  },
  general: {
    label: 'Community event',
    action: 'Read details → Vote in the poll or share the event.',
    cta: 'Take part',
  },
} as const;
