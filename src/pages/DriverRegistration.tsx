import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Phone, Shield, Copy, Check, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import SearchableSelect from '../components/SearchableSelect';
import PhoneInput from '../components/PhoneInput';
import Header from '../components/Header';

interface DriverFormData {
  driver_name: string;
  nationality: string;
  truck_brand: string;
  truck_type: string;
  has_insurance: boolean;
  insurance_type: string;
  phone_number: string;
  whatsapp_number: string;
  invitation_code: string;
}

const DriverRegistration = () => {
  const [formData, setFormData] = useState<DriverFormData>({
    driver_name: '',
    nationality: '',
    truck_brand: '',
    truck_type: '',
    has_insurance: false,
    insurance_type: '',
    phone_number: '',
    whatsapp_number: '',
    invitation_code: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if driver already exists - using select instead of single
      const { data: existingDrivers, error: existingDriverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('phone_number', formData.phone_number);

      if (existingDriverError) {
        console.error('Error checking existing driver:', existingDriverError);
        setError(t.driverForm.alreadyRegistered);
        setLoading(false);
        return;
      }

      if (existingDrivers && existingDrivers.length > 0) {
        setError(t.driverForm.alreadyRegistered);
        setLoading(false);
        return;
      }

      // Check referral code if provided
      if (formData.invitation_code) {
        const { data: referralData, error: referralError } = await supabase
          .from('drivers')
          .select('referral_code')
          .eq('referral_code', formData.invitation_code);

        if (referralError) {
          console.error('Error checking referral code:', referralError);
          setError('Invalid invitation code.');
          setLoading(false);
          return;
        }

        if (!referralData || referralData.length === 0) {
          setError('Invalid invitation code.');
          setLoading(false);
          return;
        }
      }

      const referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error } = await supabase
        .from('drivers')
        .insert([
          {
            driver_name: formData.driver_name,
            nationality: formData.nationality,
            truck_brand: formData.truck_brand,
            truck_type: formData.truck_type,
            has_insurance: formData.has_insurance,
            insurance_type: formData.insurance_type,
            phone_number: formData.phone_number,
            whatsapp_number: formData.whatsapp_number,
            invitation_code: formData.invitation_code,
            referral_code: referral_code,
          },
        ]);

      if (error) {
        console.error('Error submitting form:', error);
        setError('Failed to submit. Please try again.');
      } else {
        setSuccess(true);
        setReferralCode(referral_code);
        setFormData({
          driver_name: '',
          nationality: '',
          truck_brand: '',
          truck_type: '',
          has_insurance: false,
          insurance_type: '',
          phone_number: '',
          whatsapp_number: '',
          invitation_code: '',
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/drivers?referral=${referralCode}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShareClick = () => {
    const shareText = `👋🏻 مرحبًا،

يسعدنا دعوتك للانضمام إلى Mile Truck كشريك مهم لتحقيق دخل إضافي لك ولأصدقائك!

📢 كل ما عليك فعله هو مشاركة رابط الدعوة الخاص بك، وعندما يقوم كابتن بالتسجيل عبره، ستحصل مباشرةً على 50 ريال (تطبق الشروط والأحكام).

✅ رابط الدعوة:
${window.location.origin}/drivers?referral=${referralCode}

🔑 كود الدعوة: ${referralCode}

🚀 شارك الرابط مع من حولك وكن سببًا في توسيع دائرة دخلهم ودخلك أيضًا.

في حال كان لديك أي استفسار أو تحتاج إلى مساعدة، نحن دائمًا في خدمتك.`;

    if (navigator.share) {
      navigator.share({
        title: 'Mile Truck - دعوة للانضمام',
        text: shareText,
      }).then(() => {
        setShared(true);
        setTimeout(() => {
          setShared(false);
        }, 2000);
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => {
          setShared(false);
        }, 2000);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => {
        setShared(false);
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {t.driverForm.title}
          </h2>

          {success ? (
            <div className="text-center py-8">
              <Check className="mx-auto h-12 w-12 text-green-600 mb-2" />
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {t.driverForm.success}
              </p>
              {referralCode && (
                <div className="mb-4">
                  <p className="text-gray-600">{t.driverForm.referralLink}:</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/drivers?referral=${referralCode}`}
                      className="w-full md:w-64 px-4 py-2 border rounded-md text-gray-700 focus:ring-primary focus:border-primary"
                      readOnly
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyClick}
                      disabled={copied}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="default"
                      onClick={handleShareClick}
                      disabled={shared}
                      className="w-full md:w-auto"
                    >
                      {shared ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-2" />
                      )}
                      {shared ? 'تم المشاركة!' : 'مشاركة الدعوة'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="driver_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.name}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="driver_name"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleChange}
                    placeholder={t.driverForm.name}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.nationality}
                </label>
                <SearchableSelect
                  options={t.options.nationalities}
                  value={formData.nationality}
                  onChange={handleSelectChange('nationality')}
                  placeholder={t.driverForm.nationality}
                />
              </div>

              <div>
                <label htmlFor="truck_brand" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.truckBrand}
                </label>
                <SearchableSelect
                  options={t.options.truckBrands}
                  value={formData.truck_brand}
                  onChange={handleSelectChange('truck_brand')}
                  placeholder={t.driverForm.truckBrand}
                />
              </div>

              <div>
                <label htmlFor="truck_type" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.truckType}
                </label>
                <SearchableSelect
                  options={t.options.truckTypes}
                  value={formData.truck_type}
                  onChange={handleSelectChange('truck_type')}
                  placeholder={t.driverForm.truckType}
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  id="has_insurance"
                  name="has_insurance"
                  type="checkbox"
                  checked={formData.has_insurance}
                  onChange={handleChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="has_insurance" className="text-sm text-gray-900">
                  {t.driverForm.hasInsurance}
                </label>
              </div>

              {formData.has_insurance && (
                <div>
                  <label htmlFor="insurance_type" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.driverForm.insuranceType}
                  </label>
                  <select
                    id="insurance_type"
                    name="insurance_type"
                    value={formData.insurance_type}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">{t.driverForm.insuranceType}</option>
                    {t.options.driverInsuranceTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <PhoneInput
                value={formData.phone_number}
                onChange={handlePhoneChange('phone_number')}
                label={t.driverForm.phone}
                placeholder={t.driverForm.phone}
              />

              <PhoneInput
                value={formData.whatsapp_number}
                onChange={handlePhoneChange('whatsapp_number')}
                label={t.driverForm.whatsapp}
                placeholder={t.driverForm.whatsapp}
              />

              <div>
                <label htmlFor="invitation_code" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.invitationCode}
                  <span className="text-gray-500 ml-1">{t.common.optional}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Shield className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="invitation_code"
                    name="invitation_code"
                    value={formData.invitation_code}
                    onChange={handleChange}
                    placeholder={`${t.driverForm.invitationCode} (${t.common.optional})`}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 text-base"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    t.driverForm.submit
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;
