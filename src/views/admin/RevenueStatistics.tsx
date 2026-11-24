'use client';

import React from 'react';
import { CHARITY_SHARE_PERCENT, CHARITY_SHARE_RATE, PLATFORM_FEE_PERCENT } from '@/constants/brand';

interface RevenueStatisticsProps {
  period: 'Day' | 'Month' | 'Year'; // Type for period, restricting it to these three values
  setPeriod: (newPeriod: 'Day' | 'Month' | 'Year') => void; // Function to set the period
  data: {
    revenue: number;
    orders: number;
    day?: string;
    month?: string;
    year?: string;
  }[]; // Structure of data array
  totalRevenue: number;
}

const RevenueStatistics: React.FC<RevenueStatisticsProps> = ({
 totalRevenue,
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E6E3E7] bg-white p-5">
        <span className="block h-4 w-1/3 animate-pulse rounded-full bg-[#E6E3E7]" />
        <span className="block h-3 w-full animate-pulse rounded-full bg-[#E6E3E7]" />
        <span className="block h-3 w-2/3 animate-pulse rounded-full bg-[#E6E3E7]" />
      </div>
    );
  }



  // const totalRevenue = getTotalRevenue();
  const charityProfit = (totalRevenue * CHARITY_SHARE_RATE).toFixed(2);
  const salesCommission = (totalRevenue * (PLATFORM_FEE_PERCENT / 100)).toFixed(2);

  // Assuming you pass the percentage change from the parent component
  // const revenueChange = 10.05; 
  // const lastWeekRevenue = data.length > 1 ? data[data.length - 2].revenue : 0;
  // const currentWeekRevenue =
  //   data.length > 1 ? data[data.length - 1].revenue : 0;
  // const weeklyIncrease = (currentWeekRevenue - lastWeekRevenue).toFixed(2); // Calculate weekly increase dynamically

  // const isIncrease = revenueChange >= 0;

  return (
    <div className="revenue-statistics flex flex-col justify-between w-full">
      <div className="revenue-overview-card">
        <div className="card-header px-5 py-6 bg-[#f1f1f7] w-full">
          <h2 className="body-bold-regular text-mono-100">Reports Overview</h2>
        </div>
        <div className="card-body-wrapper">
          <h3 className="body-bold-large text-[#0d0113] font-medium font-secondary mb-6">
             ${totalRevenue ? totalRevenue.toFixed(2) : '0.00'} Total Platform Sales
          </h3>
          <h5 className="body-bold-medium underline mb-3 text-[#0d0113] font-medium font-secondary">
            Total Breakdown
          </h5>
          <ul className="revenue-status-lists">
            <li className="revenue-status-lists-item flex items-center gap-4 py-[15px]">
              <p className="flex gap-[14px] caption-bold max-w-[210px] w-full text-[#677788] font-medium font-secondary items-center gross-value">
                <span className="status-pill-color w-2 h-2 block rounded-full bg-[#A01BF2]"></span>{' '}
                Gross Value
              </p>
              <span className="revenue-updates caption-bold text-[#677788] font-medium font-secondary">
                 ${totalRevenue ? totalRevenue.toFixed(2) : '0.00'}
              </span>
            </li>
            <li className="revenue-status-lists-item flex items-center gap-4 py-[15px]">
              <p className="flex gap-[14px] caption-bold max-w-[210px] w-full text-[#677788] font-medium font-secondary items-center amount-split-charity">
                <span className="status-pill-color w-2 h-2 block rounded-full bg-[#323C61]"></span>{' '}
                Amount Split to Charity
              </p>
              <span className="revenue-updates caption-bold text-[#677788] font-medium font-secondary">
                £{charityProfit}
              </span>
            </li>
            <li className="revenue-status-lists-item flex items-center gap-4 py-[15px]">
              <p className="flex gap-[14px] caption-bold max-w-[210px] w-full text-[#677788] font-medium font-secondary items-center total-sales-commission">
                <span className="status-pill-color w-2 h-2 block rounded-full bg-[#F2E8F8]"></span>{' '}
                Total Sales Commission
              </p>
              <span className="revenue-updates caption-bold text-[#677788] font-medium font-secondary">
                £{salesCommission}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatistics;
