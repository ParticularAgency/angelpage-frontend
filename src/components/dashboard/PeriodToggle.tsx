'use client';

import React from 'react';

type Period = 'Week' | 'Month' | 'Year';

interface PeriodToggleProps {
  period: Period;
  onChange: (period: Period) => void;
}

const PeriodToggle: React.FC<PeriodToggleProps> = ({ period, onChange }) => (
  <div className="inline-flex items-center rounded-full bg-[#F2E8F8] p-1 gap-0.5">
    {(['Week', 'Month', 'Year'] as Period[]).map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => onChange(p)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          period === p
            ? 'bg-[#611192] text-white shadow-xs'
            : 'text-mono-80 hover:text-[#611192]'
        }`}
      >
        {p}
      </button>
    ))}
  </div>
);

export default PeriodToggle;
