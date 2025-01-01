'use client';
import React from 'react';

interface BusinessOverviewData {
  revenue: number; // Total revenue
  revenueChange: number; // Percentage change in revenue
  itemsSold: number; // Total items sold
  itemsSoldChange: number; // Percentage change in items sold
}

interface BusinessOverviewProps {
  data: BusinessOverviewData; // Use the defined type for data
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>; // Or any fallback UI
  }

  // Calculate revenue, items sold, and money spent increases
  const revenueIncrease = (data.revenue * (data.revenueChange / 100)).toFixed(
    2
  );
  const itemsSoldIncrease = Math.round(
    data.itemsSold * (data.itemsSoldChange / 100)
  );


  return (
    <div className="grid grid-cols-12 sm:grid-cols-6 gap-6 business-overview-area pb-[45px]">
      {/* Revenue */}
      <div className="col-span-4 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">Revenue</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          £{data.revenue.toFixed(2)}
          <span
            className={`px-2 py-[2px] forms-bold ${
              data.revenueChange >= 0
                ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
            } rounded-full`}
          >
            {data.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(data.revenueChange)}
            %
          </span>
        </p>
        <p className="body-bold-small mt-2">
          + £{revenueIncrease}{' '}
          <span className="text-mono-100">in the past week</span>
        </p>
      </div>

      {/* Number of Items Sold */}
      <div className="col-span-4 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">No. of Items Sold</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          {data.itemsSold}
          <span
            className={`px-2 py-[2px] forms-bold ${
              data.itemsSoldChange >= 0
                ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
            } rounded-full`}
          >
            {data.itemsSoldChange >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(data.itemsSoldChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">
          +{itemsSoldIncrease}{' '}
          <span className="text-mono-100">in the past week</span>
        </p>
      </div>

      {/* Number of Items Bought */}
      <div className="col-span-4 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">Total Profit Received</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          £0.00
          <span
            className={`px-2 py-[2px] forms-bold  text-[#00C700] bg-[rgba(165,255,187,.60)] rounded-full`}
          >
            0.00%
          </span>
        </p>
        <p className="body-bold-small mt-2">
          +£0.00 <span className="text-mono-100">in the past week</span>
        </p>
      </div>

      {/* Money Spent */}
      {/* <div className="col-span-3 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">Money Spent</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
          £{data.moneySpent.toFixed(2)}
          <span
            className={`px-2 py-[2px] forms-bold ${
              data.moneySpentChange >= 0
                ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
            } rounded-full`}
          >
            {data.moneySpentChange >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(data.moneySpentChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">
          + £{moneySpentIncrease}{' '}
          <span className="text-[#C9C8CA]">in the past week</span>
        </p>
      </div> */}
    </div>
  );
};

export default BusinessOverview;
