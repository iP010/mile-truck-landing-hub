
import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RoleSelectorProps {
  selectedRoleType: 'مدير' | 'مشرف' | 'قائد';
  customPermissions: string;
  onRoleChange: (roleType: 'مدير' | 'مشرف' | 'قائد') => void;
  onCustomPermissionsChange: (permissions: string) => void;
  loading: boolean;
}

const RoleSelector = ({ 
  selectedRoleType, 
  customPermissions, 
  onRoleChange, 
  onCustomPermissionsChange, 
  loading 
}: RoleSelectorProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <>
      {/* الصلاحيات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'الصلاحيات' : 'Permissions'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedRoleType}
            onChange={(e) => onRoleChange(e.target.value as 'مدير' | 'مشرف' | 'قائد')}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          >
            <option value="مشرف">مشرف</option>
            <option value="مدير">مدير</option>
            <option value="قائد">قائد</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default RoleSelector;
