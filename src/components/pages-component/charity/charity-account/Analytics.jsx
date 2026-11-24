'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsShell from '@/components/dashboard/AnalyticsShell';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import OrderPipelinePanel from '@/components/dashboard/OrderPipelinePanel';
import useDashboardOverview from '@/hooks/useDashboardOverview';

const AnalyticsPage = () => {
  const { data: session } = useSession() || {};
  const [period, setPeriod] = useState('Month');
  const apiPeriod = period === 'Week' ? 'week' : period === 'Year' ? 'year' : 'month';
  const { data, loading, error } = useDashboardOverview(session?.token, apiPeriod);

  const seller = data?.seller;
  const charityFunds = data?.charityFunds;
  const messaging = data?.messaging;

  const chartData = useMemo(() => {
    if (!seller) return [];
    if (period === 'Week') return seller.weeklyData || [];
    if (period === 'Year') return seller.yearlyData || [];
    return seller.monthlyData || [];
  }, [seller, period]);

  const changeKey = period === 'Week' ? 'weekly' : period === 'Year' ? 'yearly' : 'monthly';
  const revenueChange = seller?.changes?.[changeKey]?.revenueChange ?? 0;
  const soldChange = seller?.changes?.[changeKey]?.soldChange ?? 0;

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 body-small">{error}</p>
      </div>
    );
  }

  return (
    <AnalyticsShell
      title="Charity storefront analytics"
      subtitle="Revenue, earnings, order pipeline, and shop health for your charity"
      badge={
        messaging?.unreadCount > 0 ? (
          <Link
            href="/messaging/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white forms-bold text-sm hover:bg-white/25 transition-colors border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {messaging.unreadCount} unread
          </Link>
        ) : null
      }
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Revenue"
            value={`£${(seller?.revenue || 0).toFixed(2)}`}
            change={revenueChange}
            subtitle={`this ${apiPeriod}`}
            loading={loading}
            accent="purple"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Items sold"
            value={seller?.itemsSold || 0}
            change={soldChange}
            subtitle={`this ${apiPeriod}`}
            loading={loading}
            accent="green"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Profit received"
            value={`£${(charityFunds?.totalEarned || 0).toFixed(2)}`}
            subtitle="all time"
            loading={loading}
            accent="blue"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <StatCard
            label="Pending payout"
            value={`£${(charityFunds?.totalHeldFunds || 0).toFixed(2)}`}
            subtitle="awaiting approval"
            loading={loading}
            accent="amber"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <PerformanceChart
            title="Sales performance"
            period={period}
            onPeriodChange={setPeriod}
            data={chartData}
            loading={loading}
            totalRevenue={seller?.revenue}
            changePercent={revenueChange}
            revenueLabel={`this ${apiPeriod}`}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <OrderPipelinePanel
            title="Order pipeline"
            summary={seller?.statusSummary}
            activity={seller?.recentActivity}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Live listings"
            value={data?.listings?.live || 0}
            subtitle={`${data?.listings?.total || 0} total products`}
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Charity profit (period)"
            value={`£${(seller?.charityProfit || 0).toFixed(2)}`}
            subtitle="90% of sales"
            loading={loading}
          />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <StatCard
            label="Buyer messages"
            value={messaging?.unreadCount || 0}
            subtitle="unread inquiries"
            loading={loading}
          />
        </div>
      </div>
    </AnalyticsShell>
  );
};

export default AnalyticsPage;
