'use client';

import React, { useState, useMemo } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsShell from '@/components/dashboard/AnalyticsShell';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import PlatformSplitChart from '@/components/dashboard/PlatformSplitChart';
import UsersTable from './UserTable';
import FailedPaymentsTable from './FailedPaymentsTable';
import { CHARITY_SHARE_PERCENT, CHARITY_SHARE_RATE, PLATFORM_FEE_PERCENT } from '@/constants/brand';

interface ProductDetail {
  createdAt: string;
  totalRevenueGenerated: number;
  quantitySold?: number;
}

interface AnalyticsPageProps {
  totalRevenue: number;
  salesChange: number;
  soldItemsCount: number;
  totalUsersLength: number;
  userChangePerchent: number;
  totalReturningUsers: number;
  returningUserPercent: number;
  totalUserSessions: number;
  sessionsUserPercent: number;
  productDetails?: ProductDetail[];
  salesChartData?: { label: string; revenue: number; orders: number }[];
  loading?: boolean;
  onPeriodChange?: (period: 'Week' | 'Month' | 'Year') => void;
}

const buildMonthlyChart = (details: ProductDetail[] = []) => {
  const buckets: Record<string, { revenue: number; orders: number; label: string }> = {};

  details.forEach(item => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleString('default', { month: 'short' });
    if (!buckets[key]) buckets[key] = { revenue: 0, orders: 0, label };
    buckets[key].revenue += item.totalRevenueGenerated || 0;
    buckets[key].orders += item.quantitySold || 1;
  });

  return Object.values(buckets).slice(-12);
};

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  totalRevenue = 0,
  salesChange = 0,
  soldItemsCount = 0,
  totalUsersLength = 0,
  userChangePerchent = 0,
  totalReturningUsers = 0,
  returningUserPercent = 0,
  totalUserSessions = 0,
  sessionsUserPercent = 0,
  productDetails = [],
  salesChartData = [],
  loading = false,
  onPeriodChange,
}) => {
  const [period, setPeriod] = useState<'Week' | 'Month' | 'Year'>('Month');
  const handlePeriodChange = (p: 'Week' | 'Month' | 'Year') => {
    setPeriod(p);
    onPeriodChange?.(p);
  };
  const fallbackChart = useMemo(() => buildMonthlyChart(productDetails), [productDetails]);
  const chartData = salesChartData.length > 0 ? salesChartData : fallbackChart;
  const charityShare = totalRevenue * CHARITY_SHARE_RATE;
  const platformFee = totalRevenue * (PLATFORM_FEE_PERCENT / 100);

  return (
    <AnalyticsShell
      title="Platform analytics"
      subtitle="AngelPage marketplace performance, revenue split, and user activity"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Platform revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            change={salesChange}
            subtitle="all time"
            loading={loading}
            accent="purple"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Products sold"
            value={soldItemsCount}
            change={salesChange}
            subtitle="total units"
            loading={loading}
            accent="green"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Platform users"
            value={totalUsersLength.toLocaleString()}
            change={userChangePerchent}
            subtitle="registered"
            loading={loading}
            accent="blue"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Active sessions"
            value={totalUserSessions.toLocaleString()}
            change={sessionsUserPercent}
            subtitle="this week"
            loading={loading}
            accent="amber"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <PerformanceChart
            title="Sales trend"
            period={period}
            onPeriodChange={handlePeriodChange}
            data={chartData}
            loading={loading}
            totalRevenue={totalRevenue}
            changePercent={salesChange}
            revenueLabel="all time"
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <PlatformSplitChart
            totalRevenue={totalRevenue}
            charityShare={charityShare}
            platformFee={platformFee}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Returning users"
            value={totalReturningUsers.toLocaleString()}
            change={returningUserPercent}
            subtitle="all time"
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label={`Charity share (${CHARITY_SHARE_PERCENT}%)`}
            value={`£${charityShare.toFixed(2)}`}
            subtitle="donated to charities"
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label={`Platform fee (${PLATFORM_FEE_PERCENT}%)`}
            value={`£${platformFee.toFixed(2)}`}
            subtitle="admin commission"
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border border-[#E6E3E7] bg-white shadow-xs overflow-hidden">
            <UsersTable />
          </div>
        </div>
        <div className="col-span-12">
          <div className="rounded-2xl border border-[#E6E3E7] bg-white shadow-xs overflow-hidden">
            <FailedPaymentsTable />
          </div>
        </div>
      </div>
    </AnalyticsShell>
  );
};

export default AnalyticsPage;
