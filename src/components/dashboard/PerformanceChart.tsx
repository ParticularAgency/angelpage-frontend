'use client';

import React from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PeriodToggle from './PeriodToggle';

export interface ChartPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface PerformanceChartProps {
  title?: string;
  period: 'Week' | 'Month' | 'Year';
  onPeriodChange: (p: 'Week' | 'Month' | 'Year') => void;
  data: ChartPoint[];
  loading?: boolean;
  totalRevenue?: number;
  changePercent?: number;
  revenueLabel?: string;
  className?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E6E3E7] bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-mono-100 mb-2">{label}</p>
      {payload.map(entry => (
        <p key={entry.dataKey} className="text-mono-70 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.dataKey === 'revenue'
            ? `Revenue: £${Number(entry.value).toFixed(2)}`
            : `Orders: ${entry.value}`}
        </p>
      ))}
    </div>
  );
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = 'Performance',
  period,
  onPeriodChange,
  data,
  loading,
  totalRevenue,
  changePercent = 0,
  revenueLabel = 'Total',
  className = '',
}) => {
  const computedTotal =
    totalRevenue ?? data.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalOrders = data.reduce((sum, d) => sum + (d.orders || 0), 0);

  return (
    <div
      className={`rounded-2xl border border-[#E6E3E7] bg-white p-5 sm:p-6 shadow-xs h-full flex flex-col ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="body-bold-medium text-mono-100">{title}</h3>
          {loading ? (
            <div className="h-9 w-36 bg-mono-40 rounded-lg mt-2 animate-pulse" />
          ) : (
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-primary font-semibold text-[#611192]">
                £{computedTotal.toFixed(2)}
              </span>
              <span className="text-sm text-mono-70">
                {totalOrders} orders · {revenueLabel}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  changePercent >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {changePercent >= 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <PeriodToggle period={period} onChange={onPeriodChange} />
      </div>

      <div className="flex-1 min-h-[280px] rounded-xl bg-linear-to-b from-[#FCF2FF]/40 to-transparent p-2">
        {loading ? (
          <div className="h-full w-full bg-mono-40/30 rounded-xl animate-pulse" />
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-mono-70 body-small">
            No data for this period yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#611192" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#611192" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E6E3E7" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#6B686E' }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11, fill: '#6B686E' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `£${v}`}
                width={48}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#611192"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
              />
              <Bar
                yAxisId="orders"
                dataKey="orders"
                fill="#C4B5FD"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                opacity={0.85}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#8B5CF6', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
