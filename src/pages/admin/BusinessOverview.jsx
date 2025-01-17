'use client';

import React from 'react';

// interface BusinessOverviewData {
//   revenue: number;
//   revenueChange: number; // Percentage change in revenue
//   itemsSold: number;
//   itemsSoldChange: number; // Percentage change in items sold
//   itemsBought: number;
//   itemsBoughtChange: number; // Percentage change in items bought
//   moneySpent: number;
//   moneySpentChange: number; // Percentage change in money spent
//   totalUsers: number;
//   userChange: number;
//   returningUsers: number;
//   totalReturningUsers: number;
//   returningUserPercent: number; // Percentage change in returning users
//   totalUserSessions: number;
//   sessionsUserPercent: number; // Percentage change in sessions
// }

// interface BusinessOverviewProps {
//   data: Partial<BusinessOverviewData>; // Allow partial data to handle missing properties
// }

const BusinessOverview = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const formatChange = (value) =>
    value >= 0 ? `↑ ${Math.abs(value)}%` : `↓ ${Math.abs(value)}%`;

  const getBadgeStyle = (value) =>
    value >= 0
      ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
      : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]';

  // Provide default values using destructuring
  const {
    totalUsers = 0,
    userChange = 0,
    // returningUsers = 0,
    // returningUsersChange = 0,
    itemsSold = 0,
    itemsSoldChange = 0,
    totalUserSessions = 0,
    sessionsUserPercent = 0,
    totalReturningUsers = 0,
    returningUserPercent = 0,
  } = data;
const formattedItemsSold = Number(itemsSoldChange).toFixed(2);
const formattedItemSession = Number(sessionsUserPercent).toFixed(2);
const formattedTotalUser = Number(userChange).toFixed(2);
const formattedReturningUser = Number(returningUserPercent).toFixed(2);

  return (
    <div className="grid grid-cols-12 sm:grid-cols-6 gap-5 business-overview-area">
      {/* Total Users */}
      <div className="col-span-3 sm:col-span-full md:col-span-6 px-4 pt-[21px] pb-[23px] border border-[#cdd3da] analytics-card-items">
        <h4 className="body-bold-small">Total Users</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          {totalUsers.toLocaleString()}
        </p>
        <p className="body-bold-small mt-2">
          <span
            className={`px-2 py-[2px] forms-bold ${getBadgeStyle(
              userChange
            )} rounded-full`}
          >
            {formatChange(formattedTotalUser)}
          </span>{' '}
          <span className="text-[#677788] caption-bold">from last month</span>
        </p>
      </div>

      {/* Returning Users */}
      <div className="col-span-3 sm:col-span-full md:col-span-6 px-4 pt-[21px] pb-[23px] border border-[#cdd3da] analytics-card-items">
        <h4 className="body-bold-small">Returning Users</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          {totalReturningUsers.toLocaleString()}
        </p>
        <p className="body-bold-small mt-2">
          <span
            className={`px-2 py-[2px] forms-bold ${getBadgeStyle(
              returningUserPercent
            )} rounded-full`}
          >
            {formatChange(formattedReturningUser)}
          </span>{' '}
          <span className="text-[#677788] caption-bold">from last week</span>
        </p>
      </div>

      {/* Items Sold */}
      <div className="col-span-3 sm:col-span-full md:col-span-6 px-4 pt-[21px] pb-[23px] border border-[#cdd3da] analytics-card-items">
        <h4 className="body-bold-small">No. of Items Sold</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          {itemsSold.toLocaleString()}
        </p>
        <p className="body-bold-small mt-2">
          <span
            className={`px-2 py-[2px] forms-bold ${getBadgeStyle(
              itemsSoldChange
            )} rounded-full`}
          >
            {formatChange(formattedItemsSold)}
          </span>{' '}
          <span className="text-[#677788] caption-bold">from last week</span>
        </p>
      </div>

      {/* Sessions */}
      <div className="col-span-3 sm:col-span-full md:col-span-6 px-4 pt-[21px] pb-[23px] border border-[#cdd3da] analytics-card-items">
        <h4 className="body-bold-small">Sessions</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          {totalUserSessions.toLocaleString()}
        </p>
        <p className="body-bold-small mt-2">
          <span
            className={`px-2 py-[2px] forms-bold ${getBadgeStyle(
              sessionsUserPercent
            )} rounded-full`}
          >
            {formatChange(formattedItemSession)}
          </span>{' '}
          <span className="text-[#677788] caption-bold">from last week</span>
        </p>
      </div>
    </div>
  );
};

export default BusinessOverview;
