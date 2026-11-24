'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, PlayCircle, Sparkles } from 'lucide-react';
import type { CommunityEventRecord } from '@/lib/server-api';
import { buildReelsUrl } from '@/lib/slugs';

type DonationImpactPanelProps = {
  event: CommunityEventRecord;
  className?: string;
};

export default function DonationImpactPanel({
  event,
  className = '',
}: DonationImpactPanelProps) {
  if (event.eventType !== 'donation') return null;

  const causeName = event.authorName || 'this cause';
  const charityId =
    event.authorRole === 'CHARITY' && event.authorId
      ? event.authorId
      : undefined;

  const impactReelsHref = buildReelsUrl({
    kind: 'reel',
    tag: 'impact',
    ...(charityId ? { charityId } : {}),
  });

  const allReelsHref = buildReelsUrl(
    charityId ? { charityId, kind: 'reel' } : { kind: 'reel' },
  );

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-[#E8D4F4]/80 bg-linear-to-br from-[#FCF2FF] via-white to-[#FAF9FC] shadow-xs ${className}`}
    >
      <div className="border-b border-[#E8D4F4]/50 bg-white/80 px-6 py-4 md:px-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#611192] text-white shadow-md shadow-[#611192]/20">
            <Heart className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#611192]">
              Your donation journey
            </p>
            <h2 className="font-primary mt-1 text-xl text-mono-100 md:text-2xl">
              Where your gift goes
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6 md:p-8">
        <p className="text-sm leading-relaxed text-mono-80 md:text-base">
          When you donate through this drive, your contribution supports{' '}
          <span className="font-semibold text-[#611192]">{causeName}</span>.
          Every pound helps real people — and our community shares those moments
          so you can see the difference you make.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8D4F4]/60 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-mono-70">
              Step 1
            </p>
            <p className="mt-1 font-semibold text-mono-100">You give</p>
            <p className="mt-1 text-sm text-mono-70">
              Tap Donate now — you&apos;ll complete payment securely with the
              charity partner.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E8D4F4]/60 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-mono-70">
              Step 2
            </p>
            <p className="mt-1 font-semibold text-mono-100">They feel it</p>
            <p className="mt-1 text-sm text-mono-70">
              Charities and supporters post thank-you reels and photos — watch
              the impact unfold.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={impactReelsHref}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#611192] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#611192]/20 transition hover:bg-[#4d0d75]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            See impact stories
          </Link>
          <Link
            href={allReelsHref}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8D4F4] bg-white px-5 py-3 text-sm font-semibold text-[#611192] transition hover:bg-[#FCF2FF]"
          >
            <PlayCircle className="h-4 w-4" aria-hidden />
            Watch community reels
          </Link>
        </div>
      </div>
    </section>
  );
}
