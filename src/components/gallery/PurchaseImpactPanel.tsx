'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/elements';
import { buildReelsUrl } from '@/lib/slugs';

type CharitySummary = {
  _id?: string;
  charityName?: string;
  profileImage?: string;
};

type PurchaseImpactPanelProps = {
  products?: Array<{
    charity?: CharitySummary;
    productId?: { charity?: CharitySummary };
    charityProfit?: number;
  }>;
};

export default function PurchaseImpactPanel({ products = [] }: PurchaseImpactPanelProps) {
  const charities = useMemo(() => {
    const map = new Map<string, CharitySummary>();
    products.forEach(item => {
      const charity = item.charity || item.productId?.charity;
      if (charity?._id) {
        map.set(String(charity._id), charity);
      }
    });
    return [...map.values()];
  }, [products]);

  const totalCharity = useMemo(
    () =>
      products.reduce(
        (sum, item) => sum + (Number(item.charityProfit) || 0),
        0,
      ),
    [products],
  );

  if (!charities.length) return null;

  const primary = charities[0];
  const reelsHref = buildReelsUrl({
    kind: 'reel',
    tag: 'impact',
    ...(primary._id ? { charityId: String(primary._id) } : {}),
  });

  return (
    <div className="mb-8 max-w-[511px] rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/80 via-white to-[#FCF2FF]/40 p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Sparkles className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
            Your impact
          </p>
          <p className="mt-1 font-semibold text-mono-100">
            {totalCharity > 0
              ? `£${totalCharity.toFixed(2)} from your order supports `
              : 'Your purchase supports '}
            {charities.length === 1
              ? primary.charityName
              : `${charities.length} UK charities`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mono-70">
            See how communities feel the difference — real thank-you videos and
            stories from the causes you helped.
          </p>
        </div>
      </div>

      {charities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {charities.map(charity => (
            <div
              key={charity._id}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3 py-1.5 text-xs font-medium text-mono-80"
            >
              {charity.profileImage && (
                <Image
                  src={charity.profileImage}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              {charity.charityName}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={reelsHref}>
          <Button variant="primary" className="inline-flex items-center gap-2">
            <PlayCircle className="h-4 w-4" aria-hidden />
            See impact reels
          </Button>
        </Link>
        <Link href={buildReelsUrl({ kind: 'reel' })}>
          <Button variant="secondary" className="text-primary-color-100!">
            Browse all reels
          </Button>
        </Link>
      </div>
    </div>
  );
}
