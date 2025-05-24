import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { COMPANY_INSURANCE_TYPES } from '../utils/constants';
import SearchableSelect from '../components/SearchableSelect';
import { toast } from 'sonner';

const schema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  truck_count: z.number().min(1, 'Must have at least 1 truck'),
  has_insurance: z.boolean(),
  insurance_type: z.string().optional(),
  manager_name: z.string().min(2, 'Manager name must be at least 2 characters'),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  whatsapp_number: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid WhatsApp number')
});

type FormData = z.infer<typeof schema>;

const CompanyRegistration = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .eq('phone_number', data.phone_number)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingCompany) {
        toast.error(t.companyForm.alreadyRegistered);
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('companies')
        .insert({
          ...data,
          insurance_type: hasInsurance ? data.insurance_type : null
        });

      if (error) throw error;

      setRegistrationSuccess(true);
      toast.success(t.companyForm.success);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              {t.companyForm.success}
            </h2>
            
            <button
              onClick={() => setRegistrationSuccess(false)}
              className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              {isRTL ? 'تسجيل شركة أخرى' : 'Register Another Company'}
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
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.companyForm.title}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.companyName} *
                </label>
                <input
                  {...register('company_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.company_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>
                )}
              </div>

              {/* Truck Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.truckCount} *
                </label>
                <input
                  {...register('truck_count', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.truck_count && (
                  <p className="text-red-500 text-sm mt-1">{errors.truck_count.message}</p>
                )}
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.hasInsurance} *
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
                    {t.companyForm.insuranceType} *
                  </label>
                  <SearchableSelect
                    options={COMPANY_INSURANCE_TYPES}
                    value={watch('insurance_type') || ''}
                    onChange={(value) => setValue('insurance_type', value)}
                    placeholder={t.companyForm.insuranceType}
                  />
                </div>
              )}

              {/* Manager Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.managerName} *
                </label>
                <input
                  {...register('manager_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                {errors.manager_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.manager_name.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.phone} *
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
                  {t.companyForm.whatsapp} *
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isRTL ? 'جاري التسجيل...' : 'Registering...') : t.companyForm.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
