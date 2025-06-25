
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    label: string;
  };
  subtitle?: string;
  layout?: 'grid' | 'list';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  layout = 'grid'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white'
  };

  const backgroundClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  };

  if (layout === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${backgroundClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-900">
                  +{trend.value}
                </span>
                <span className="text-xs text-gray-500">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      {trend && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-600">
            +{trend.value}
          </span>
          <span className="text-xs text-gray-500">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
