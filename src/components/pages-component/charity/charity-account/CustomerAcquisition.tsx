'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Define the interface for session data
interface SessionData {
  day: string;
  sessions: number;
}

// Example data
const data: SessionData[] = [
  { day: 'Day 1', sessions: 10 },
  { day: 'Day 2', sessions: 12 },
  { day: 'Day 3', sessions: 15 },
  { day: 'Day 4', sessions: 9 },
  { day: 'Day 5', sessions: 20 },
  { day: 'Day 6', sessions: 30 },
  { day: 'Day 7', sessions: 18 },
];

// Helper function to calculate the total sessions
const getTotalSessions = (data: SessionData[]): number => {
  return data.reduce((total, entry) => total + entry.sessions, 0);
};

// Example function to calculate the bounce rate (placeholder logic)
const calculateBounceRate = (): string => {
  // For demo purposes, returning a static value
  return '40.5%';
};

const CustomerAcquisition: React.FC = () => {
  const totalSessions = getTotalSessions(data);
  const totalUsers = data.length; // Assuming each day represents unique users (this can vary)
  const bounceRate = calculateBounceRate(); // Placeholder for bounce rate logic

  return (
    <div className="bg-white rounded-lg">
      <h3 className="body-bold-small mb-8">Customer Acquisition</h3>

      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-6 text-center mb-6">
        <div>
          <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
          <p className="text-sm text-gray-500">Users</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{totalSessions}</p>
          <p className="text-sm text-gray-500">Sessions</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{bounceRate}</p>
          <p className="text-sm text-gray-500">Bounce Rate</p>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={value => `Sessions: ${value}`} />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerAcquisition;
