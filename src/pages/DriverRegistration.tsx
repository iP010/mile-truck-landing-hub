
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DriverForm from '@/components/forms/DriverForm';
import { handleDatabaseError } from '@/utils/errorHandling';

const DriverRegistration = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [formData, setFormData] = useState({
    driver_name: '',
    nationality: '',
    phone_number: '',
    whatsapp_number: '',
    truck_brand: '',
    truck_type: '',
    has_insurance: false,
    insurance_type: '',
    invitation_code: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_registration_settings')
        .select('is_enabled')
        .single();

      if (error) {
        console.error('Error checking registration status:', error);
        return;
      }

      setRegistrationEnabled(data?.is_enabled ?? true);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationEnabled) {
      toast.error(isRTL ? 'تسجيل السائقين معطل حالياً' : 'Driver registration is currently disabled');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('drivers')
        .insert([formData]);

      if (error) {
        const errorMessage = handleDatabaseError(error, isRTL);
        toast.error(errorMessage);
        return;
      }

      toast.success(isRTL ? 'تم تسجيل السائق بنجاح!' : 'Driver registered successfully!');
      navigate('/');
    } catch (error) {
      const errorMessage = handleDatabaseError(error, isRTL);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!registrationEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              {isRTL ? 'تسجيل السائقين معطل' : 'Driver Registration Disabled'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              {isRTL 
                ? 'تسجيل السائقين الجدد معطل حالياً. يرجى المحاولة لاحقاً.'
                : 'New driver registration is currently disabled. Please try again later.'
              }
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
              variant="outline"
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
              {isRTL ? 'تسجيل سائق جديد' : 'Driver Registration'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <DriverForm formData={formData} setFormData={setFormData} />
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading 
                  ? (isRTL ? 'جاري التسجيل...' : 'Registering...') 
                  : (isRTL ? 'تسجيل السائق' : 'Register Driver')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;
