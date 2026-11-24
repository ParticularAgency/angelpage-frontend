'use client';

import React from 'react';

type DonationProgressProps = {
  raised: number;
  goal: number;
  percent: number;
  size?: 'sm' | 'md';
  showLabels?: boolean;
};

export default function DonationProgress({
  raised,
  goal,
  percent,
  size = 'md',
  showLabels = true,
}: DonationProgressProps) {
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      {showLabels && goal > 0 ? (
        <div className="flex items-end justify-between gap-2 mb-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-mono-70 font-medium">
              Raised
            </p>
            <p className="font-primary text-lg text-mono-100 leading-tight">
              £{raised.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-mono-70 font-medium">
              Goal
            </p>
            <p className="body-small text-mono-80">£{goal.toLocaleString()}</p>
          </div>
        </div>
      ) : null}
      <div
        className={`${barHeight} w-full rounded-full bg-[#E8D4F4]/60 overflow-hidden`}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-[#611192] via-[#8B3AB8] to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${Math.max(percent, goal > 0 ? 4 : 0)}%` }}
        />
      </div>
      {showLabels && goal > 0 ? (
        <p className="caption text-[#611192] mt-1.5 font-medium">{percent}% funded</p>
      ) : null}
    </div>
  );
}
