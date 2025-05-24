import React, { useState } from 'react';
import { Building2, User, Phone, Shield, Check, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { COMPANY_INSURANCE_TYPES } from '../utils/constants';
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
    insurance_type: COMPANY_INSURANCE_TYPES[0],
    manager_name: '',
    phone_number: '',
    whatsapp_number: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRTL = language === 'ar' || language === 'ur';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
          insurance_type: COMPANY_INSURANCE_TYPES[0],
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  {t.companyForm.companyName}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="truck_count" className="block text-sm font-medium text-gray-700">
                  {t.companyForm.truckCount}
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="truck_count"
                    name="truck_count"
                    value={formData.truck_count}
                    onChange={handleChange}
                    min="1"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="has_insurance"
                  name="has_insurance"
                  type="checkbox"
                  checked={formData.has_insurance}
                  onChange={handleChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="has_insurance" className="ml-2 block text-sm text-gray-900">
                  {t.companyForm.hasInsurance}
                </label>
              </div>

              {formData.has_insurance && (
                <div>
                  <label htmlFor="insurance_type" className="block text-sm font-medium text-gray-700">
                    {t.companyForm.insuranceType}
                  </label>
                  <div className="mt-1">
                    <select
                      id="insurance_type"
                      name="insurance_type"
                      value={formData.insurance_type}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {COMPANY_INSURANCE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
                  {t.companyForm.managerName}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="manager_name"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  {t.companyForm.phone}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                  {t.companyForm.whatsapp}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <MessageCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="tel"
                    id="whatsapp_number"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" disabled={loading} className="w-full">
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
