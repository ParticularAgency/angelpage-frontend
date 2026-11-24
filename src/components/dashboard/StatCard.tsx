'use client';

import React from 'react';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  accent?: 'purple' | 'green' | 'blue' | 'amber';
}

const accentMap = {
  purple: {
    gradient: 'from-[#611192] to-[#8B3AB8]',
    border: 'border-l-[#611192]',
    glow: 'group-hover:shadow-[#611192]/10',
  },
  green: {
    gradient: 'from-emerald-600 to-emerald-400',
    border: 'border-l-emerald-500',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  blue: {
    gradient: 'from-sky-600 to-sky-400',
    border: 'border-l-sky-500',
    glow: 'group-hover:shadow-sky-500/10',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-300',
    border: 'border-l-amber-500',
    glow: 'group-hover:shadow-amber-500/10',
  },
};

const getTrend = (change?: number): Trend => {
  if (change == null || change === 0) return 'neutral';
  return change > 0 ? 'up' : 'down';
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  subtitle,
  icon,
  loading,
  accent = 'purple',
}) => {
  const trend = getTrend(change);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E6E3E7] bg-white p-5 shadow-xs animate-pulse">
        <div className="h-3 w-24 bg-mono-40 rounded-sm mb-4" />
        <div className="h-8 w-32 bg-mono-40 rounded-sm mb-3" />
        <div className="h-3 w-20 bg-mono-40 rounded-sm" />
      </div>
    );
  }

  const accentStyle = accentMap[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[#E6E3E7] border-l-4 ${accentStyle.border} bg-white p-5 shadow-xs hover:shadow-lg ${accentStyle.glow} transition-all duration-200 h-full`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="forms-bold text-mono-80 text-xs uppercase tracking-wide">
          {label}
        </p>
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl bg-linear-to-br ${accentStyle.gradient} flex items-center justify-center text-white shrink-0 shadow-xs`}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="h4 font-primary text-mono-100 mb-2">{value}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {change != null && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trend === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend === 'down'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-mono-40 text-mono-80'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
            {Math.abs(Number(change)).toFixed(1)}%
          </span>
        )}
        {subtitle && (
          <span className="caption text-mono-70">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
