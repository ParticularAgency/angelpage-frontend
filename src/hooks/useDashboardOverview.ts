'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DashboardOverviewData {
  success?: boolean;
  charityFunds?: {
    totalEarned?: number;
    totalHeldFunds?: number;
  };
  seller?: Record<string, unknown>;
  buyer?: Record<string, unknown>;
  messaging?: { unreadCount?: number; conversationCount?: number };
  listings?: { live?: number; total?: number };
}

export const useDashboardOverview = (token?: string, period = 'month') => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/dashboard/overview`, {
          params: { period: period.toLowerCase() },
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [token, period]);

  return { data, loading, error };
};

export default useDashboardOverview;
