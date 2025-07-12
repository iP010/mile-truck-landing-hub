
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface FormData {
  company_name: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
  truck_count: string;
  has_insurance: boolean;
  insurance_type: string;
}

interface InsuranceType {
  id: string;
  name: string;
  is_active: boolean;
}

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    manager_name: '',
    phone_number: '',
    whatsapp_number: '',
    truck_count: '',
    has_insurance: false,
    insurance_type: '',
  });

  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      console.log('Loading company registration form data...');
      
      // Check if registration is enabled
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_registration_settings')
        .select('is_enabled')
        .single();

      if (settingsError) {
        console.error('Error fetching registration settings:', settingsError);
      } else {
        console.log('Company registration settings:', settingsData);
        setRegistrationEnabled(settingsData?.is_enabled ?? true);
        
        if (!settingsData?.is_enabled) {
          console.log('Company registration is disabled, redirecting to waitlist');
          navigate('/company-waitlist');
          return;
        }
      }

      // Load insurance types
      const { data: insuranceData, error: insuranceError } = await supabase
        .from('insurance_types')
        .select('*')
        .eq('is_active', true)
        .eq('type', 'company')
        .order('display_order');

      if (insuranceError) {
        console.error('Error fetching insurance types:', insuranceError);
        toast.error('خطأ في تحميل قائمة أنواع التأمين');
      } else {
        console.log('Insurance types loaded:', insuranceData);
        setInsuranceTypes(insuranceData || []);
      }

    } catch (error) {
      console.error('Unexpected error loading form data:', error);
      toast.error('خطأ غير متوقع في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationEnabled) {
      toast.error('التسجيل غير متاح حالياً');
      navigate('/company-waitlist');
      return;
    }

    // Validate required fields
    if (!formData.company_name || !formData.manager_name || 
        !formData.phone_number || !formData.whatsapp_number || !formData.truck_count) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.has_insurance && !formData.insurance_type) {
      toast.error('يرجى اختيار نوع التأمين');
      return;
    }

    const truckCount = parseInt(formData.truck_count);
    if (isNaN(truckCount) || truckCount <= 0) {
      toast.error('يرجى إدخال عدد صحيح للشاحنات');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting company registration:', formData);
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          company_name: formData.company_name,
          manager_name: formData.manager_name,
          phone_number: formData.phone_number,
          whatsapp_number: formData.whatsapp_number,
          truck_count: truckCount,
          has_insurance: formData.has_insurance,
          insurance_type: formData.has_insurance ? formData.insurance_type : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        toast.error('خطأ في التسجيل: ' + error.message);
        return;
      }

      console.log('Company registration successful:', data);
      toast.success('تم تسجيل الشركة بنجاح!');
      
      // Reset form
      setFormData({
        company_name: '',
        manager_name: '',
        phone_number: '',
        whatsapp_number: '',
        truck_count: '',
        has_insurance: false,
        insurance_type: '',
      });

    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast.error('خطأ غير متوقع في التسجيل');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل النموذج...</p>
        </div>
      </div>
    );
  }

  if (!registrationEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">التسجيل غير متاح</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">تسجيل الشركات مغلق حالياً. يمكنك الانضمام لقائمة الانتظار.</p>
            <Button onClick={() => navigate('/company-waitlist')}>
              انضم لقائمة الانتظار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                alt="Mile Truck Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              تسجيل شركة جديدة
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">اسم الشركة *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    placeholder="أدخل اسم الشركة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager_name">اسم المسؤول *</Label>
                  <Input
                    id="manager_name"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                    placeholder="أدخل اسم المسؤول"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">رقم الجوال *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="أدخل رقم الجوال"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">رقم الواتساب *</Label>
                  <Input
                    id="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                    placeholder="أدخل رقم الواتساب"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truck_count">عدد الشاحنات *</Label>
                  <Input
                    id="truck_count"
                    type="number"
                    min="1"
                    value={formData.truck_count}
                    onChange={(e) => setFormData({...formData, truck_count: e.target.value})}
                    placeholder="أدخل عدد الشاحنات"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="has_insurance"
                    checked={formData.has_insurance}
                    onCheckedChange={(checked) => setFormData({...formData, has_insurance: checked as boolean})}
                  />
                  <Label htmlFor="has_insurance">هل لديكم تأمين؟</Label>
                </div>

                {formData.has_insurance && (
                  <div className="space-y-2">
                    <Label htmlFor="insurance_type">نوع التأمين *</Label>
                    <Select 
                      value={formData.insurance_type} 
                      onValueChange={(value) => setFormData({...formData, insurance_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع التأمين" />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  'تسجيل الشركة'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyRegistration;
