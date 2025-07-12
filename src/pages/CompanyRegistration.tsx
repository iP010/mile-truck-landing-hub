
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { COMPANY_INSURANCE_TYPES } from '@/utils/constants';
import SearchableSelect from '@/components/SearchableSelect';
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry';
import { handleDatabaseError } from '@/utils/errorHandling';

const CompanyRegistration = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [formData, setFormData] = useState({
    company_name: '',
    manager_name: '',
    phone_number: '',
    whatsapp_number: '',
    truck_count: 1,
    has_insurance: false,
    insurance_type: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .insert([formData]);

      if (error) {
        const errorMessage = handleDatabaseError(error, isRTL);
        toast.error(errorMessage);
        return;
      }

      toast.success(isRTL ? 'تم تسجيل الشركة بنجاح!' : 'Company registered successfully!');
      navigate('/');
    } catch (error) {
      const errorMessage = handleDatabaseError(error, isRTL);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isRTL ? 'تسجيل شركة جديدة' : 'Company Registration'}
            </CardTitle>
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
                  {isRTL ? 'اسم المدير' : 'Manager Name'}
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

              <div>
                <Label htmlFor="truck_count">
                  {isRTL ? 'عدد الشاحنات' : 'Number of Trucks'}
                </Label>
                <Input
                  id="truck_count"
                  type="number"
                  min="1"
                  value={formData.truck_count}
                  onChange={(e) => setFormData({ ...formData, truck_count: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="has_insurance"
                  checked={formData.has_insurance}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_insurance: !!checked })}
                />
                <Label htmlFor="has_insurance">
                  {isRTL ? 'يوجد تأمين' : 'Has Insurance'}
                </Label>
              </div>

              {formData.has_insurance && (
                <div>
                  <Label htmlFor="insurance_type">
                    {isRTL ? 'نوع التأمين' : 'Insurance Type'}
                  </Label>
                  <SearchableSelect
                    options={COMPANY_INSURANCE_TYPES}
                    value={formData.insurance_type}
                    onChange={(value) => setFormData({ ...formData, insurance_type: value })}
                    placeholder={isRTL ? 'اختر نوع التأمين' : 'Select insurance type'}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading 
                  ? (isRTL ? 'جاري التسجيل...' : 'Registering...') 
                  : (isRTL ? 'تسجيل الشركة' : 'Register Company')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyRegistration;
