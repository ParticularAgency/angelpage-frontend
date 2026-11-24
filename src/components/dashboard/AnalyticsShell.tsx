'use client';

import React from 'react';

interface AnalyticsShellProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const AnalyticsShell: React.FC<AnalyticsShellProps> = ({
  title,
  subtitle,
  badge,
  children,
}) => (
  <div className="analytics-dashboard py-6 sm:py-8 space-y-6">
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#611192] via-[#7B2CBF] to-[#3D0A6B] px-6 py-8 sm:px-8 text-white shadow-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-[#FCF2FF]/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
            Analytics
          </p>
          <h2 className="text-2xl sm:text-3xl font-primary font-semibold leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80">{subtitle}</p>
        </div>
        {badge}
      </div>
    </div>
    {children}
  </div>
);

export default AnalyticsShell;
