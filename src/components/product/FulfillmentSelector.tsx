'use client';

import React from 'react';
import { Input } from '@/components/elements';
import {
  FULFILLMENT_OPTIONS,
  type FulfillmentType,
} from '@/lib/profitSplit';

type FulfillmentSelectorProps = {
  value: FulfillmentType | string;
  sellAreas: string;
  onChange: (type: FulfillmentType) => void;
  onSellAreasChange: (value: string) => void;
};

export default function FulfillmentSelector({
  value,
  sellAreas,
  onChange,
  onSellAreasChange,
}: FulfillmentSelectorProps) {
  const selected =
    FULFILLMENT_OPTIONS.find(opt => opt.id === value) ||
    FULFILLMENT_OPTIONS[0];
  const needsAreas = value === 'local_only';

  return (
    <div className="mb-6">
      <p className="body-bold-small mb-1">How will buyers get this item?</p>
      <p className="body-small mb-4 text-mono-70">
        Choose delivery — package details are only needed for UK courier shipping.
      </p>

      <div className="flex flex-wrap gap-2">
        {FULFILLMENT_OPTIONS.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              value === opt.id
                ? 'border-[#611192] bg-[#FCF2FF] text-[#611192]'
                : 'border-mono-40 bg-white text-mono-80 hover:border-[#E8D4F4]'
            }`}
          >
            {opt.shortLabel}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[#E8D4F4]/80 bg-[#FAF9FC] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#611192]">
          {selected.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-mono-70">
          {selected.description}
        </p>
      </div>

      {needsAreas && (
        <Input
          label="Areas (comma-separated)"
          name="sellAreas"
          value={sellAreas}
          onChange={e => onSellAreasChange(e.target.value)}
          placeholder="e.g. London, Manchester, Birmingham"
          className="mt-3 flex-col"
        />
      )}
    </div>
  );
}
