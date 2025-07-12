
import React, { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { useAdmin } from '../contexts/AdminContext';

const DriverRegistrationToggle = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { admin } = useAdmin();
  const isRTL = language === 'ar' || language === 'ur';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_registration_settings')
        .select('is_enabled')
        .single();

      if (error) {
        console.error('Error fetching driver registration settings:', error);
        return;
      }

      if (data) {
        setIsEnabled(data.is_enabled);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('driver_registration_settings')
        .update({ is_enabled: checked })
        .eq('id', (await supabase.from('driver_registration_settings').select('id').single()).data?.id);

      if (error) {
        console.error('Error updating driver registration settings:', error);
        return;
      }

      setIsEnabled(checked);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يكن المستخدم مديراً، لا نعرض التحكم
  if (!admin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isRTL ? 'تسجيل السائقين' : 'Driver Registration'}
          </h3>
          <p className="text-sm text-gray-600">
            {isRTL 
              ? 'تحكم في إمكانية تسجيل السائقين الجدد' 
              : 'Control whether new drivers can register'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className={`text-sm ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
            {isEnabled 
              ? (isRTL ? 'مفعل' : 'Enabled')
              : (isRTL ? 'معطل' : 'Disabled')
            }
          </span>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationToggle;
