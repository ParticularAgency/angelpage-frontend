import React from 'react';

interface BusinessOverviewData {
  revenue: number; // Change to number
  revenueChange: number; // Assuming it's a percentage change
  itemsSold: number;
  itemsSoldChange: number;
  itemsBought: number;
  itemsBoughtChange: number;
  moneySpent: number; // Change to number
  moneySpentChange: number; // Assuming it's a percentage change
}

interface BusinessOverviewProps {
  data: BusinessOverviewData; // Use the defined type for data
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ data }) => {
    if (!data) {
    return <div>Loading...</div>; // Or any fallback UI
  }

  // Ensure that revenue and moneySpent are treated as numbers
  const weeklyRevenueIncrease = (data.revenue * (data.revenueChange / 100)).toFixed(2);
  const weeklyItemsSoldIncrease = Math.round(data.itemsSold * (data.itemsSoldChange / 100));
  const weeklyMoneySpentIncrease = (data.moneySpent * (data.moneySpentChange / 100)).toFixed(2);

  return (
    <div className="grid grid-cols-12 sm:grid-cols-6 gap-6 business-overview-area pb-[45px]">
      {/* Revenue */}
      <div className="col-span-3 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">Revenue</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 ">
          £{data.revenue.toFixed(2)} {/* Display as formatted number */}
          <span className={`px-2 py-[2px] forms-bold ${data.revenueChange >= 0 ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]' : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'} rounded-full`}>
            {data.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(data.revenueChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">+ £{weeklyRevenueIncrease} <span className="text-[#C9C8CA]">in the past week</span></p>
      </div>

      {/* Number of Items Sold */}
      <div className="col-span-3 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">No. of Items Sold</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 ">
          {data.itemsSold} 
          <span className={`px-2 py-[2px] forms-bold ${data.itemsSoldChange >= 0 ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]' : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'} rounded-full`}>
            {data.itemsSoldChange >= 0 ? '↑' : '↓'} {Math.abs(data.itemsSoldChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">+{weeklyItemsSoldIncrease} <span className="text-[#C9C8CA]">in the past week</span></p>
      </div>

      {/* Number of Items Bought */}
      <div className="col-span-3 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">No. of Items Bought</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 ">
          {data.itemsBought} 
          <span className={`px-2 py-[2px] forms-bold ${data.itemsBoughtChange >= 0 ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]' : 'text-[#FF0000] bg-[#FFCECD]'} rounded-full`}>
            {data.itemsBoughtChange >= 0 ? '↑' : '↓'} {Math.abs(data.itemsBoughtChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">-4 <span className="text-[#C9C8CA]">in the past week</span></p>
      </div>

      {/* Money Spent */}
      <div className="col-span-3 sm:col-span-full md:col-span-6">
        <h4 className="body-bold-small">Money Spent</h4>
        <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 ">
          £{data.moneySpent.toFixed(2)} {/* Display as formatted number */}
          <span className={`px-2 py-[2px] forms-bold ${data.moneySpentChange >= 0 ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]' : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'} rounded-full`}>
            {data.moneySpentChange >= 0 ? '↑' : '↓'} {Math.abs(data.moneySpentChange)}%
          </span>
        </p>
        <p className="body-bold-small mt-2">+ £{weeklyMoneySpentIncrease} in the past week</p>
      </div>
    </div>
  );
};

export default BusinessOverview;
