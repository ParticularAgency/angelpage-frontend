'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { ToastService } from '@/components/elements/notifications/ToastService';

type PollOption = { text: string; votes?: number };

type EventPollPanelProps = {
  eventId: string;
  question: string;
  options: PollOption[];
  onVote: (optionIndex: number) => Promise<PollOption[]>;
  disabled?: boolean;
};

const voteStorageKey = (eventId: string) => `angelpage-event-poll-${eventId}`;

export default function EventPollPanel({
  eventId,
  question,
  options: initialOptions,
  onVote,
  disabled,
}: EventPollPanelProps) {
  const [options, setOptions] = useState(initialOptions);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(voteStorageKey(eventId));
      if (stored) {
        setHasVoted(true);
        setSelectedIdx(Number(stored));
      }
    } catch {
      /* ignore */
    }
  }, [eventId]);

  const totalVotes =
    options.reduce((sum, o) => sum + (o.votes || 0), 0) || 0;

  const handleVote = async (idx: number) => {
    if (hasVoted || voting || disabled) return;
    setVoting(true);
    try {
      const updated = await onVote(idx);
      setOptions(updated);
      setHasVoted(true);
      setSelectedIdx(idx);
      localStorage.setItem(voteStorageKey(eventId), String(idx));
      ToastService.success('Your vote has been recorded.');
    } catch {
      ToastService.error('Could not record your vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <section
      id="poll"
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-[#E8D4F4]/80 bg-white shadow-xs"
    >
      <div className="border-b border-[#E8D4F4]/60 bg-linear-to-r from-[#FCF2FF] to-white px-6 py-5 md:px-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#611192] text-white shadow-md shadow-[#611192]/20">
            <BarChart3 className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#611192]">
              Community poll
            </p>
            <h2 className="font-primary mt-1 text-xl text-mono-100 md:text-2xl">
              {question}
            </h2>
            <p className="mt-1 text-sm text-mono-70">
              {totalVotes} vote{totalVotes === 1 ? '' : 's'} ·{' '}
              {hasVoted ? 'Thanks for participating' : 'One vote per device'}
            </p>
          </div>
        </div>
      </div>

      <ul className="space-y-3 p-6 md:p-8" role="list">
        {options.map((opt, idx) => {
          const pct =
            totalVotes > 0
              ? Math.round(((opt.votes || 0) / totalVotes) * 100)
              : 0;
          const isSelected = selectedIdx === idx;
          const showResults = hasVoted || totalVotes > 0;

          return (
            <li key={`${opt.text}-${idx}`}>
              <button
                type="button"
                disabled={voting || hasVoted || disabled}
                onClick={() => handleVote(idx)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#611192] bg-[#FCF2FF]/50 shadow-md ring-2 ring-[#611192]/15'
                    : hasVoted
                      ? 'cursor-default border-mono-40/80 bg-[#FAF9FC]'
                      : 'cursor-pointer border-black/6 bg-white hover:border-[#611192]/40 hover:shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center gap-3 body-small">
                  <span className={isSelected ? 'font-semibold text-[#611192]' : ''}>
                    {opt.text}
                  </span>
                  {showResults && (
                    <span className="text-mono-70 tabular-nums shrink-0">{pct}%</span>
                  )}
                </div>
                {showResults && (
                  <div className="mt-2.5 h-2 bg-[#F2E8F8] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isSelected
                          ? 'bg-linear-to-r from-[#611192] to-[#8B3AB8]'
                          : 'bg-[#C9B8D9]'
                      }`}
                      style={{ width: `${Math.max(pct, hasVoted ? 2 : 0)}%` }}
                    />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
