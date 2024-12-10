import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Define an interface for the props
interface RevenueStatisticsProps {
  period: 'Day' | 'Month' | 'Year'; // Type for period, restricting it to these three values
  setPeriod: (newPeriod: 'Day' | 'Month' | 'Year') => void; // Function to set the period
  data: {
    revenue: number;
    orders: number;
    day?: string;
    month?: string;
    year?: string;
  }[]; // Structure of data array
}

const RevenueStatistics: React.FC<RevenueStatisticsProps> = ({
  period,
  setPeriod,
  data,
}) => {
  if (!data) {
    return <div>Loading...</div>; // Or any fallback UI
  }

  // Helper function to calculate total revenue
  const getTotalRevenue = () => {
    return data.reduce((total, entry) => total + entry.revenue, 0).toFixed(2);
  };

  // Set the correct data key for X-axis (day, month, year)
  const getXAxisKey = () => {
    switch (period) {
      case 'Day':
        return 'day';
      case 'Month':
        return 'month';
      case 'Year':
      default:
        return 'year';
    }
  };

  const totalRevenue = getTotalRevenue();

  // Assuming you pass the percentage change from the parent component.
  const revenueChange = 10.05; // Placeholder for revenue change percentage
  const lastWeekRevenue = data.length > 1 ? data[data.length - 2].revenue : 0;
  const currentWeekRevenue =
    data.length > 1 ? data[data.length - 1].revenue : 0;
  const weeklyIncrease = (currentWeekRevenue - lastWeekRevenue).toFixed(2); // Calculate weekly increase dynamically

  const isIncrease = revenueChange >= 0;

  return (
    <div className="revenue-statistics flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="col-span-3 sm:col-span-full">
          <h2 className="body-bold-small">Revenue Statistics</h2>

          {/* Displaying the total revenue */}
          <p className="body-bold-large sm:body-bold-medium">
            £{totalRevenue}{' '}
            <span
              className={`ml-1 px-2 py-[2px] forms-bold rounded-full ${isIncrease ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]' : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'}`}
            >
              {isIncrease ? '↑' : '↓'} {Math.abs(revenueChange)}%
            </span>
          </p>
          <p className="body-bold-small mt-2">
            + £{weeklyIncrease}{' '}
            <span className="text-[#C9C8CA]">in the past week</span>
          </p>
        </div>

        {/* Period Buttons */}
        <div className="bg-gray-200 flex items-center rounded">
          <button
            onClick={() => setPeriod('Day')}
            className={`px-[6px] py-[2px] forms-bold rounded ${period === 'Day' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Day
          </button>
          <button
            onClick={() => setPeriod('Month')}
            className={`px-[6px] py-[2px] forms-bold rounded ${period === 'Month' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod('Year')}
            className={`px-[6px] py-[2px] forms-bold rounded ${period === 'Year' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={getXAxisKey()} />
          <Tooltip formatter={value => `£${value.toLocaleString()}`} />
          <Bar dataKey="orders" stackId="a" fill="#6A0398" />
          <Bar dataKey="revenue" stackId="a" fill="#C9C8CA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueStatistics;
