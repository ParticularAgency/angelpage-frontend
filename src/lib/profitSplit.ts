import {
  CHARITY_SHARE_PERCENT,
  CHARITY_SHARE_RATE,
  PLATFORM_FEE_PERCENT,
  PLATFORM_FEE_RATE,
} from '@/constants/brand';

export type ProfitSplit = {
  platformFee: number;
  distributable: number;
  sellerProfit: number;
  charityProfit: number;
  sellerSharePercent: number;
  charitySharePercent: number;
  platformFeePercent: number;
};

export function roundMoney(value: number): number {
  return Math.round(Number(value) * 100) / 100;
}

/** Platform fee first; seller vs charity split on the remainder. */
export function calculateProfitSplit(
  price: number,
  sellerSharePercent = 0,
): ProfitSplit {
  const numericPrice = Number(price) || 0;
  const pct = Math.min(100, Math.max(0, Number(sellerSharePercent) || 0));

  const platformFee = roundMoney(numericPrice * PLATFORM_FEE_RATE);
  const distributable = roundMoney(numericPrice - platformFee);
  const sellerProfit = roundMoney(distributable * (pct / 100));
  const charityProfit = roundMoney(distributable - sellerProfit);
  const charitySharePercent =
    distributable > 0
      ? roundMoney((charityProfit / distributable) * 100)
      : 100 - pct;

  return {
    platformFee,
    distributable,
    sellerProfit,
    charityProfit,
    sellerSharePercent: pct,
    charitySharePercent,
    platformFeePercent: PLATFORM_FEE_PERCENT,
  };
}

export type FulfillmentType =
  | 'uk_shipping'
  | 'personal_delivery'
  | 'self_collect'
  | 'local_only';

export const FULFILLMENT_OPTIONS: {
  id: FulfillmentType;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'uk_shipping',
    label: 'USA, Canada & UK shipping',
    shortLabel: 'Ships',
    description:
      'Ship in the United States, Canada, and the United Kingdom. We started in the United States. Package weight and size are required.',
  },
  {
    id: 'personal_delivery',
    label: 'Personal delivery',
    shortLabel: 'I deliver',
    description:
      'You deliver the item locally in person — no courier or package details needed.',
  },
  {
    id: 'self_collect',
    label: 'Collection only',
    shortLabel: 'Collect only',
    description: 'Buyer picks up from you — no shipping or package details needed.',
  },
  {
    id: 'local_only',
    label: 'Limited areas',
    shortLabel: 'Local areas',
    description: 'Sell or deliver only in selected towns or cities.',
  },
];

export function getFulfillmentLabel(
  type?: FulfillmentType | string,
  areas?: string[],
): string {
  switch (type) {
    case 'personal_delivery':
      return 'Personal delivery';
    case 'self_collect':
      return 'Collection only';
    case 'local_only':
      return areas?.length
        ? `Local: ${areas.slice(0, 3).join(', ')}${areas.length > 3 ? '…' : ''}`
        : 'Limited areas';
    case 'uk_shipping':
    default:
      return 'Ships USA, Canada & UK';
  }
}

export function getFulfillmentSpecLabel(
  type?: FulfillmentType | string,
  areas?: string[],
): string {
  switch (type) {
    case 'personal_delivery':
      return 'Personal delivery';
    case 'self_collect':
      return 'Collection only';
    case 'local_only':
      return areas?.length ? `Local: ${areas.join(', ')}` : 'Limited areas';
    case 'uk_shipping':
    default:
      return 'USA, Canada & UK shipping';
  }
}

export { CHARITY_SHARE_PERCENT, CHARITY_SHARE_RATE, PLATFORM_FEE_PERCENT };
