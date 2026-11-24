'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import PeriodToggle from './PeriodToggle';

interface ChartPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  title?: string;
  period: 'Week' | 'Month' | 'Year';
  onPeriodChange: (p: 'Week' | 'Month' | 'Year') => void;
  data: ChartPoint[];
  loading?: boolean;
  totalRevenue?: number;
  changePercent?: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  title = 'Revenue overview',
  period,
  onPeriodChange,
  data,
  loading,
  totalRevenue,
  changePercent = 0,
}) => {
  const computedTotal =
    totalRevenue ?? data.reduce((sum, d) => sum + (d.revenue || 0), 0);

  return (
    <div className="rounded-2xl border border-[#E6E3E7] bg-white p-6 shadow-xs h-full flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="body-bold-medium text-mono-100 mb-1">{title}</h3>
          {loading ? (
            <div className="h-8 w-28 bg-mono-40 rounded-sm animate-pulse" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="h4 font-primary text-[#611192]">
                £{computedTotal.toFixed(2)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  changePercent >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {changePercent >= 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
              </span>
            </div>
          )}
          <p className="caption text-mono-70 mt-1">vs previous {period.toLowerCase()}</p>
        </div>
        <PeriodToggle period={period} onChange={onPeriodChange} />
      </div>

      <div className="flex-1 min-h-[260px]">
        {loading ? (
          <div className="h-full w-full bg-mono-40/40 rounded-xl animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-mono-70 body-small">
            No data for this period yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E3E7" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#6B686E' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B686E' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E6E3E7',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value, name) => {
                  const key = String(name ?? '');
                  const amount = Number(value ?? 0);
                  return [
                    key === 'revenue' ? `£${amount.toFixed(2)}` : amount,
                    key === 'revenue' ? 'Revenue' : 'Orders',
                  ];
                }}
              />
              <Bar dataKey="orders" fill="#C9C8CA" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="revenue" fill="#611192" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
