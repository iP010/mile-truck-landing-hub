
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DriversNationalityChartProps {
  data: Array<{
    nationality: string;
    count: number;
  }>;
  isRTL: boolean;
}

const DriversNationalityChart: React.FC<DriversNationalityChartProps> = ({ data, isRTL }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatData = (data: Array<{ nationality: string; count: number }>) => {
    return data.map((item, index) => ({
      name: item.nationality,
      value: item.count,
      fill: COLORS[index % COLORS.length]
    }));
  };

  const chartData = formatData(data);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isRTL ? 'السائقين حسب الجنسية' : 'Drivers by Nationality'}
      </h3>
      
      {data.length === 0 ? (
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
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DriversNationalityChart;
