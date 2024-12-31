'use client';
import React, { useEffect, useState } from 'react';
import { differenceInCalendarISOWeeks } from "date-fns";
import BannerSection from './Banner';
import AnalyticsPage from './Analytics';
import UsersAccountInfoMain from './Account';
import LogoutButton from '@/components/elements/button/LogoutButton';
import { useSession } from 'next-auth/react';
interface Order {
  createdAt: string;
  totalRevenueGenerated: number;
}
const AdminAccount = () => {
  const { data: session, status } = useSession() || {};
  const [activeTab, setActiveTab] = useState(0);
  const [soldItemsCount, setSoldItemsCount] = useState<number>(0);
const [totalRevenue, setTotalRevenue] = useState<number>(0);
const [salesChange, setSalesChange] = useState<number>(0);
const [totalReturningUser, setTotalReturningUser] = useState<number>(0);
const [returningUserPercent, setReturningUserPercent] =
  useState<number>(0);
  const [totalUserSessions, setTotalUserSessions] = useState<number>(0);
  const [sessionsUserPercent, setSessionsUserPercent] = useState<number>(0);
 const [totalUsers, setTotalUsers] = useState<number>(0);
 const [userChangePercent, setUserChangePercent] = useState<number>(0);

  const [loading, setLoading] = useState(true);
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
    console.log('users total response:' , data)
    if (data.success) {
      setTotalUsers(data.totalPlatformUsers || 0);
      setUserChangePercent(data.percentageChange || 0);
    }
  } catch (error) {
    console.error('Error fetching user stats:', error); 
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (status === 'authenticated') fetchUserStats();
}, [status, session]);

  const fetchSalesStats = async () => {
    try {
      if (!session?.token) {
        console.error('Session token is missing.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/admin/sales-total`,
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
        setSoldItemsCount(data.totalProductsSold || 0);
        setTotalRevenue(data.totalRevenue || 0);
         const orders: Order[] = data.productDetails;
        console.log('order sold item count total' , orders);

          // Get current and previous week's revenue
      const now = new Date();
      let currentWeekRevenue = 0;
      let previousWeekRevenue = 0;
     orders.forEach(order => {
        const orderDate = new Date(order.createdAt);

        // Determine the week difference
        const weekDiff = differenceInCalendarISOWeeks(now, orderDate);

        if (weekDiff === 0) {
          // Current week
          currentWeekRevenue += order.totalRevenueGenerated;
        } else if (weekDiff === 1) {
          // Previous week
          previousWeekRevenue += order.totalRevenueGenerated;
        }
      });
      // setSoldItemsCount(currentWeekRevenue); // Current week's total sales
      setSalesChange(
        previousWeekRevenue > 0
          ? ((currentWeekRevenue - previousWeekRevenue) /
              previousWeekRevenue) *
              100
          : 100 // If no sales in the previous week
      );
      console.log(currentWeekRevenue);
      }
    } catch (error) {
      console.error('Error fetching sales statistics:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSalesStats();
    }
  }, [status, session]);
const fetchReturningUserStats = async () => {
  try {
       if (!session?.token) {
         console.error('Session token is missing.');
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
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response Text:', errorText);
      throw new Error('Failed to fetch returning user analytics');
    }

    const data = await response.json();
    console.log('Returning user analytics:', data);

    if (data.success) {
      setTotalReturningUser(data.data.totalReturningUsers || 0);
      setReturningUserPercent(data.data.percentageChange || 0);
    }
  } catch (error) {
    console.error('Error fetching returning user analytics:', error);
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
      console.error('Session token is missing.');
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
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response Text:', errorText);
      throw new Error('Failed to fetch returning user analytics');
    }

    const data = await response.json();
    console.log('Sessions user analytics:', data);

    if (data.success) {
      setTotalUserSessions(data.data.totalPlatformSessions || 0);
      setSessionsUserPercent(data.data.percentageChange || 0);
    }
  } catch (error) {
    console.error('Error fetching returning user analytics:', error);
  }
};

useEffect(() => {
  if (status === 'authenticated') {
    fetchUserSessionsStats();
  }
}, [status, session]);

  if (loading) {
    return <p>Loading...</p>;
  }

 console.log(totalRevenue);

  return (
    <div className="charity-account-main-wrapper">
      <BannerSection soldItemsCount={soldItemsCount} />
      <div className="charity-storefront-wrapper-area">
        <div className="storefront-tabs-area">
          <div className="storefront-tabs-box">
            <div className="custom-container">
              <div className="storefront-tabs-btn-box pb-[17px] flex justify-between items-center gap-6 sm:pb-0 sm:pt-8">
                <ul className="tabs-btn-items flex items-center sm:overflow-hidden sm:pb-6 sm:overflow-x-auto gap-6 md:gap-y-4 sm:gap-3">
                  <li
                    className={`tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 0
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Analytics
                  </li>
                  <li
                    className={`tabs-btn-list body-small relative whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer ${
                      activeTab === 1
                        ? 'bg-[#FCF2FF] text-primary-color-100'
                        : 'hover:bg-[#FCF2FF] hover:text-primary-color-100'
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    Account
                  </li>
                  <li className="tabs-btn-list body-small whitespace-nowrap px-[11px] py-2 rounded-[24px] cursor-pointer">
                    <LogoutButton />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="charity-account-tabs-cont-area pb-20">
            <div className="custom-container">
              <ul className="tabs-content-area">
                {activeTab === 0 && (
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
                    />
                  </li>
                )}
                {activeTab === 1 && (
                  <li className="tabs-cont-item">
                    <UsersAccountInfoMain />
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
