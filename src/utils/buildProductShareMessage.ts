import { calculateProfitSplit } from '@/lib/profitSplit';
import { SITE_URL } from '@/lib/siteSeo';

export type ProductShareDetails = {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  charityProfit?: number;
  sellerSharePercent?: number;
  charityName?: string;
  description?: string;
  condition?: string;
  brand?: string;
  material?: string;
  color?: string;
  size?: string;
  category?: string;
  imageUrl?: string;
};

export type SharePayload = {
  url: string;
  title: string;
  description: string;
  fullMessage: string;
  shortMessage: string;
  imageUrl?: string;
};

const resolveProductSlug = (details: ProductShareDetails | string) => {
  if (typeof details === 'string') return details;
  return details.slug || details.productId;
};

const buildProductUrl = (details: ProductShareDetails | string) => {
  const slug = resolveProductSlug(details);
  if (!slug) return '';

  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/$/, '');

  if (!origin) return `/product/${slug}`;
  return `${origin}/product/${slug}`;
};

export const buildProductUrlForSlug = (slug: string) => {
  if (!slug) return '';

  return `${SITE_URL}/product/${slug}`;
};

/** @deprecated Use buildProductUrlForSlug */
export const buildProductUrlForId = buildProductUrlForSlug;

const buildFeatureLines = (details: ProductShareDetails) => {
  const features: string[] = [];

  if (details.condition) features.push(`Condition: ${details.condition}`);
  if (details.brand) features.push(`Brand: ${details.brand}`);
  if (details.material) features.push(`Material: ${details.material}`);
  if (details.color) features.push(`Colour: ${details.color}`);
  if (details.size) features.push(`Size: ${details.size}`);
  if (details.category) features.push(`Category: ${details.category}`);

  return features;
};

const resolveCharityLine = (details: ProductShareDetails) => {
  const charityName = details.charityName || 'charity';
  const split = calculateProfitSplit(
    details.price,
    details.sellerSharePercent ?? 0
  );
  const profit = details.charityProfit ?? split.charityProfit;
  const pct = split.charitySharePercent;

  if (split.sellerSharePercent === 0) {
    return `${pct}% (£${profit.toFixed(2)}) supports ${charityName}.`;
  }
  return `£${profit.toFixed(2)} (${pct}%) to ${charityName} · seller keeps ${split.sellerSharePercent}%.`;
};

export const buildOgDescription = (details: ProductShareDetails) => {
  const features = buildFeatureLines(details);
  const description = details.description?.trim();

  const parts = [
    `£${details.price} on Angelpage.`,
    features.length ? features.join(' · ') : null,
    description ? truncate(description, 160) : null,
    resolveCharityLine(details),
  ].filter(Boolean);

  return parts.join(' ');
};

export const buildSharePayload = (
  details: ProductShareDetails,
  options?: { maxLength?: number }
): SharePayload => {
  const charityName = details.charityName || 'a great cause';
  const features = buildFeatureLines(details);
  const description = details.description?.trim();
  const split = calculateProfitSplit(
    details.price,
    details.sellerSharePercent ?? 0
  );
  const profit = details.charityProfit ?? split.charityProfit;
  const url = buildProductUrl(details);
  const charityLine = resolveCharityLine({ ...details, charityName });

  const lines = [
    `✨ ${details.name}`,
    `£${details.price} on Angelpage — pre-loved fashion that gives back.`,
    features.length ? '' : null,
    features.length ? 'Key features:' : null,
    ...features.map(feature => `• ${feature}`),
    description ? '' : null,
    description ? 'About this item:' : null,
    description ? truncate(description, 280) : null,
    '',
    `💜 ${charityLine}`,
    'Shop consciously on Angelpage.',
    '',
    '🔗 View listing:',
    url,
  ].filter(line => line !== null);

  const fullMessage = lines.join('\n');
  const shortMessage = truncate(
    [
      `✨ ${details.name} — £${details.price} on Angelpage.`,
      features.slice(0, 3).join(' · '),
      description ? truncate(description, 100) : null,
      `💜 £${profit.toFixed(2)} to ${charityName}.`,
      url,
    ]
      .filter(Boolean)
      .join('\n'),
    options?.maxLength ?? 2000
  );

  return {
    url,
    title: details.name,
    description: buildOgDescription(details),
    fullMessage: truncate(fullMessage, options?.maxLength ?? 2000),
    shortMessage,
    imageUrl: details.imageUrl,
  };
};

const truncate = (text: string, max: number) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
};
