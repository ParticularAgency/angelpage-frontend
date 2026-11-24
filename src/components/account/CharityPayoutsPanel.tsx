'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import StatCard from '@/components/dashboard/StatCard';
import useDashboardOverview from '@/hooks/useDashboardOverview';

const CharityPayoutsPanel = () => {
  const { data: session } = useSession() || {};
  const { data: dashboard } = useDashboardOverview(session?.token, 'month');
  const charityFunds = dashboard?.charityFunds;
  const [onboarding, setOnboarding] = useState(false);

  const charityId = (session?.user as { charityId?: string })?.charityId || session?.user?.id;

  const startStripeOnboard = async () => {
    if (!session?.token || !charityId) return;
    setOnboarding(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/onboard`,
        { charityId },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        ToastService.success('Stripe account connected or already set up.');
      }
    } catch {
      ToastService.error('Could not start Stripe onboarding.');
    } finally {
      setOnboarding(false);
    }
  };

  return (
    <div className="charity-payouts-panel space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="body-bold-large text-mono-100">Payouts & banking</h3>
          <p className="caption text-mono-70 mt-1">
            Connect Stripe to receive charity payouts. Held funds are released after admin approval.
          </p>
        </div>
        <Button variant="primary" onClick={startStripeOnboard} disabled={onboarding}>
          {onboarding ? 'Redirecting…' : 'Connect Stripe account'}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Profit received"
            value={`£${(charityFunds?.totalEarned || 0).toFixed(2)}`}
            subtitle="all time"
            accent="green"
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Pending payout"
            value={`£${(charityFunds?.totalHeldFunds || 0).toFixed(2)}`}
            subtitle="awaiting admin release"
            accent="amber"
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Charity share"
            value="90%"
            subtitle="of each sale to your charity"
            accent="purple"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E3E7] bg-[#FCF2FF]/40 p-5">
        <h4 className="forms-bold text-mono-100 mb-2">How payouts work</h4>
        <ol className="list-decimal list-inside space-y-2 body-small text-mono-80">
          <li>Buyer payment is held in escrow until delivery is confirmed.</li>
          <li>After the hold period, funds move to your pending balance.</li>
          <li>Admin approves payout to your connected Stripe account.</li>
          <li>You receive an email when funds are transferred.</li>
        </ol>
      </div>
    </div>
  );
};

export default CharityPayoutsPanel;
