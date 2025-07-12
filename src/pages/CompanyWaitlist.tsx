
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import { handleDatabaseError } from '@/utils/errorHandling';

const CompanyWaitlist = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar' || language === 'ur';
  const supabase = getSupabaseClient();
  
  const [formData, setFormData] = useState({
    company_name: '',
    manager_name: '',
    phone_number: '',
    whatsapp_number: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      setPageLoading(true);
      const { data, error } = await supabase
        .from('company_registration_settings')
        .select('is_enabled')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking registration status:', error);
        setRegistrationEnabled(false);
      } else {
        setRegistrationEnabled(data?.is_enabled ?? true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setRegistrationEnabled(false);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationEnabled) {
      toast.error(isRTL ? 'التسجيل العادي متاح حالياً' : 'Regular registration is currently available');
      navigate('/company-registration');
      return;
    }

    if (!formData.company_name.trim() || !formData.manager_name.trim() || 
        !formData.phone_number.trim() || !formData.whatsapp_number.trim()) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('company_waitlist')
        .insert([formData]);

      if (error) {
        const errorMessage = handleDatabaseError(error, isRTL);
        toast.error(errorMessage);
        return;
      }

      toast.success(isRTL ? 'تم تسجيل الشركة في قائمة الانتظار بنجاح!' : 'Company has been added to the waitlist successfully!');
      navigate('/');
    } catch (error) {
      const errorMessage = handleDatabaseError(error, isRTL);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-blue-600">
              {isRTL ? 'التسجيل متاح' : 'Registration Available'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              {isRTL 
                ? 'تسجيل الشركات الجديدة متاح حالياً. يمكنك التسجيل مباشرة.'
                : 'New company registration is currently available. You can register directly.'
              }
            </p>
            <Button 
              onClick={() => navigate('/company-registration')} 
              className="w-full mb-2"
            >
              {isRTL ? 'الذهاب للتسجيل' : 'Go to Registration'}
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
            >
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isRTL ? 'قائمة انتظار الشركات' : 'Company Waitlist'}
            </CardTitle>
            <p className="text-center text-gray-600">
              {isRTL 
                ? 'التسجيل معطل حالياً. سيتم التواصل معك عند إعادة فتح التسجيل.'
                : 'Registration is currently disabled. We will contact you when registration reopens.'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="company_name">
                  {isRTL ? 'اسم الشركة' : 'Company Name'}
                </Label>
                <Input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="manager_name">
                  {isRTL ? 'اسم المسؤول' : 'Manager Name'}
                </Label>
                <Input
                  id="manager_name"
                  type="text"
                  value={formData.manager_name}
                  onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  required
                />
              </div>

              <PhoneInputWithCountry
                label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
                value={formData.phone_number}
                onChange={(value) => setFormData({ ...formData, phone_number: value })}
                placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
              />

              <PhoneInputWithCountry
                label={isRTL ? 'رقم الواتس آب' : 'WhatsApp Number'}
                value={formData.whatsapp_number}
                onChange={(value) => setFormData({ ...formData, whatsapp_number: value })}
                placeholder={isRTL ? 'أدخل رقم الواتس آب' : 'Enter WhatsApp number'}
              />

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading 
                  ? (isRTL ? 'جاري التسجيل...' : 'Registering...') 
                  : (isRTL ? 'انضمام لقائمة الانتظار' : 'Join Waitlist')
                }
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/')} 
                className="w-full"
              >
                {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyWaitlist;
