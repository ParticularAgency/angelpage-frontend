'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { resolveEventFunds } from '@/components/features/events/eventUtils';
import { buildDonationCheckoutUrl } from '@/lib/eventDonationFlow';
import type { CommunityEventRecord } from '@/lib/server-api';

const PRESET_AMOUNTS = [20, 50, 100, 250];

export type EventDonationModalProps = {
  open: boolean;
  event: CommunityEventRecord | null;
  defaultAmount?: number;
  onClose: () => void;
  onSuccess?: () => void;
};

/** Quick fund + amount picker — routes to the dedicated Stripe checkout page. */
export default function EventDonationModal({
  open,
  event,
  defaultAmount,
  onClose,
}: EventDonationModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const funds = useMemo(() => resolveEventFunds(event), [event]);

  const [selectedFundId, setSelectedFundId] = useState(funds[0]?.id || 'direct-purchase');
  const [amount, setAmount] = useState<number>(defaultAmount || 50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(session?.user?.name || '');
  const [donorEmail, setDonorEmail] = useState(session?.user?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (!event) return;
    setSelectedFundId(resolveEventFunds(event)[0]?.id || 'direct-purchase');
    setAmount(defaultAmount || 50);
    setCustomAmount('');
    setDonorName(session?.user?.name || '');
    setDonorEmail(session?.user?.email || '');
  }, [event, defaultAmount, session?.user?.name, session?.user?.email]);

  if (!event) return null;

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const continueToCheckout = () => {
    if (!finalAmount || finalAmount < 1) {
      ToastService.error('Minimum donation is $1.');
      return;
    }
    if (!donorEmail.trim()) {
      ToastService.error('Email is required for your receipt.');
      return;
    }

    onClose();
    router.push(
      buildDonationCheckoutUrl(event, {
        fund: selectedFundId,
        amount: finalAmount,
        email: donorEmail.trim(),
        name: donorName.trim(),
        anonymous: isAnonymous ? '1' : '0',
      }),
    );
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-80 flex items-center justify-center bg-mono-100/50 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E8D4F4] bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E8D4F4]/60 bg-[#FCF2FF]/50 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-color-100">
                  Quick give
                </p>
                <h2 className="mt-1 font-serif text-lg font-bold text-mono-100">{event.title}</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-mono-70">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
              <div className="space-y-2">
                {funds.map(fund => (
                  <button
                    key={fund.id}
                    type="button"
                    onClick={() => setSelectedFundId(fund.id)}
                    className={`w-full rounded-xl border p-3 text-left text-sm ${
                      selectedFundId === fund.id
                        ? 'border-primary-color-100 bg-primary-color-70/50'
                        : 'border-[#E8D4F4]'
                    }`}
                  >
                    <span className="font-semibold text-mono-100">{fund.label}</span>
                    {fund.percent ? (
                      <span className="ml-2 text-[10px] font-bold text-primary-color-100">
                        {fund.percent}%
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount('');
                    }}
                    className={`rounded-lg border py-2 text-xs font-bold ${
                      amount === val && !customAmount
                        ? 'border-primary-color-100 bg-primary-color-100 text-white'
                        : 'border-[#E8D4F4]'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min={1}
                placeholder="Custom £"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-full rounded-xl border border-[#E8D4F4] px-4 py-3 text-sm outline-hidden focus:border-primary-color-100"
              />

              <input
                type="email"
                placeholder="Email for receipt *"
                value={donorEmail}
                onChange={e => setDonorEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E8D4F4] px-4 py-3 text-sm outline-hidden focus:border-primary-color-100"
              />

              <label className="flex items-center gap-2 text-sm text-mono-70">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="accent-primary-color-100"
                />
                Give anonymously
              </label>

              <button
                type="button"
                onClick={continueToCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-color-100 py-3.5 text-sm font-bold text-white"
              >
                <Heart className="h-4 w-4" />
                Continue to secure checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
