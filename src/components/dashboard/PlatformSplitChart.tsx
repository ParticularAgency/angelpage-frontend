'use client';

import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PlatformSplitChartProps {
  totalRevenue: number;
  charityShare: number;
  platformFee: number;
  loading?: boolean;
}

const PlatformSplitChart: React.FC<PlatformSplitChartProps> = ({
  totalRevenue,
  charityShare,
  platformFee,
  loading,
}) => {
  const data = [
    { name: 'Charity share', value: charityShare, color: '#10B981' },
    { name: 'Platform fee', value: platformFee, color: '#611192' },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E6E3E7] bg-white p-6 shadow-xs h-full min-h-[320px] animate-pulse">
        <div className="h-4 w-32 bg-mono-40 rounded-sm mb-6" />
        <div className="h-48 w-48 bg-mono-40 rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E6E3E7] bg-white p-5 sm:p-6 shadow-xs h-full flex flex-col">
      <h3 className="body-bold-medium text-mono-100 mb-1">Revenue split</h3>
      <p className="caption text-mono-70 mb-4">
        £{totalRevenue.toFixed(2)} total marketplace volume
      </p>

      <div className="flex-1 min-h-[200px] flex items-center justify-center">
        {data.length === 0 ? (
          <p className="body-small text-mono-70">No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`£${Number(value ?? 0).toFixed(2)}`, '']}
                contentStyle={{ borderRadius: 12, border: '1px solid #E6E3E7' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">
          <p className="caption text-emerald-800">Charity</p>
          <p className="text-lg font-semibold text-emerald-700">
            £{charityShare.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl bg-[#FCF2FF] p-3 border border-[#E6D4F5]">
          <p className="caption text-[#611192]">Platform</p>
          <p className="text-lg font-semibold text-[#611192]">
            £{platformFee.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlatformSplitChart;
