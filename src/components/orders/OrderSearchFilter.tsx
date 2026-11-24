'use client';

import React from 'react';

interface OrderSearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  placeholder?: string;
}

const OrderSearchFilter: React.FC<OrderSearchFilterProps> = ({
  value,
  onChange,
  statusFilter,
  onStatusChange,
  placeholder = 'Search orders…',
}) => (
  <div className="flex flex-wrap gap-3 mb-4">
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 min-w-[200px] h-10 px-4 rounded-xl border border-[#E6E3E7] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#611192]/30"
    />
    <select
      value={statusFilter}
      onChange={e => onStatusChange(e.target.value)}
      className="h-10 px-4 rounded-xl border border-[#E6E3E7] text-sm bg-white"
    >
      <option value="all">All statuses</option>
      <option value="OrderPlaced">Order placed</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
);

export default OrderSearchFilter;

export const matchesOrderSearch = (
  item: { productName?: string; orderId?: string; status?: string },
  query: string,
  statusFilter: string
) => {
  const q = query.trim().toLowerCase();
  const statusOk = statusFilter === 'all' || item.status === statusFilter;
  if (!statusOk) return false;
  if (!q) return true;
  return (
    (item.productName || '').toLowerCase().includes(q) ||
    (item.orderId || '').toLowerCase().includes(q) ||
    (item.status || '').toLowerCase().includes(q)
  );
};
