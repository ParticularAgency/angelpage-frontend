'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import CharityApproval from './CharityApproval';
import { Button } from '@/components/elements';

const FinancePanel: React.FC = () => {
  const { data: session } = useSession() || {};
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [soldItemsCount, setSoldItemsCount] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/admin/sales-total`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        const data = await res.json();
        if (data.success) {
          setTotalRevenue(data.totalRevenue || 0);
          setSoldItemsCount(data.soldItemsCount || 0);
          setSalesChange(data.salesChange || 0);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.token]);

  const exportFinance = async () => {
    if (!session?.token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/operations/export/orders`,
      { headers: { Authorization: `Bearer ${session.token}` } }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-orders-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="body-small text-mono-70 mt-6">Loading finance data…</p>;
  }

  return (
    <div className="finance-panel mt-6 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="body-bold-large">Finance overview</h3>
        <Button variant="secondary" onClick={exportFinance}>
          Export orders (CSV)
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="caption text-mono-70">Platform revenue</p>
          <p className="h4 text-[#611192] mt-1">£{totalRevenue.toFixed(2)}</p>
          <p className="caption text-mono-70 mt-1">
            {salesChange >= 0 ? '+' : ''}
            {salesChange.toFixed(1)}% vs prior period
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="caption text-mono-70">Items sold</p>
          <p className="h4 text-mono-100 mt-1">{soldItemsCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="caption text-mono-70">Charity share policy</p>
          <p className="body-small text-mono-80 mt-2">
            90% of each sale is allocated to charity. Platform fee is 10%.
          </p>
        </div>
      </div>

      <CharityApproval />
    </div>
  );
};

export default FinancePanel;
