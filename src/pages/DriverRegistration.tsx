
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { NATIONALITIES, TRUCK_BRANDS, TRUCK_TYPES, DRIVER_INSURANCE_TYPES } from '../utils/constants';
import SearchableSelect from '../components/SearchableSelect';
import { toast } from 'sonner';

const schema = z.object({
  driver_name: z.string().min(2, 'Name must be at least 2 characters'),
  nationality: z.string().min(1, 'Nationality is required'),
  truck_brand: z.string().min(1, 'Truck brand is required'),
  truck_type: z.string().min(1, 'Truck type is required'),
  has_insurance: z.boolean(),
  insurance_type: z.string().optional(),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  whatsapp_number: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid WhatsApp number'),
  invitation_code: z.string().optional()
});

type FormData = z.infer<typeof schema>;

const DriverRegistration = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const isRTL = language === 'ar' || language === 'ur';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      has_insurance: false
    }
  });

  const hasInsurance = watch('has_insurance');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: existingDriver, error: checkError } = await supabase
        .from('drivers')
        .select('id')
        .eq('phone_number', data.phone_number)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingDriver) {
        toast.error(t.driverForm.alreadyRegistered);
        setIsSubmitting(false);
        return;
      }

      const { data: newDriver, error } = await supabase
        .from('drivers')
        .insert([{
          ...data,
          insurance_type: hasInsurance ? data.insurance_type : null
        }])
        .select('referral_code')
        .single();

      if (error) throw error;

      setReferralCode(newDriver.referral_code || '');
      setRegistrationSuccess(true);
      toast.success(t.driverForm.success);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/drivers?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.driverForm.success}
            </h2>
            
            {referralCode && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">{t.driverForm.referralLink}:</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <input
                    type="text"
                    value={`${window.location.origin}/drivers?ref=${referralCode}`}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-800"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setRegistrationSuccess(false);
                setReferralCode('');
              }}
              className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              {isRTL ? 'تسجيل سائق آخر' : 'Register Another Driver'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.driverForm.title}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Driver Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.name} *
                </label>
                <input
                  {...register('driver_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.driver_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.driver_name.message}</p>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.nationality} *
                </label>
                <SearchableSelect
                  options={NATIONALITIES}
                  value={watch('nationality') || ''}
                  onChange={(value) => setValue('nationality', value)}
                  placeholder={t.driverForm.nationality}
                />
                {errors.nationality && (
                  <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
                )}
              </div>

              {/* Truck Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.truckBrand} *
                </label>
                <SearchableSelect
                  options={TRUCK_BRANDS}
                  value={watch('truck_brand') || ''}
                  onChange={(value) => setValue('truck_brand', value)}
                  placeholder={t.driverForm.truckBrand}
                />
                {errors.truck_brand && (
                  <p className="text-red-500 text-sm mt-1">{errors.truck_brand.message}</p>
                )}
              </div>

              {/* Truck Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.truckType} *
                </label>
                <SearchableSelect
                  options={TRUCK_TYPES}
                  value={watch('truck_type') || ''}
                  onChange={(value) => setValue('truck_type', value)}
                  placeholder={t.driverForm.truckType}
                />
                {errors.truck_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.truck_type.message}</p>
                )}
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.hasInsurance} *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      {...register('has_insurance')}
                      onChange={() => setValue('has_insurance', true)}
                      className="mr-2"
                    />
                    {t.common.yes}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      {...register('has_insurance')}
                      onChange={() => setValue('has_insurance', false)}
                      className="mr-2"
                    />
                    {t.common.no}
                  </label>
                </div>
              </div>

              {/* Insurance Type - Show only if has insurance */}
              {hasInsurance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.driverForm.insuranceType} *
                  </label>
                  <SearchableSelect
                    options={DRIVER_INSURANCE_TYPES}
                    value={watch('insurance_type') || ''}
                    onChange={(value) => setValue('insurance_type', value)}
                    placeholder={t.driverForm.insuranceType}
                  />
                </div>
              )}

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.phone} *
                </label>
                <input
                  {...register('phone_number')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.whatsapp} *
                </label>
                <input
                  {...register('whatsapp_number')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.whatsapp_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number.message}</p>
                )}
              </div>

              {/* Invitation Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.driverForm.invitationCode} ({t.common.optional})
                </label>
                <input
                  {...register('invitation_code')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isRTL ? 'جاري التسجيل...' : 'Registering...') : t.driverForm.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;
