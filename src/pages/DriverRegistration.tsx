
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
  driver_name: string;
  nationality: string;
  truck_brand: string;
  truck_type: string;
  phone_number: string;
  whatsapp_number: string;
  has_insurance: boolean;
  insurance_type: string;
  invitation_code: string;
}

interface OptionItem {
  id: string;
  name: string;
  is_active: boolean;
}

const DriverRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    driver_name: '',
    nationality: '',
    truck_brand: '',
    truck_type: '',
    phone_number: '',
    whatsapp_number: '',
    has_insurance: false,
    insurance_type: '',
    invitation_code: '',
  });

  const [nationalities, setNationalities] = useState<OptionItem[]>([]);
  const [truckBrands, setTruckBrands] = useState<OptionItem[]>([]);
  const [truckTypes, setTruckTypes] = useState<OptionItem[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      console.log('Loading form data...');
      
      // Check if registration is enabled
      const { data: settingsData, error: settingsError } = await supabase
        .from('driver_registration_settings')
        .select('is_enabled')
        .single();

      if (settingsError) {
        console.error('Error fetching registration settings:', settingsError);
      } else {
        console.log('Registration settings:', settingsData);
        setRegistrationEnabled(settingsData?.is_enabled ?? true);
        
        if (!settingsData?.is_enabled) {
          console.log('Registration is disabled, redirecting to waitlist');
          navigate('/driver-waitlist');
          return;
        }
      }

      // Load all form options in parallel
      const [nationalitiesRes, truckBrandsRes, truckTypesRes, insuranceTypesRes] = await Promise.all([
        supabase.from('driver_nationalities').select('*').eq('is_active', true).order('display_order'),
        supabase.from('truck_brands').select('*').eq('is_active', true).order('display_order'),
        supabase.from('truck_types').select('*').eq('is_active', true).order('display_order'),
        supabase.from('insurance_types').select('*').eq('is_active', true).eq('type', 'driver').order('display_order'),
      ]);

      if (nationalitiesRes.error) {
        console.error('Error fetching nationalities:', nationalitiesRes.error);
        toast.error('خطأ في تحميل قائمة الجنسيات');
      } else {
        console.log('Nationalities loaded:', nationalitiesRes.data);
        setNationalities(nationalitiesRes.data || []);
      }

      if (truckBrandsRes.error) {
        console.error('Error fetching truck brands:', truckBrandsRes.error);
        toast.error('خطأ في تحميل قائمة ماركات الشاحنات');
      } else {
        console.log('Truck brands loaded:', truckBrandsRes.data);
        setTruckBrands(truckBrandsRes.data || []);
      }

      if (truckTypesRes.error) {
        console.error('Error fetching truck types:', truckTypesRes.error);
        toast.error('خطأ في تحميل قائمة أنواع الشاحنات');
      } else {
        console.log('Truck types loaded:', truckTypesRes.data);
        setTruckTypes(truckTypesRes.data || []);
      }

      if (insuranceTypesRes.error) {
        console.error('Error fetching insurance types:', insuranceTypesRes.error);
        toast.error('خطأ في تحميل قائمة أنواع التأمين');
      } else {
        console.log('Insurance types loaded:', insuranceTypesRes.data);
        setInsuranceTypes(insuranceTypesRes.data || []);
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
      navigate('/driver-waitlist');
      return;
    }

    // Validate required fields
    if (!formData.driver_name || !formData.nationality || !formData.truck_brand || 
        !formData.truck_type || !formData.phone_number || !formData.whatsapp_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.has_insurance && !formData.insurance_type) {
      toast.error('يرجى اختيار نوع التأمين');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Submitting driver registration:', formData);
      
      const { data, error } = await supabase
        .from('drivers')
        .insert({
          driver_name: formData.driver_name,
          nationality: formData.nationality,
          truck_brand: formData.truck_brand,
          truck_type: formData.truck_type,
          phone_number: formData.phone_number,
          whatsapp_number: formData.whatsapp_number,
          has_insurance: formData.has_insurance,
          insurance_type: formData.has_insurance ? formData.insurance_type : null,
          invitation_code: formData.invitation_code || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        toast.error('خطأ في التسجيل: ' + error.message);
        return;
      }

      console.log('Registration successful:', data);
      toast.success('تم تسجيلك بنجاح!');
      
      // Reset form
      setFormData({
        driver_name: '',
        nationality: '',
        truck_brand: '',
        truck_type: '',
        phone_number: '',
        whatsapp_number: '',
        has_insurance: false,
        insurance_type: '',
        invitation_code: '',
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
            <p className="mb-4">التسجيل مغلق حالياً. يمكنك الانضمام لقائمة الانتظار.</p>
            <Button onClick={() => navigate('/driver-waitlist')}>
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
              تسجيل سائق جديد
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="driver_name">اسم السائق *</Label>
                  <Input
                    id="driver_name"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                    placeholder="أدخل اسم السائق"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">الجنسية *</Label>
                  <Select 
                    value={formData.nationality} 
                    onValueChange={(value) => setFormData({...formData, nationality: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنسية" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality.id} value={nationality.name}>
                          {nationality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truck_brand">ماركة الشاحنة *</Label>
                  <Select 
                    value={formData.truck_brand} 
                    onValueChange={(value) => setFormData({...formData, truck_brand: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر ماركة الشاحنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {truckBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truck_type">نوع الشاحنة *</Label>
                  <Select 
                    value={formData.truck_type} 
                    onValueChange={(value) => setFormData({...formData, truck_type: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الشاحنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {truckTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="has_insurance"
                    checked={formData.has_insurance}
                    onCheckedChange={(checked) => setFormData({...formData, has_insurance: checked as boolean})}
                  />
                  <Label htmlFor="has_insurance">هل لديك تأمين؟</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="invitation_code">كود الدعوة (اختياري)</Label>
                  <Input
                    id="invitation_code"
                    value={formData.invitation_code}
                    onChange={(e) => setFormData({...formData, invitation_code: e.target.value})}
                    placeholder="أدخل كود الدعوة (إن وجد)"
                  />
                </div>
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
                  'تسجيل'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;
