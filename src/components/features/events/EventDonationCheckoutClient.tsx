'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { ArrowLeft, Heart, Loader2, Lock, ShieldCheck } from 'lucide-react';
import FullScreenLoader from '@/components/common/loading/FullScreenLoader';
import { useSession } from 'next-auth/react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import {
  getDonationProgress,
  resolveEventFunds,
} from '@/components/features/events/eventUtils';
import {
  buildDonationSuccessUrl,
  STRIPE_DONATION_APPEARANCE,
} from '@/lib/eventDonationFlow';
import type { CommunityEventRecord } from '@/lib/server-api';
import { useGetEventBySlugQuery } from '@/store/api/angelpageApi';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const PRESET_AMOUNTS = [20, 50, 100, 250];

type Props = { slug: string; initialEvent?: CommunityEventRecord | null };

function PaymentStep({
  event,
  donationId,
  clientSecret,
  amount,
  fundLabel,
  charityName,
  donorEmail,
  donorName,
  isAnonymous,
}: {
  event: CommunityEventRecord;
  donationId: string;
  clientSecret: string;
  amount: number;
  fundLabel: string;
  charityName?: string;
  donorEmail: string;
  donorName: string;
  isAnonymous: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [ready, setReady] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);
    try {
      const returnUrl = `${window.location.origin}${buildDonationSuccessUrl(donationId)}`;

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          receipt_email: donorEmail,
          payment_method_data: {
            billing_details: {
              name: isAnonymous ? 'Anonymous Angel' : donorName || 'Donor',
              email: donorEmail,
            },
          },
        },
        redirect: 'if_required',
      });

      if (result.error) {
        ToastService.error(result.error.message || 'Payment failed.');
        return;
      }

      const paymentIntentId =
        typeof result.paymentIntent === 'object' ? result.paymentIntent?.id : undefined;

      if (result.paymentIntent?.status === 'succeeded' && paymentIntentId) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/events/donations/${donationId}/confirm`,
          { paymentIntentId },
        );
        router.push(buildDonationSuccessUrl(donationId, paymentIntentId));
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Payment could not be completed.';
      ToastService.error(message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 sm:grid-cols-1">
      <div className="col-span-7 space-y-5 sm:col-span-full">
        <div className="rounded-3xl border border-[#E8D4F4] bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-color-100">
            <Lock className="h-4 w-4" />
            Secure Stripe checkout
          </div>
          <PaymentElement
            onReady={() => setReady(true)}
            options={{ layout: 'tabs' }}
          />
          <button
            type="button"
            onClick={handlePay}
            disabled={!ready || paying || !stripe}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-color-100 py-4 text-sm font-bold text-white transition hover:bg-primary-color-50 disabled:opacity-60"
          >
            {paying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Heart className="h-4 w-4" />
                {`Complete $${amount.toFixed(2)} donation`}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-mono-70">
            Apple Pay, Google Pay, and cards supported where available.
          </p>
        </div>
      </div>

      <aside className="col-span-5 space-y-4 sm:col-span-full">
        <SummaryCard
          event={event}
          amount={amount}
          fundLabel={fundLabel}
          charityName={charityName}
          donorEmail={donorEmail}
        />
      </aside>
    </div>
  );
}

function SummaryCard({
  event,
  amount,
  fundLabel,
  charityName,
  donorEmail,
}: {
  event: CommunityEventRecord;
  amount: number;
  fundLabel: string;
  charityName?: string;
  donorEmail: string;
}) {
  const progress = getDonationProgress(event);
  const percent = progress.goal
    ? Math.min(100, Math.round(((progress.raised + amount) / progress.goal) * 100))
    : 0;

  return (
    <div className="sticky top-28 rounded-3xl border border-[#E8D4F4] bg-[#FCF2FF]/40 p-6">
      {event.coverImage ? (
        <div className="relative mb-4 h-32 overflow-hidden rounded-2xl">
          <Image src={event.coverImage} alt="" fill className="object-cover" />
        </div>
      ) : null}
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-color-100">
        Donation summary
      </p>
      <h2 className="mt-1 font-serif text-xl font-bold text-mono-100">{event.title}</h2>
      <p className="mt-4 font-primary text-[36px] text-[#611192]">{`$${amount.toFixed(2)}`}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3 border-b border-[#E8D4F4]/60 pb-2">
          <dt className="text-mono-70">Fund</dt>
          <dd className="font-semibold text-mono-100">{fundLabel}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-[#E8D4F4]/60 pb-2">
          <dt className="text-mono-70">Beneficiary</dt>
          <dd className="text-right font-semibold text-mono-100">
            {charityName || 'Angelpage Community Fund'}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-mono-70">Receipt email</dt>
          <dd className="truncate text-right text-mono-100">{donorEmail}</dd>
        </div>
      </dl>
      {progress.goal > 0 && (
        <div className="mt-5 rounded-2xl border border-[#E8D4F4]/60 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-mono-70">
            Goal after your gift
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8D4F4]/50">
            <div
              className="h-full rounded-full bg-primary-color-100 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-mono-70">{percent}% of ${progress.goal.toLocaleString()}</p>
        </div>
      )}
      <div className="mt-4 flex items-start gap-2 text-xs text-mono-70">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-color-100" />
        100% of your gift is allocated to the fund you selected. Instant receipt by email.
      </div>
    </div>
  );
}

export default function EventDonationCheckoutClient({ slug, initialEvent }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fundParam = searchParams?.get('fund');
  const amountParam = searchParams?.get('amount');
  const nameParam = searchParams?.get('name');
  const emailParam = searchParams?.get('email');
  const anonymousParam = searchParams?.get('anonymous');
  const { data: session } = useSession();
  const { data: fetchedEvent, isLoading } = useGetEventBySlugQuery(slug, { skip: !slug });
  const event = fetchedEvent ?? initialEvent;

  const funds = useMemo(() => resolveEventFunds(event), [event]);

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [selectedFundId, setSelectedFundId] = useState(
    fundParam || funds[0]?.id || 'direct-purchase',
  );
  const [amount, setAmount] = useState<number>(Number(amountParam) || 50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(nameParam || session?.user?.name || '');
  const [donorEmail, setDonorEmail] = useState(emailParam || session?.user?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(anonymousParam === '1');
  const [creating, setCreating] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [charityName, setCharityName] = useState<string>('');

  useEffect(() => {
    if (fundParam) setSelectedFundId(fundParam);
    if (amountParam) setAmount(Number(amountParam));
  }, [fundParam, amountParam]);

  if (isLoading && !event) {
    return <FullScreenLoader label="Loading donation" />;
  }

  if (!event) {
    return (
      <div className="bg-[#FCF2FF] py-20">
        <div className="custom-container max-w-xl rounded-3xl bg-white px-8 py-12 text-center">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#611192] uppercase">
            Donation
          </p>
          <h1 className="mt-3 font-primary text-[36px] text-[#0B0112]">
            This appeal is not open
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#6B686E]">
            The donation page is here, but this event is not accepting gifts
            right now. Choose another appeal from the events list.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[#611192] px-6 text-[14px] font-semibold text-white"
          >
            Browse events
          </Link>
        </div>
      </div>
    );
  }

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const selectedFund = funds.find(f => f.id === selectedFundId) || funds[0];

  const startPayment = async () => {
    if (!stripePromise) {
      ToastService.error('Card payments are not configured on this server yet.');
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      ToastService.error('Minimum donation is $1.');
      return;
    }
    if (!donorEmail.trim()) {
      ToastService.error('Email is required for your receipt.');
      return;
    }

    setCreating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}/donations`,
        {
          amount: finalAmount,
          fundId: selectedFundId,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          isAnonymous,
        },
        session?.token
          ? { headers: { Authorization: `Bearer ${session.token}` } }
          : undefined,
      );

      setDonationId(res.data.donationId);
      setClientSecret(res.data.clientSecret);
      setCharityName(res.data.charityName || '');
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Could not start checkout.';
      ToastService.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF2FF] pb-20 pt-8">
      <div className="custom-container max-w-5xl">
        <Link
          href={`/events/${slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-mono-70 hover:text-primary-color-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>

        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-color-100">
            Smart giving checkout
          </p>
          <h1 className="mt-2 font-primary text-[40px] leading-none text-[#0B0112] sm:text-[32px]">
            Complete your donation
          </h1>
          <div className="mt-4 flex gap-2">
            {['Details', 'Payment', 'Receipt'].map((label, idx) => {
              const active =
                (step === 'details' && idx === 0) ||
                (step === 'payment' && idx <= 1);
              const done = step === 'payment' && idx === 0;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    active
                      ? 'bg-primary-color-100 text-white'
                      : 'bg-white text-mono-70 ring-1 ring-[#E8D4F4]'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      done ? 'bg-white/20' : active ? 'bg-white/20' : 'bg-[#FCF2FF]'
                    }`}
                  >
                    {done ? '✓' : idx + 1}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {step === 'details' && (
          <div className="grid grid-cols-12 gap-8 sm:grid-cols-1">
            <div className="col-span-7 space-y-5 sm:col-span-full">
              <section className="rounded-3xl border border-[#E8D4F4] bg-white p-6 shadow-xs">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-mono-70">
                  1. Choose fund
                </h2>
                <div className="mt-3 space-y-2">
                  {funds.map(fund => (
                    <button
                      key={fund.id}
                      type="button"
                      onClick={() => setSelectedFundId(fund.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedFundId === fund.id
                          ? 'border-primary-color-100 bg-primary-color-70/50'
                          : 'border-[#E8D4F4] hover:border-primary-color-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-mono-100">{fund.label}</span>
                        {fund.percent ? (
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-primary-color-100">
                            {fund.percent}%
                          </span>
                        ) : null}
                      </div>
                      {fund.description ? (
                        <p className="mt-1 text-xs text-mono-70">{fund.description}</p>
                      ) : null}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[#E8D4F4] bg-white p-6 shadow-xs">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-mono-70">
                  2. Amount
                </h2>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-2">
                  {PRESET_AMOUNTS.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`rounded-xl border py-3 text-sm font-bold ${
                        amount === val && !customAmount
                          ? 'border-primary-color-100 bg-primary-color-100 text-white'
                          : 'border-[#E8D4F4] bg-white text-mono-100'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  placeholder="Custom amount ($)"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-[#E8D4F4] px-4 py-3 text-sm outline-hidden focus:border-primary-color-100"
                />
              </section>

              <section className="rounded-3xl border border-[#E8D4F4] bg-white p-6 shadow-xs">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-mono-70">
                  3. Your details
                </h2>
                <div className="mt-3 grid gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    disabled={isAnonymous}
                    className="rounded-xl border border-[#E8D4F4] px-4 py-3 text-sm outline-hidden focus:border-primary-color-100 disabled:bg-mono-20"
                  />
                  <input
                    type="email"
                    placeholder="Email for receipt *"
                    value={donorEmail}
                    onChange={e => setDonorEmail(e.target.value)}
                    className="rounded-xl border border-[#E8D4F4] px-4 py-3 text-sm outline-hidden focus:border-primary-color-100"
                  />
                  <label className="flex items-center gap-2 text-sm text-mono-70">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="accent-primary-color-100"
                    />
                    Give anonymously on the public ledger
                  </label>
                </div>
              </section>

              <button
                type="button"
                onClick={startPayment}
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-color-100 py-4 text-sm font-bold text-white hover:bg-primary-color-50 disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue to secure payment
                    <Lock className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <aside className="col-span-5 sm:col-span-full">
              <SummaryCard
                event={event}
                amount={finalAmount || 0}
                fundLabel={selectedFund?.label || ''}
                charityName={charityName}
                donorEmail={donorEmail || '—'}
              />
            </aside>
          </div>
        )}

        {step === 'payment' && clientSecret && donationId && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: STRIPE_DONATION_APPEARANCE,
            }}
          >
            <PaymentStep
              event={event}
              donationId={donationId}
              clientSecret={clientSecret}
              amount={finalAmount}
              fundLabel={selectedFund?.label || ''}
              charityName={charityName}
              donorEmail={donorEmail.trim()}
              donorName={donorName.trim()}
              isAnonymous={isAnonymous}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
