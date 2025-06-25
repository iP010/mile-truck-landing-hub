
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/button';
import ModalWrapper from '../modals/ModalWrapper';

interface DashboardSettings {
  showRecentStats: boolean;
  showTruckCount: boolean;
  refreshInterval: number;
  cardLayout: 'grid' | 'list';
}

interface DashboardSettingsProps {
  settings: DashboardSettings;
  onUpdate: (settings: DashboardSettings) => void;
  onClose: () => void;
  isRTL: boolean;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  settings,
  onUpdate,
  onClose,
  isRTL
}) => {
  const [localSettings, setLocalSettings] = useState<DashboardSettings>(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const refreshIntervalOptions = [
    { value: 10000, label: isRTL ? '10 ثوانِ' : '10 seconds' },
    { value: 30000, label: isRTL ? '30 ثانية' : '30 seconds' },
    { value: 60000, label: isRTL ? '1 دقيقة' : '1 minute' },
    { value: 300000, label: isRTL ? '5 دقائق' : '5 minutes' },
    { value: 0, label: isRTL ? 'لا يحدث تلقائياً' : 'No auto refresh' }
  ];

  return (
    <ModalWrapper
      title={isRTL ? 'إعدادات لوحة التحكم' : 'Dashboard Settings'}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        {/* Display Options */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isRTL ? 'خيارات العرض' : 'Display Options'}
          </h3>
          
          <div className="space-y-4">
            {/* Show Recent Stats */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {isRTL ? 'عرض إحصائيات حديثة' : 'Show Recent Stats'}
              </label>
              <input
                type="checkbox"
                checked={localSettings.showRecentStats}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  showRecentStats: e.target.checked
                })}
                className="rounded"
              />
            </div>

            {/* Show Truck Count */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {isRTL ? 'عرض عدد الشاحنات' : 'Show Truck Count'}
              </label>
              <input
                type="checkbox"
                checked={localSettings.showTruckCount}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  showTruckCount: e.target.checked
                })}
                className="rounded"
              />
            </div>

            {/* Card Layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'تخطيط البطاقات' : 'Card Layout'}
              </label>
              <select
                value={localSettings.cardLayout}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  cardLayout: e.target.value as 'grid' | 'list'
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="grid">{isRTL ? 'شبكة' : 'Grid'}</option>
                <option value="list">{isRTL ? 'قائمة' : 'List'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refresh Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isRTL ? 'إعدادات التحديث' : 'Refresh Settings'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'فترة التحديث التلقائي' : 'Auto Refresh Interval'}
            </label>
            <select
              value={localSettings.refreshInterval}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                refreshInterval: parseInt(e.target.value)
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {refreshIntervalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isRTL ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DashboardSettings;
