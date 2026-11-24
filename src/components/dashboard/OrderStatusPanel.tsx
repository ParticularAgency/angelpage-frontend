'use client';

import React from 'react';
import StatusBadge from './StatusBadge';

interface StatusSummary {
  total?: number;
  pending?: number;
  confirmed?: number;
  shipped?: number;
  delivered?: number;
  cancelled?: number;
  paymentPending?: number;
  paymentPaid?: number;
  paymentFailed?: number;
}

interface ActivityItem {
  id: string;
  status: string;
  paymentStatus?: string;
  productName?: string;
  totalAmount?: number;
  createdAt: string;
}

interface OrderStatusPanelProps {
  title?: string;
  summary?: StatusSummary;
  activity?: ActivityItem[];
  loading?: boolean;
}

const statusItems = [
  { key: 'pending', label: 'Pending', color: 'bg-amber-400' },
  { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
  { key: 'shipped', label: 'Shipped', color: 'bg-indigo-500' },
  { key: 'delivered', label: 'Delivered', color: 'bg-emerald-500' },
];

const OrderStatusPanel: React.FC<OrderStatusPanelProps> = ({
  title = 'Order status',
  summary = {},
  activity = [],
  loading,
}) => {
  const total = summary.total || 0;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E6E3E7] bg-white p-6 shadow-xs animate-pulse h-full">
        <div className="h-4 w-32 bg-mono-40 rounded-sm mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-mono-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E6E3E7] bg-white p-6 shadow-xs h-full flex flex-col">
      <h3 className="body-bold-medium text-mono-100 mb-5">{title}</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {statusItems.map(({ key, label, color }) => {
          const count = summary[key as keyof StatusSummary] || 0;
          const pct = total > 0 ? Math.round((Number(count) / total) * 100) : 0;
          return (
            <div
              key={key}
              className="rounded-xl bg-[#F6F8FA] px-3 py-2.5 border border-transparent hover:border-[#611192]/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="caption text-mono-80">{label}</span>
                <span className="forms-bold text-mono-100">{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-mono-40 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mb-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-mono-80">Paid: {summary.paymentPaid || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-mono-80">Pending: {summary.paymentPending || 0}</span>
        </div>
      </div>

      {activity.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <p className="eyebrow-small text-mono-70 uppercase mb-3">Recent activity</p>
          <ul className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {activity.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-[#F2E8F8]/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="forms-bold text-mono-100 text-sm truncate">
                    {item.productName || 'Order'}
                  </p>
                  <p className="caption text-mono-70">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={item.status} />
                  {item.totalAmount != null && (
                    <span className="caption text-[#611192] font-semibold">
                      £{Number(item.totalAmount).toFixed(2)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderStatusPanel;
