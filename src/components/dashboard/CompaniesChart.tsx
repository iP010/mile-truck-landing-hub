
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompaniesChartProps {
  data: {
    company_name: string;
    truck_count: number;
  }[];
  isRTL: boolean;
}

const CompaniesChart: React.FC<CompaniesChartProps> = ({ data, isRTL }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isRTL ? 'عدد الشركات' : 'Companies Count'}
      </h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          {isRTL ? 'لا توجد بيانات' : 'No data available'}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="company_name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                isRTL ? 'عدد الشاحنات' : 'Number of Trucks'
              ]}
              labelFormatter={(label) => isRTL ? `الشركة: ${label}` : `Company: ${label}`}
            />
            <Bar 
              dataKey="truck_count" 
              fill="#8884d8" 
              name={isRTL ? 'عدد الشاحنات' : 'Truck Count'}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isRTL ? `إجمالي الشركات: ${data.length}` : `Total Companies: ${data.length}`}
        </p>
      </div>
    </div>
  );
};

export default CompaniesChart;
