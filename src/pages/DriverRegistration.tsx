import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Phone, Shield, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import SearchableSelect from '../components/SearchableSelect';
import { NATIONALITIES, TRUCK_BRANDS, TRUCK_TYPES, INSURANCE_TYPES } from '../utils/constants';
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
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: existingDriver, error: existingDriverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('phone_number', formData.phone_number)
        .single();

      if (existingDriverError) {
        console.error('Error checking existing driver:', existingDriverError);
        setError(t.driverForm.alreadyRegistered);
        setLoading(false);
        return;
      }

      if (existingDriver) {
        setError(t.driverForm.alreadyRegistered);
        setLoading(false);
        return;
      }

      const { data: referralData, error: referralError } = await supabase
        .from('drivers')
        .select('referral_code')
        .eq('referral_code', formData.invitation_code)
        .single();

      if (referralError && formData.invitation_code) {
        console.error('Error checking referral code:', referralError);
        setError('Invalid invitation code.');
        setLoading(false);
        return;
      }

      const referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error } = await supabase
        .from('drivers')
        .insert([
          {
            ...formData,
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
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="driver_name" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.name}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="driver_name"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.nationality}
                </label>
                <div className="mt-1">
                  <SearchableSelect
                    id="nationality"
                    name="nationality"
                    options={NATIONALITIES}
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    isRTL={isRTL}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="truck_brand" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.truckBrand}
                </label>
                <div className="mt-1">
                  <SearchableSelect
                    id="truck_brand"
                    name="truck_brand"
                    options={TRUCK_BRANDS}
                    value={formData.truck_brand}
                    onChange={handleChange}
                    required
                    isRTL={isRTL}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="truck_type" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.truckType}
                </label>
                <div className="mt-1">
                  <SearchableSelect
                    id="truck_type"
                    name="truck_type"
                    options={TRUCK_TYPES}
                    value={formData.truck_type}
                    onChange={handleChange}
                    required
                    isRTL={isRTL}
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
                  {t.driverForm.hasInsurance}
                </label>
              </div>

              {formData.has_insurance && (
                <div>
                  <label htmlFor="insurance_type" className="block text-sm font-medium text-gray-700">
                    {t.driverForm.insuranceType}
                  </label>
                  <div className="mt-1">
                    <select
                      id="insurance_type"
                      name="insurance_type"
                      value={formData.insurance_type}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">{t.common.search}</option>
                      {INSURANCE_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.phone}
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
                  {t.driverForm.whatsapp}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                <label htmlFor="invitation_code" className="block text-sm font-medium text-gray-700">
                  {t.driverForm.invitationCode}
                  <span className="text-gray-500 ml-1">{t.common.optional}</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Shield className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="invitation_code"
                    name="invitation_code"
                    value={formData.invitation_code}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p>{error}</p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center"
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
