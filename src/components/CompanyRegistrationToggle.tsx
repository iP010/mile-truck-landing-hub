
import React, { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CompanyRegistrationToggle = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_registration_settings')
        .select('is_enabled')
        .single();

      if (error) {
        console.error('Error fetching company registration settings:', error);
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
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_registration_settings')
        .update({ is_enabled: checked })
        .eq('id', (await supabase.from('company_registration_settings').select('id').single()).data?.id);

      if (error) {
        console.error('Error updating company registration settings:', error);
        toast.error('خطأ في تحديث إعدادات التسجيل');
        return;
      }

      setIsEnabled(checked);
      toast.success(checked ? 'تم تفعيل تسجيل الشركات' : 'تم إيقاف تسجيل الشركات');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const viewWaitlist = () => {
    navigate('/company-waitlist');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            تسجيل الشركات
          </h3>
          <p className="text-sm text-gray-600">
            تحكم في إمكانية تسجيل الشركات الجديدة
          </p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {!isEnabled && (
            <Button
              variant="outline"
              onClick={viewWaitlist}
              className="text-sm"
            >
              عرض قائمة الانتظار
            </Button>
          )}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={`text-sm ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {isEnabled ? 'مفعل' : 'معطل'}
            </span>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationToggle;
