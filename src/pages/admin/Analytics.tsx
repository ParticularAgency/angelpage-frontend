import React, { useState } from 'react';
import BusinessOverview from './BusinessOverview';
import RevenueStatistics from './RevenueStatistics';
import CustomerAcquisition from './CustomerAcquisition';
// import { Button } from '@/components/elements';
// import Select from '@/components/elements/select/select';
// import { SearchIcon } from '@/icons';
// import Image from 'next/image';
import UsersTable from './UserTable';

// Define separate interfaces for the data entries
interface DailyDataEntry {
  day: string;
  orders: number;
  revenue: number;
}

interface MonthlyDataEntry {
  month: string;
  orders: number;
  revenue: number;
}

interface YearlyDataEntry {
  year: string;
  orders: number;
  revenue: number;
}

// Sample data for different periods
const dailyData: DailyDataEntry[] = [
  { day: 'Mon', orders: 90, revenue: 100 },
  { day: 'Tue', orders: 65, revenue: 150 },
  { day: 'Wed', orders: 80, revenue: 200 },
  { day: 'Thu', orders: 325, revenue: 250 },
  { day: 'Fri', orders: 130, revenue: 300 },
  { day: 'Sat', orders: 235, revenue: 350 },
  { day: 'Sun', orders: 140, revenue: 400 },
];

const monthlyData: MonthlyDataEntry[] = [
  { month: 'Jan', orders: 100, revenue: 1000 },
  { month: 'Feb', orders: 150, revenue: 1500 },
  { month: 'Mar', orders: 200, revenue: 2000 },
  { month: 'Apr', orders: 250, revenue: 2500 },
  { month: 'May', orders: 300, revenue: 3000 },
  { month: 'Jun', orders: 350, revenue: 3500 },
  { month: 'Jul', orders: 400, revenue: 4000 },
  { month: 'Aug', orders: 450, revenue: 4500 },
  { month: 'Sep', orders: 300, revenue: 3000 },
  { month: 'Oct', orders: 550, revenue: 5500 },
  { month: 'Nov', orders: 600, revenue: 6000 },
  { month: 'Dec', orders: 650, revenue: 6500 },
];

const yearlyData: YearlyDataEntry[] = [
  { year: '2014', orders: 5010, revenue: 2029.92 },
  { year: '2015', orders: 5010, revenue: 2029.92 },
  { year: '2016', orders: 5010, revenue: 2029.92 },
  { year: '2017', orders: 2050, revenue: 3000 },
  { year: '2018', orders: 3000, revenue: 4000 },
  { year: '2019', orders: 4000, revenue: 5000 },
  { year: '2020', orders: 5010, revenue: 6092.29 },
  { year: '2021', orders: 6000, revenue: 7000 },
  { year: '2022', orders: 6050, revenue: 8000 },
  { year: '2023', orders: 7000, revenue: 9000 },
];
const mockData = {
  revenue: 100000,
  revenueChange: 5,
  itemsSold: 6600,
  itemsSoldChange: 10,
  itemsBought: 5000,
  itemsBoughtChange: -3,
  moneySpent: 20000,
  moneySpentChange: 2,
  totalUsers: 72540,
  returningUsers: 54000,
  returningUsersChange: 15,
  sessions: 8500,
  sessionsChange: 8,
};
interface AnalyticsPageProps {
  totalRevenue: number;
  salesChange: number;
  soldItemsCount: number;
}
const AnalyticsPage: React.FC<AnalyticsPageProps> = ({  
  totalRevenue,
  salesChange,
  soldItemsCount,
 }) => {
  // Specify the type for period state
  const [period, setPeriod] = useState<'Day' | 'Month' | 'Year'>('Year');

  // Function to get data based on the selected period
  const getData = () => {
    switch (period) {
      case 'Day':
        return dailyData;
      case 'Month':
        return monthlyData;
      case 'Year':
      default:
        return yearlyData;
    }
  };

  // Data for BusinessOverview and RevenueStatistics
  const data = getData();

  return (
    <div className="analytics-page py-12">
      {/* Business Overview Section */}
      <div className="max-w-7xl mx-auto bg-white">
        {/* <h2 className="h5 font-primary mb-6">Business Overview</h2> */}
        {/* Pass overviewData to BusinessOverview */}
        <BusinessOverview data={{
            ...mockData,
            itemsSold: soldItemsCount,
            itemsSoldChange: salesChange,
          }} />
      </div>

      {/* Revenue Statistics Section */}
      <div className="grid grid-cols-12 sm:grid-cols-6 gap-5  mx-auto mt-8">
        <div className="col-span-5 sm:col-span-full h-full">
          {/* Pass data and period state to RevenueStatistics */}
          <RevenueStatistics
            totalRevenue={totalRevenue}
            period={period}
            setPeriod={setPeriod}
            data={data}
          />
        </div>
        <div className="col-span-7 sm:col-span-full h-full">
          <CustomerAcquisition />
        </div>
      </div>

      <UsersTable />
    </div>
  );
};

export default AnalyticsPage;
