'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import BusinessOverview from './BusinessOverview';
import RevenueStatistics from './RevenueStatistics';
import CustomerAcquisition from './CustomerAcquisition';

const AnalyticsPage = () => {
  const { data: session } = useSession() || {};
  const [dashboardData, setDashboardData] = useState(null); // Seller Data
  const [period, setPeriod] = useState('Year');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Seller Data
  useEffect(() => {
    if (session?.token) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/order/seller/${session.user.id}/sold`,
            {
              headers: { Authorization: `Bearer ${session.token}` },
            }
          );
          console.log(response.data);
          setDashboardData(response.data);
        } catch (err) {
          console.error('Error fetching seller dashboard data:', err);
          setError('Failed to fetch seller analytics data.');
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [session?.token]);



  // Handle loading and error states
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboardData) {
    return <p>No data available.</p>;
  }

  // Helper function to get percentage change based on the period
  const getPeriodChange = (key) => {
    switch (period) {
      case 'Week':
        return dashboardData?.changes.weekly[key];
      case 'Month':
        return dashboardData?.changes.monthly[key];
      case 'Year':
      default:
        return dashboardData?.changes.yearly[key];
    }
  };

  // Prepare overview data for the UI
  const overviewData = {
    revenue: dashboardData?.totalRevenue || '0',
    revenueChange: getPeriodChange('revenueChange'),
    itemsSold: dashboardData?.totalSold || '0',
    itemsSoldChange: getPeriodChange('soldChange'),

  };

  return (
    <div className="analytics-page py-8">
      {/* Business Overview Section */}
      <div className="max-w-7xl mx-auto bg-white">
        <h2 className="h5 font-primary mb-6">Business Overview</h2>
        <BusinessOverview data={overviewData} />
      </div>

      {/* Revenue Statistics Section */}
      <div className="grid grid-cols-12 sm:grid-cols-6 gap-8 mx-auto mt-8">
        <div className="col-span-6 h-full">
          <RevenueStatistics
            period={period}
            setPeriod={setPeriod}
            data={[
              {
                orders: dashboardData?.totalSold || '0',
                revenue: dashboardData?.totalRevenue || '0',
              },
            ]}
            changes={dashboardData?.changes}
          />
        </div>
        <div className="col-span-6 h-full">
          <CustomerAcquisition />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
