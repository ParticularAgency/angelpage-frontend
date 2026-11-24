import React from 'react';

type FullScreenLoaderProps = {
  label?: string;
  tone?: 'light' | 'dark';
};

export default function FullScreenLoader({
  label = 'Loading',
  tone = 'light',
}: FullScreenLoaderProps) {
  const dark = tone === 'dark';
  return (
    <div
      className={`fixed inset-0 z-[10070] flex items-center justify-center ${
        dark ? 'bg-[#0B0112]' : 'bg-[#FCF2FF]'
      }`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <span
          className={`h-12 w-12 animate-spin rounded-full border-2 border-t-[#611192] ${
            dark ? 'border-white/20' : 'border-[#E6E3E7]'
          }`}
        />
        <p className={`font-primary text-2xl ${dark ? 'text-white' : 'text-[#0B0112]'}`}>
          {label}
        </p>
      </div>
    </div>
  );
}
