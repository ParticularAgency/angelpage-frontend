'use client';

import React from 'react';
import {
  getFulfillmentLabel,
  type FulfillmentType,
} from '@/lib/profitSplit';

type ProductFulfillmentBadgeProps = {
  fulfillmentType?: FulfillmentType | string;
  sellAreas?: string[];
  className?: string;
};

export default function ProductFulfillmentBadge({
  fulfillmentType = 'uk_shipping',
  sellAreas = [],
  className = '',
}: ProductFulfillmentBadgeProps) {
  const label = getFulfillmentLabel(fulfillmentType, sellAreas);

  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary-color-70 px-2 py-0.5 text-[10px] font-medium text-primary-color-100 ${className}`}
      title={label}
    >
      {label}
    </span>
  );
}
