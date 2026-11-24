'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import EventDonationReceiptView from '@/components/features/events/EventDonationReceipt';
import type { EventDonationReceipt } from '@/lib/server-api';

export default function EventDonationSuccessClient() {
  const searchParams = useSearchParams();
  const donationId = searchParams?.get('donationId');
  const paymentIntent =
    searchParams?.get('payment_intent') || searchParams?.get('paymentIntentId');

  const [receipt, setReceipt] = useState<EventDonationReceipt | null>(null);
  const [eventSlug, setEventSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!donationId) {
      setError('Missing donation reference.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        if (paymentIntent) {
          const confirmRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/events/donations/${donationId}/confirm`,
            { params: { payment_intent: paymentIntent } },
          );
          setReceipt(confirmRes.data.receipt);
          setEventSlug(confirmRes.data.event?.slug || null);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/donations/${donationId}/receipt`,
        );
        setReceipt(res.data.receipt);
        setEventSlug(res.data.event?.slug || null);

        if (res.data.receipt?.paymentStatus === 'pending' && paymentIntent) {
          const confirmRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/events/donations/${donationId}/confirm`,
            { paymentIntentId: paymentIntent },
          );
          setReceipt(confirmRes.data.receipt);
        }
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : 'Could not load your receipt.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [donationId, paymentIntent]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-color-100" />
        <p className="text-sm text-mono-70">Confirming your donation…</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="custom-container max-w-lg py-20 text-center">
        <p className="text-mono-100">{error || 'Receipt not found.'}</p>
        <Link href="/events" className="mt-4 inline-block text-primary-color-100 underline">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16">
      <div className="custom-container max-w-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCF2FF] text-primary-color-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-mono-100">Thank you!</h1>
          <p className="mt-2 text-sm text-mono-70">
            Your gift is confirmed. A receipt has been emailed to you.
          </p>
        </div>

        <EventDonationReceiptView receipt={receipt} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {eventSlug ? (
            <Link
              href={`/events/${eventSlug}`}
              className="flex-1 rounded-2xl bg-primary-color-100 py-3 text-center text-sm font-bold text-white"
            >
              Return to event
            </Link>
          ) : null}
          <Link
            href="/events"
            className="flex-1 rounded-2xl border border-[#E8D4F4] py-3 text-center text-sm font-semibold text-mono-100"
          >
            Browse more events
          </Link>
        </div>
      </div>
    </div>
  );
}
