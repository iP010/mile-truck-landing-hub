
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DriversInsuranceChartProps {
  data: {
    insurance_type: string;
    count: number;
  }[];
  isRTL: boolean;
}

const DriversInsuranceChart: React.FC<DriversInsuranceChartProps> = ({ data, isRTL }) => {
  const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#8884d8', // Purple
    '#82ca9d', // Light Green
    '#ffc658', // Gold
    '#ff7300'  // Red Orange
  ];

  const chartData = data.map((item, index) => ({
    name: item.insurance_type,
    value: item.count,
    fill: COLORS[index % COLORS.length]
  }));

  const totalDrivers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isRTL ? 'أنواع تأمين السائقين' : 'Driver Insurance Types'}
      </h3>
      
      {totalDrivers === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          {isRTL ? 'لا توجد بيانات' : 'No data available'}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isRTL ? `إجمالي السائقين: ${totalDrivers}` : `Total Drivers: ${totalDrivers}`}
        </p>
      </div>
    </div>
  );
};

export default DriversInsuranceChart;
