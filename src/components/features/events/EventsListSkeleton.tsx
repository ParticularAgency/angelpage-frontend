'use client';

import React from 'react';

type EventsListSkeletonProps = {
  count?: number;
  columns?: 2 | 3;
};

export default function EventsListSkeleton({
  count = 6,
  columns = 3,
}: EventsListSkeletonProps) {
  const gridClass =
    columns === 3
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5';

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white"
        >
          <div className="aspect-16/10 animate-pulse bg-[#E6E3E7]" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-28 animate-pulse rounded-full bg-[#E6E3E7]" />
            <div className="h-5 w-full animate-pulse rounded-full bg-[#E6E3E7]" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#E6E3E7]" />
            <div className="mt-4 flex justify-between border-t border-[#E6E3E7] pt-4">
              <div className="h-4 w-16 animate-pulse rounded-full bg-[#E6E3E7]" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#E6E3E7]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
