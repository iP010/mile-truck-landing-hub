
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TrucksInsuranceChartProps {
  data: {
    insured: number;
    uninsured: number;
  };
  isRTL: boolean;
}

const TrucksInsuranceChart: React.FC<TrucksInsuranceChartProps> = ({ data, isRTL }) => {
  const chartData = [
    {
      name: isRTL ? 'مؤمن' : 'Insured',
      value: data.insured,
      fill: '#00C49F'
    },
    {
      name: isRTL ? 'غير مؤمن' : 'Uninsured',
      value: data.uninsured,
      fill: '#FF8042'
    }
  ];

  const totalTrucks = data.insured + data.uninsured;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isRTL ? 'تأمين الشاحنات' : 'Truck Insurance Status'}
      </h3>
      
      {totalTrucks === 0 ? (
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
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isRTL ? `إجمالي الشاحنات: ${totalTrucks}` : `Total Trucks: ${totalTrucks}`}
        </p>
      </div>
    </div>
  );
};

export default TrucksInsuranceChart;
