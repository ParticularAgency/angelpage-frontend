import type { CommunityEventRecord } from '@/lib/server-api';

export type DonationCheckoutParams = {
  fund?: string;
  amount?: string | number;
  email?: string;
  name?: string;
  anonymous?: '1' | '0' | boolean;
};

export function buildDonationCheckoutUrl(
  event: Pick<CommunityEventRecord, 'slug'>,
  params: DonationCheckoutParams,
) {
  const search = new URLSearchParams();
  if (params.fund) search.set('fund', params.fund);
  if (params.amount) search.set('amount', String(params.amount));
  if (params.email) search.set('email', params.email);
  if (params.name) search.set('name', params.name);
  if (params.anonymous === true || params.anonymous === '1') {
    search.set('anonymous', '1');
  }
  const qs = search.toString();
  return `/events/${event.slug}/donate${qs ? `?${qs}` : ''}`;
}

export function buildDonationSuccessUrl(donationId: string, paymentIntentId?: string) {
  const search = new URLSearchParams({ donationId });
  if (paymentIntentId) search.set('payment_intent', paymentIntentId);
  return `/events/donation/success?${search.toString()}`;
}

export const STRIPE_DONATION_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#611192',
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorDanger: '#df1b41',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '12px',
  },
};
