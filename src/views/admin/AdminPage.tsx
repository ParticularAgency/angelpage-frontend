'use client';
import React, { useEffect, useState } from 'react';
import BannerSection from './Banner';
import AnalyticsPage from './Analytics';
import UsersAccountInfoMain from './Account';
import LogoutButton from '@/components/elements/button/LogoutButton';
import { useSession } from 'next-auth/react';
import UploadPage from './UploadCharityLists';
import PendingListings from './PendingListings';
import ProductReviewsAdmin from './ProductReviewsAdmin';
import PromotedListingsAdmin from './PromotedListingsAdmin';
import BlogAdmin from './BlogAdmin';
import EventsAdmin from './EventsAdmin';
import OperationsPanel from './OperationsPanel';
import FinancePanel from './FinancePanel';
import AdminTeamPanel from './AdminTeamPanel';
import AdminAuditLogPanel from './AdminAuditLogPanel';
import AdminRoleBanner from '@/components/admin/AdminRoleBanner';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';
import SocialDashboard from '@/components/social/SocialDashboard';
import GalleryPanel from '@/components/gallery/GalleryPanel';
import AccountTabNav, {
  type AccountTab,
  type AccountTabGroup,
} from '@/components/account/AccountTabNav';
import { getTabsForRole } from '@/constants/adminPanels';

const ADMIN_TAB_GROUP_DEFS: AccountTabGroup[] = [
  {
    id: 'listings',
    label: 'Listings',
    tabIds: ['review', 'product-reviews', 'promoted'],
  },
  {
    id: 'content',
    label: 'Content',
    tabIds: [
      'charity-import',
      'affiliate-import',
      'gallery',
      'social-posting',
      'blog',
      'events',
    ],
  },
];
interface Order {
  createdAt: string;
  totalRevenueGenerated: number;
}
const AdminAccount = () => {
  const { data: session, status } = useSession() || {};
  const visibleTabs = getTabsForRole(
    session?.user?.role,
    (session?.user as { permissions?: string[] })?.permissions
  );
  const [activeTabId, setActiveTabId] = useState('analytics');
  const [soldItemsCount, setSoldItemsCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [salesChange, setSalesChange] = useState<number>(0);
  const [totalReturningUser, setTotalReturningUser] = useState<number>(0);
  const [returningUserPercent, setReturningUserPercent] = useState<number>(0);
  const [totalUserSessions, setTotalUserSessions] = useState<number>(0);
  const [sessionsUserPercent, setSessionsUserPercent] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userChangePercent, setUserChangePercent] = useState<number>(0);
  const [productDetails, setProductDetails] = useState<Order[]>([]);
  const [salesChartData, setSalesChartData] = useState<{ label: string; revenue: number; orders: number }[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (visibleTabs.length && !visibleTabs.some(t => t.id === activeTabId)) {
      setActiveTabId(visibleTabs[0].id);
    }
  }, [session?.user?.role, visibleTabs, activeTabId]);

  const fetchUserStats = async () => {
    try {
      if (!session?.token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/analytics`,
        {
          headers: { Authorization: `Bearer ${session.token}` },
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log('users total response:', data);
      if (data.success) {
        setTotalUsers(data.totalPlatformUsers || 0);
        setUserChangePercent(data.percentageChange || 0);
      }
    } catch (error) {
      // console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchUserStats();
  }, [status, session]);

  const fetchSalesStats = async (period = 'month') => {
    try {
      if (!session?.token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/admin/sales-total?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data && data.success) {
        setSoldItemsCount(data.soldItemsCount || data.totalProductsSold || 0);
        setTotalRevenue(data.totalRevenue || 0);
        setSalesChange(data.salesChange ?? 0);
        const orders: Order[] = data.productDetails || [];
        setProductDetails(orders);
        setSalesChartData(data.chartData || data.monthlyData || []);
      }
    } catch (error) {
      // console.error('Error fetching sales statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSalesStats();
    }
  }, [status, session]);
  const fetchReturningUserStats = async () => {
    try {
      if (!session?.token) {
        //  console.error('Session token is missing.');
        setLoading(false);
        return;
      }
      console.log('Fetching returning user analytics...');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/returning-users-weekly`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log('Returning user analytics:', data);

      if (data.success) {
        setTotalReturningUser(data.data.totalPlatformReturningUsers || 0);
        setReturningUserPercent(data.data.percentageChange || 0);
      }
    } catch (error) {
      // console.error('Error fetching returning user analytics:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReturningUserStats();
    }
  }, [status, session]);

  const fetchUserSessionsStats = async () => {
    try {
      if (!session?.token) {
        // console.error('Session token is missing.');
        setLoading(false);
        return;
      }
      console.log('Fetching returning user analytics...');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/user-sessions-weekly`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log('Sessions user analytics:', data);

      if (data.success) {
        setTotalUserSessions(data.data.totalPlatformSessions || 0);
        setSessionsUserPercent(data.data.percentageChange || 0);
      }
    } catch (error) {
      // console.error('Error fetching returning user analytics:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserSessionsStats();
    }
  }, [status, session]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  //  console.log(totalRevenue);

  if (visibleTabs.length === 0) {
    return (
      <div className="custom-container py-20 text-center">
        <p className="body-bold-small">No admin panels for this account.</p>
        <p className="body-caption text-mono-70 mt-2">
          Sign in at <a href="/admin/login" className="underline">/admin/login</a> with
          a team account, or ask Super Admin to create one under Team.
        </p>
      </div>
    );
  }

  const adminNavTabs: AccountTab[] = visibleTabs.map(tab => ({
    id: tab.id,
    label: tab.label,
  }));

  const visibleIds = new Set(adminNavTabs.map(t => t.id));
  const adminGroups = ADMIN_TAB_GROUP_DEFS.map(g => ({
    ...g,
    tabIds: g.tabIds.filter(id => visibleIds.has(id)),
  })).filter(g => g.tabIds.length > 0);

  return (
    <div className="charity-account-main-wrapper">
      <BannerSection loading={loading} soldItemsCount={soldItemsCount} />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="custom-container pb-[17px] sm:pb-0 sm:pt-8">
                <AccountTabNav
                  tabs={adminNavTabs}
                  groups={adminGroups}
                  activeTabId={activeTabId}
                  onTabChange={setActiveTabId}
                  trailing={<LogoutButton />}
                />
              </div>
            </div>
          </div>

          <div className="charity-account-tabs-cont-area pb-20">
            <div className="custom-container">
              <AdminRoleBanner
                role={session?.user?.role}
                permissions={
                  (session?.user as { permissions?: string[] })?.permissions
                }
              />
              <ul className="tabs-content-area">
                {activeTabId === 'analytics' && (
                  <li className="tabs-cont-item">
                    <AnalyticsPage
                      totalUsersLength={totalUsers}
                      userChangePerchent={userChangePercent}
                      soldItemsCount={soldItemsCount}
                      totalRevenue={totalRevenue}
                      salesChange={salesChange}
                      totalReturningUsers={totalReturningUser}
                      returningUserPercent={returningUserPercent}
                      totalUserSessions={totalUserSessions}
                      sessionsUserPercent={sessionsUserPercent}
                      productDetails={productDetails}
                      salesChartData={salesChartData}
                      loading={loading}
                      onPeriodChange={p =>
                        fetchSalesStats(
                          p === 'Week' ? 'week' : p === 'Year' ? 'year' : 'month'
                        )
                      }
                    />
                  </li>
                )}
                {activeTabId === 'account' && (
                  <li className="tabs-cont-item">
                    <UsersAccountInfoMain />
                  </li>
                )}
                {activeTabId === 'charity-import' && (
                  <li className="tabs-cont-item">
                    <UploadPage />
                  </li>
                )}
                {activeTabId === 'affiliate-import' && (
                  <li className="tabs-cont-item">
                    <AffiliateDashboard allowEbayImport />
                  </li>
                )}
                {activeTabId === 'gallery' && (
                  <li className="tabs-cont-item">
                    <GalleryPanel allowModeration />
                  </li>
                )}
                {activeTabId === 'social-posting' && (
                  <li className="tabs-cont-item">
                    <SocialDashboard />
                  </li>
                )}
                {activeTabId === 'review' && (
                  <li className="tabs-cont-item">
                    <PendingListings />
                  </li>
                )}
                {activeTabId === 'product-reviews' && (
                  <li className="tabs-cont-item">
                    <ProductReviewsAdmin />
                  </li>
                )}
                {activeTabId === 'promoted' && (
                  <li className="tabs-cont-item">
                    <PromotedListingsAdmin />
                  </li>
                )}
                {activeTabId === 'blog' && (
                  <li className="tabs-cont-item">
                    <BlogAdmin />
                  </li>
                )}
                {activeTabId === 'events' && (
                  <li className="tabs-cont-item">
                    <EventsAdmin />
                  </li>
                )}
                {activeTabId === 'team' && (
                  <li className="tabs-cont-item">
                    <AdminTeamPanel />
                  </li>
                )}
                {activeTabId === 'operations' && (
                  <li className="tabs-cont-item">
                    <OperationsPanel />
                  </li>
                )}
                {activeTabId === 'finance' && (
                  <li className="tabs-cont-item">
                    <FinancePanel />
                  </li>
                )}
                {activeTabId === 'audit' && (
                  <li className="tabs-cont-item">
                    <AdminAuditLogPanel />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
