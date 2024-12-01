import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const weeklyData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 4.5 },
    { name: 'Thu', hours: 3.5 },
    { name: 'Fri', hours: 5 },
    { name: 'Sat', hours: 1 },
    { name: 'Sun', hours: 2.5 },
  ];

  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const averageHours = (totalHours / 7).toFixed(1);
  const mostProductiveDay = weeklyData.reduce((max, day) => day.hours > max.hours ? day : max).name;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Clock className="mr-2" /> Total Hours This Week
          </h3>
          <p className="text-3xl font-bold">{totalHours}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Calendar className="mr-2" /> Average Daily Hours
          </h3>
          <p className="text-3xl font-bold">{averageHours}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-2" /> Most Productive Day
          </h3>
          <p className="text-3xl font-bold">{mostProductiveDay}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Weekly Productivity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;