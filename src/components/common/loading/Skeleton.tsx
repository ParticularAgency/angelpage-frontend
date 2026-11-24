import React from 'react';

export function SkeletonLine({ className = 'h-3 w-full' }: { className?: string }) {
  return (
    <span
      className={`block animate-pulse rounded-full bg-[#E6E3E7] ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonBlock({ className = 'h-40 w-full' }: { className?: string }) {
  return <span className={`block animate-pulse rounded-2xl bg-[#E6E3E7] ${className}`} aria-hidden />;
}

export function CardLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          className={index === lines - 1 ? 'h-3 w-2/3' : 'h-3 w-full'}
        />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E6E3E7] bg-white">
      <SkeletonBlock className="aspect-[1/1] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <SkeletonLine className="h-3 w-1/3" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-4/5" />
        <SkeletonLine className="mt-2 h-3 w-1/2" />
        <SkeletonBlock className="mt-auto h-10 rounded-full" />
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white">
      <SkeletonBlock className="aspect-[16/10] rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <SkeletonLine className="h-3 w-24" />
        <SkeletonLine className="h-5 w-full" />
        <SkeletonLine className="h-5 w-4/5" />
        <SkeletonLine className="h-3 w-2/3" />
        <div className="mt-2 flex items-center justify-between">
          <SkeletonLine className="h-8 w-28 rounded-full" />
          <SkeletonBlock className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </article>
  );
}
