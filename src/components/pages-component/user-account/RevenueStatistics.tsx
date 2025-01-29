import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Legend,
  YAxis,
  // CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueStatisticsProps {
  period: 'Week' | 'Month' | 'Year'; // Selected time period
  setPeriod: (newPeriod: 'Week' | 'Month' | 'Year') => void; // Function to update the period
  data: {
    revenue: number;
    orders: number;
    label: string;
    week?: string;
    month?: string;
    year?: string;
  }[];
  changes: {
    weekly: { soldChange: number; revenueChange: number };
    monthly: { soldChange: number; revenueChange: number };
    yearly: { soldChange: number; revenueChange: number };
  }; 
  loading: boolean;
}

const RevenueStatistics: React.FC<RevenueStatisticsProps> = ({
  period,
  setPeriod, // <-- Ensure this is destructured
  data,
  changes,
  loading,
}) => {
  // if (data.length === 0) {
  //   return <div>No revenue data available</div>; // Fallback UI
  // }

  // Ensure that the returned value is never undefined
  const getPeriodChange = () => {
    switch (period) {
      case 'Week':
        return changes.weekly || { revenueChange: 0 }; // Default to 0 if undefined
      case 'Month':
        return changes.monthly || { revenueChange: 0 }; // Default to 0 if undefined
      case 'Year':
      default:
        return changes.yearly || { revenueChange: 0 }; // Default to 0 if undefined
    }
  };

  const { revenueChange } = getPeriodChange();

  // Calculate total revenue
  const totalRevenue = data
    .reduce((total, entry) => total + entry.revenue, 0)
    .toFixed(2);

  // Calculate revenue increase
  const revenueIncrease = (
    (parseFloat(totalRevenue) * revenueChange) /
    100
  ).toFixed(2);

  // Determine revenue trend (increase/decrease)
  const isRevenueIncrease = revenueChange >= 0;

  return (
    <div className="revenue-statistics flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        {loading ? (
          <>
            <div className="col-span-3 sm:col-span-full md:col-span-6">
              <h2 className="body-bold-small">Revenue Statistics</h2>
              <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 skeleton w-[180px] h-2 bg-mono-40"></p>
              <p className="body-bold-small flex items-center gap-3 mt-2">
                <span className=" skeleton w-[35px] h-2 bg-mono-40"></span>
                <span className="text-[#8A888C]">
                  in the past {period.toLowerCase()}
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
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
                £{revenueIncrease}{' '}
                <span className="text-[#8A888C]">
                  in the past {period.toLowerCase()}
                </span>
              </p>
            </div>
          </>
        )}

        {/* Period Selection Buttons */}
        <div className="bg-gray-200 flex items-center rounded">
          {['Week', 'Month', 'Year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p as 'Week' | 'Month' | 'Year')} // Use `setPeriod` correctly
              className={`px-[6px] py-[2px] forms-bold rounded ${
                period === p ? 'bg-gray-800 text-white' : 'bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <>
        <p className="body-bold-small">loading...</p>
        </>
      ) : (
        <>
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={value => `${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="orders" stackId="a" fill="#6A0398" />
              <Bar dataKey="revenue" stackId="a" fill="#C9C8CA" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default RevenueStatistics;
