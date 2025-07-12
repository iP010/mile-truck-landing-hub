
import React, { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import { useAdmin } from '../contexts/AdminContext';
import { Link } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import { toast } from 'sonner';

const CompanyRegistrationToggle = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const { language } = useLanguage();
  const { admin } = useAdmin();
  const isRTL = language === 'ar' || language === 'ur';
  const supabase = getSupabaseClient();

  useEffect(() => {
    fetchSettings();
    fetchWaitlistCount();
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

  const fetchWaitlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from('company_waitlist')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching waitlist count:', error);
        return;
      }

      setWaitlistCount(count || 0);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('company_registration_settings')
        .update({ is_enabled: checked })
        .eq('id', (await supabase.from('company_registration_settings').select('id').single()).data?.id);

      if (error) {
        console.error('Error updating company registration settings:', error);
        toast.error(isRTL ? 'خطأ في تحديث الإعدادات' : 'Error updating settings');
        return;
      }

      setIsEnabled(checked);
      toast.success(isRTL ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isRTL ? 'تسجيل الشركات' : 'Company Registration'}
          </h3>
          <p className="text-sm text-gray-600">
            {isRTL 
              ? 'تحكم في إمكانية تسجيل الشركات الجديدة' 
              : 'Control whether new companies can register'
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

      <div className="flex flex-wrap gap-3">
        <Link to="/company-registration">
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-2" />
            {isRTL ? 'صفحة التسجيل' : 'Registration Page'}
          </Button>
        </Link>
        
        {!isEnabled && (
          <Link to="/company-waitlist">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              {isRTL ? `قائمة الانتظار (${waitlistCount})` : `Waitlist (${waitlistCount})`}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CompanyRegistrationToggle;
