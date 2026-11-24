'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import StatCard from '@/components/dashboard/StatCard';

const UserEarningsPanel = () => {
  const { data: session } = useSession() || {};
  const [data, setData] = useState<{
    totalEarned: number;
    pendingEscrow: number;
    releasedEscrow: number;
    disputedAmount: number;
    orderCount: number;
    recentOrders: { id: string; amount: number; escrowStatus?: string; disputeStatus?: string; status: string; createdAt: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/earnings`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.token]);

  const downloadExport = async (mode: 'sold' | 'bought') => {
    if (!session?.token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/export/orders?mode=${mode}`,
      { headers: { Authorization: `Bearer ${session.token}` } }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}-orders.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="body-small text-mono-70 py-8">Loading earnings…</p>;
  }

  return (
    <div className="user-earnings-panel space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="body-bold-large text-mono-100">Earnings & payouts</h3>
          <p className="caption text-mono-70">
            Track seller revenue, escrow holds, and export order history for tax records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => downloadExport('sold')}>
            Export sold (CSV)
          </Button>
          <Button variant="secondary" onClick={() => downloadExport('bought')}>
            Export bought (CSV)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard label="Total earned" value={`£${(data?.totalEarned || 0).toFixed(2)}`} accent="purple" />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard label="In escrow" value={`£${(data?.pendingEscrow || 0).toFixed(2)}`} subtitle="held until release" accent="amber" />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard label="Released" value={`£${(data?.releasedEscrow || 0).toFixed(2)}`} accent="green" />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard label="In dispute" value={`£${(data?.disputedAmount || 0).toFixed(2)}`} accent="blue" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E3E7] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0EEF2]">
          <h4 className="forms-bold text-mono-100">Recent seller orders</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#FAFAFB]">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Escrow</th>
                <th className="px-4 py-2 text-left">Dispute</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).map(o => (
                <tr key={o.id} className="border-t border-[#F0EEF2]">
                  <td className="px-4 py-2">{String(o.id).slice(-8)}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">{o.escrowStatus || '—'}</td>
                  <td className="px-4 py-2">{o.disputeStatus || 'NONE'}</td>
                  <td className="px-4 py-2 text-right">£{Number(o.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserEarningsPanel;
