'use client';

import React from 'react';
import { CheckCircle2, Printer } from 'lucide-react';
import type { EventDonationReceipt } from '@/lib/server-api';

type Props = {
  receipt: EventDonationReceipt;
  compact?: boolean;
};

export default function EventDonationReceiptView({ receipt, compact = false }: Props) {
  const paidDate = receipt.paidAt
    ? new Date(receipt.paidAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="event-donation-receipt"
      className={`overflow-hidden rounded-2xl border border-[#E8D4F4] bg-white ${
        compact ? '' : 'shadow-xs'
      }`}
    >
      <div className="border-b border-[#E8D4F4]/60 bg-[#FCF2FF]/50 px-5 py-4 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-color-100 shadow-xs">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-color-100">
          Donation receipt
        </p>
        <p className="mt-2 text-3xl font-bold text-primary-color-100">
          £{Number(receipt.amount).toFixed(2)}
        </p>
      </div>

      <div className="space-y-3 px-5 py-4 text-sm">
        <Row label="Receipt no." value={receipt.donationNumber} bold />
        <Row label="Date" value={paidDate} />
        <Row label="Donor" value={receipt.donorName} />
        <Row label="Email" value={receipt.donorEmail} />
        <Row label="Event" value={receipt.eventTitle} />
        <Row label="Fund" value={receipt.fundLabel} bold />
        <Row label="Beneficiary" value={receipt.charityName || 'Angelpage Community Fund'} />
        <Row label="Status" value={receipt.paymentStatus === 'paid' ? 'Paid' : receipt.paymentStatus} />
      </div>

      {!compact && (
        <div className="border-t border-[#E8D4F4]/60 px-5 py-4">
          <button
            type="button"
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8D4F4] py-2.5 text-sm font-semibold text-primary-color-100 transition hover:bg-[#FCF2FF]"
          >
            <Printer className="h-4 w-4" />
            Print receipt
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-mono-70">
            A copy has been emailed to {receipt.donorEmail}. This receipt confirms your gift to the
            selected fund.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E8D4F4]/40 pb-2 last:border-0">
      <span className="text-mono-70">{label}</span>
      <span className={`text-right ${bold ? 'font-bold text-mono-100' : 'text-mono-100'}`}>
        {value}
      </span>
    </div>
  );
}
