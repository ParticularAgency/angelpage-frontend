'use client';

import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
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

interface OrderPipelinePanelProps {
  title?: string;
  summary?: StatusSummary;
  activity?: ActivityItem[];
  loading?: boolean;
}

const PIPELINE_COLORS = ['#F59E0B', '#3B82F6', '#6366F1', '#10B981'];

const statusDefs = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
] as const;

const OrderPipelinePanel: React.FC<OrderPipelinePanelProps> = ({
  title = 'Order pipeline',
  summary = {},
  activity = [],
  loading,
}) => {
  const total = summary.total || 0;

  const pieData = useMemo(
    () =>
      statusDefs
        .map((s, i) => ({
          name: s.label,
          value: Number(summary[s.key as keyof StatusSummary] || 0),
          color: PIPELINE_COLORS[i],
        }))
        .filter(d => d.value > 0),
    [summary]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E6E3E7] bg-white p-6 shadow-xs animate-pulse h-full min-h-[360px]">
        <div className="h-4 w-40 bg-mono-40 rounded-sm mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-mono-40 rounded-full mx-auto w-40" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-mono-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E6E3E7] bg-white p-5 sm:p-6 shadow-xs h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="body-bold-medium text-mono-100">{title}</h3>
        <span className="caption bg-[#FCF2FF] text-[#611192] px-3 py-1 rounded-full font-semibold">
          {total} orders
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="h-[180px] flex items-center justify-center">
          {pieData.length === 0 ? (
            <p className="text-mono-70 body-small">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [Number(value ?? 0), String(name ?? '')]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E6E3E7',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2">
          {statusDefs.map((s, i) => {
            const count = Number(summary[s.key as keyof StatusSummary] || 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={s.key}
                className="rounded-xl border border-[#F0EEF2] bg-[#FAFAFB] px-3 py-2.5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 caption text-mono-80">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIPELINE_COLORS[i] }}
                    />
                    {s.label}
                  </span>
                  <span className="forms-bold text-mono-100 text-sm">
                    {count}
                    <span className="text-mono-70 font-normal ml-1">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-mono-40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: PIPELINE_COLORS[i],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        {[
          { label: 'Paid', value: summary.paymentPaid || 0, color: 'text-emerald-600' },
          { label: 'Pending', value: summary.paymentPending || 0, color: 'text-amber-600' },
          { label: 'Failed', value: summary.paymentFailed || 0, color: 'text-red-600' },
        ].map(item => (
          <div
            key={item.label}
            className="rounded-xl bg-[#FCF2FF]/50 py-2 px-1 border border-[#F0EEF2]"
          >
            <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
            <p className="caption text-mono-70">{item.label}</p>
          </div>
        ))}
      </div>

      {activity.length > 0 && (
        <div className="flex-1 border-t border-[#F0EEF2] pt-4">
          <p className="eyebrow-small text-mono-70 uppercase mb-3">Recent activity</p>
          <ul className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {activity.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-[#FCF2FF]/60 transition-colors"
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

export default OrderPipelinePanel;
