
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DriversInsuranceChartProps {
  data: {
    insured: number;
    uninsured: number;
  };
  isRTL: boolean;
}

const DriversInsuranceChart: React.FC<DriversInsuranceChartProps> = ({ data, isRTL }) => {
  const chartData = [
    {
      name: isRTL ? 'مؤمن' : 'Insured',
      value: data.insured,
      fill: '#0088FE'
    },
    {
      name: isRTL ? 'غير مؤمن' : 'Uninsured',
      value: data.uninsured,
      fill: '#FF8042'
    }
  ];

  const totalDrivers = data.insured + data.uninsured;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isRTL ? 'تأمين السائقين' : 'Driver Insurance Status'}
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
            <Tooltip />
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
