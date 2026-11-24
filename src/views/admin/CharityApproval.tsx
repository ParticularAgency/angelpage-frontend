'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface CharityRow {
  _id: string;
  charityName: string;
  totalHeldFunds: number;
  email?: string;
  stripeAccountId?: string;
}

const CharityApproval = () => {
  const { data: session } = useSession() || {};
  const [charities, setCharities] = useState<CharityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchCharities = useCallback(async () => {
    if (!session?.token) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/charities/pending-approval`,
        { headers: { Authorization: `Bearer ${session?.token}` } }
      );
      setCharities(
        Array.isArray(response.data) ? response.data : response.data.charities || []
      );
    } catch {
      setError('Error fetching charities pending payout.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchCharities();
  }, [fetchCharities]);

  const handleApproveFundsRelease = async (charityId: string) => {
    setApprovingId(charityId);
    setError('');
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/funds/release/${charityId}`,
        {},
        { headers: { Authorization: `Bearer ${session?.token}` } }
      );
      ToastService.success('Payout approved and transferred.');
      setCharities(prev => prev.filter(c => c._id !== charityId));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response
          ?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to approve payout.';
      setError(msg);
      ToastService.error(msg);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="charity-approval mt-6">
      <h3 className="body-bold-large mb-2">Charity payouts pending approval</h3>
      <p className="caption text-mono-70 mb-6">
        Approve held funds to transfer to each charity&apos;s connected Stripe account.
      </p>
      {loading && (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#E6E3E7] bg-white p-5">
          <span className="block h-4 w-1/3 animate-pulse rounded-full bg-[#E6E3E7]" />
          <span className="block h-3 w-full animate-pulse rounded-full bg-[#E6E3E7]" />
          <span className="block h-3 w-4/5 animate-pulse rounded-full bg-[#E6E3E7]" />
        </div>
      )}
      {error && <p className="text-red-600 body-small mb-4">{error}</p>}
      {!loading && charities.length === 0 ? (
        <p className="body-small text-mono-70 rounded-xl border bg-white p-6">
          No charities pending payout approval.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F1F1F7]">
              <tr>
                <th className="px-4 py-3 text-left">Charity</th>
                <th className="px-4 py-3 text-left">Held funds</th>
                <th className="px-4 py-3 text-left">Stripe</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {charities.map(charity => (
                <tr key={charity._id} className="border-t">
                  <td className="px-4 py-3">{charity.charityName}</td>
                  <td className="px-4 py-3 font-semibold text-[#611192]">
                    £{Number(charity.totalHeldFunds || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {charity.stripeAccountId ? (
                      <span className="text-emerald-700 text-xs font-semibold">Connected</span>
                    ) : (
                      <span className="text-amber-700 text-xs font-semibold">Not connected</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="primary"
                      onClick={() => handleApproveFundsRelease(charity._id)}
                      disabled={approvingId === charity._id || !charity.stripeAccountId}
                    >
                      {approvingId === charity._id ? 'Processing…' : 'Approve payout'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CharityApproval;
