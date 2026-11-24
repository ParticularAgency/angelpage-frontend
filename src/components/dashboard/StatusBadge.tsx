'use client';

import React from 'react';

const statusStyles: Record<string, string> = {
  OrderPlaced: 'bg-amber-50 text-amber-700 border-amber-200',
  OrderConfirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Failed: 'bg-red-50 text-red-600 border-red-200',
  unread: 'bg-[#F2E8F8] text-[#611192] border-[#611192]/20',
  read: 'bg-mono-40 text-mono-80 border-mono-40',
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status?.replace(/\s+/g, '') || 'Pending';
  const style =
    statusStyles[normalized] ||
    statusStyles[status] ||
    'bg-mono-40 text-mono-80 border-mono-40';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold capitalize ${style} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {status?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
