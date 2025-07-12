import React, { useState } from 'react';
import { Building2, User, MessageCircle, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import PhoneInput from '../components/PhoneInput';
import Header from '../components/Header';

interface CompanyFormData {
  company_name: string;
  truck_count: number;
  has_insurance: boolean;
  insurance_type: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
}

const CompanyRegistration = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<CompanyFormData>({
    company_name: '',
    truck_count: 1,
    has_insurance: false,
    insurance_type: '',
    manager_name: '',
    phone_number: '',
    whatsapp_number: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const isRTL = language === 'ar' || language === 'ur';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError('');
    }
  };

  const handlePhoneChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate insurance type selection
    if (formData.has_insurance && !formData.insurance_type) {
      setValidationError(isRTL ? 'يرجى اختيار نوع التأمين أو إلغاء تفعيل التأمين' : 'Please select insurance type or disable insurance');
      return;
    }
    
    setLoading(true);
    setValidationError('');

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          company_name: formData.company_name,
          truck_count: formData.truck_count,
          has_insurance: formData.has_insurance,
          insurance_type: formData.insurance_type,
          manager_name: formData.manager_name,
          phone_number: formData.phone_number,
          whatsapp_number: formData.whatsapp_number
        }]);

      if (error) {
        console.error('Error inserting data:', error);
        alert(t.companyForm.alreadyRegistered);
      } else {
        console.log('Data inserted successfully:', data);
        setSuccess(true);
        setFormData({
          company_name: '',
          truck_count: 1,
          has_insurance: false,
          insurance_type: '',
          manager_name: '',
          phone_number: '',
          whatsapp_number: '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.companyForm.alreadyRegistered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Building2 className="mx-auto h-12 w-12 text-primary mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">{t.companyForm.title}</h2>
          </div>

          {success ? (
            <div className="text-green-600 text-center py-4">
              <Check className="mx-auto h-6 w-6 text-green-600 mb-2" />
              {t.companyForm.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {validationError}
                </div>
              )}

              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.companyName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Building2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder={t.companyForm.companyName}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="truck_count" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.truckCount}
                </label>
                <input
                  type="number"
                  id="truck_count"
                  name="truck_count"
                  value={formData.truck_count}
                  onChange={handleChange}
                  placeholder={t.companyForm.truckCount}
                  min="1"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
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
                  {t.companyForm.hasInsurance}
                </label>
              </div>

              {formData.has_insurance && (
                <div>
                  <label htmlFor="insurance_type" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.companyForm.insuranceType}
                  </label>
                  <select
                    id="insurance_type"
                    name="insurance_type"
                    value={formData.insurance_type}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">{isRTL ? 'اختر نوع التأمين' : 'Select insurance type'}</option>
                    {t.options.companyInsuranceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.companyForm.managerName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="manager_name"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleChange}
                    placeholder={t.companyForm.managerName}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>

              <PhoneInput
                value={formData.phone_number}
                onChange={handlePhoneChange('phone_number')}
                label={t.companyForm.phone}
                placeholder={t.companyForm.phone}
              />

              <PhoneInput
                value={formData.whatsapp_number}
                onChange={handlePhoneChange('whatsapp_number')}
                label={t.companyForm.whatsapp}
                placeholder={t.companyForm.whatsapp}
              />

              <div>
                <Button type="submit" disabled={loading} className="w-full py-3 text-base">
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    t.companyForm.submit
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

export default CompanyRegistration;
