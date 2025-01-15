import React from 'react';
// import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueStatisticsProps {
  period: 'Week' | 'Month' | 'Year'; // Selected time period
  setPeriod: (newPeriod: 'Week' | 'Month' | 'Year') => void; // Function to update the period
  data: {
    revenue: number;
    orders: number;
    week?: string;
    month?: string;
    year?: string;
  }[];
  changes: {
    weekly: { soldChange: number; revenueChange: number };
    monthly: { soldChange: number; revenueChange: number };
    yearly: { soldChange: number; revenueChange: number };
  }; // Percentage changes for weekly, monthly, yearly
}

const RevenueStatistics: React.FC<RevenueStatisticsProps> = ({
  period,
  // setPeriod,
  data,
  changes,
}) => {
  if (!data || data.length === 0) {
    return <div>No revenue data available</div>; // Fallback UI
  }

  // Retrieve changes dynamically based on the selected period
  const getPeriodChange = () => {
    switch (period) {
      case 'Week':
        return changes.weekly; // Assuming "weekly" is mapped for "Day" as per the data structure
      case 'Month':
        return changes.monthly;
      case 'Year':
      default:
        return changes.yearly;
    }
  };

  const { revenueChange } = getPeriodChange();

  // Calculate total revenue
  const totalRevenue = data
    .reduce((total, entry) => total + entry.revenue, 0)
    .toFixed(2);

  // Calculate revenue increase
  const revenueIncrease = (
    (totalRevenue as unknown as number) *
    (revenueChange / 100)
  ).toFixed(2);

  // Determine revenue trend (increase/decrease)
  const isRevenueIncrease = revenueChange >= 0;

  // Determine X-axis data key based on the period
  // const getXAxisKey = () => {
  //   switch (period) {
  //     case 'Week':
  //       return 'week';
  //     case 'Month':
  //       return 'month';
  //     case 'Year':
  //     default:
  //       return 'year';
  //   }
  // };

  return (
    <div className="revenue-statistics flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="body-bold-small">Revenue Statistics</h2>
          <p className="body-bold-large sm:body-bold-medium">
            £{totalRevenue}{' '}
            <span
              className={`ml-1 px-2 py-[2px] forms-bold rounded-full ${
                isRevenueIncrease
                  ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                  : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
              }`}
            >
              {isRevenueIncrease ? '↑' : '↓'}{' '}
              {Math.abs(revenueChange).toFixed()}%
            </span>
          </p>
          <p className="body-bold-small mt-2">
            + £{revenueIncrease}{' '}
            <span className="text-[#8A888C]">in the past week</span>
          </p>
        </div>

        {/* Period Selection Buttons */}
        {/* <div className="bg-gray-200 flex items-center rounded">
          {['Week', 'Month', 'Year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p as 'Week' | 'Month' | 'Year')}
              className={`px-[6px] py-[2px] forms-bold rounded ${
                period === p ? 'bg-gray-800 text-white' : 'bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div> */}
      </div>

      {/* Bar Chart */}
      {/* <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={getXAxisKey()} />
          <Tooltip formatter={value => `£${value.toLocaleString()}`} />
          <Bar dataKey="orders" stackId="a" fill="#6A0398" />
          <Bar dataKey="revenue" stackId="a" fill="#C9C8CA" />
        </BarChart>
      </ResponsiveContainer> */}
    </div>
  );
};

export default RevenueStatistics;
