
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { NATIONALITIES, TRUCK_BRANDS, TRUCK_TYPES, DRIVER_INSURANCE_TYPES } from '../../utils/constants';
import SearchableSelect from '../SearchableSelect';
import PhoneInputWithCountry from '../PhoneInputWithCountry';
import FormField from './FormField';

interface DriverFormData {
  driver_name: string;
  nationality: string;
  phone_number: string;
  whatsapp_number: string;
  truck_brand: string;
  truck_type: string;
  has_insurance: boolean;
  insurance_type: string;
  invitation_code: string;
}

interface DriverFormProps {
  formData: DriverFormData;
  setFormData: (data: DriverFormData) => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ formData, setFormData }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <div className="space-y-4">
      <FormField label={isRTL ? 'اسم السائق' : 'Driver Name'}>
        <input
          type="text"
          value={formData.driver_name}
          onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </FormField>

      <FormField label={isRTL ? 'الجنسية' : 'Nationality'}>
        <SearchableSelect
          options={NATIONALITIES}
          value={formData.nationality}
          onChange={(value) => setFormData({ ...formData, nationality: value })}
          placeholder={isRTL ? 'اختر الجنسية' : 'Select nationality'}
        />
      </FormField>

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

      <FormField label={isRTL ? 'ماركة الشاحنة' : 'Truck Brand'}>
        <SearchableSelect
          options={TRUCK_BRANDS}
          value={formData.truck_brand}
          onChange={(value) => setFormData({ ...formData, truck_brand: value })}
          placeholder={isRTL ? 'اختر ماركة الشاحنة' : 'Select truck brand'}
        />
      </FormField>

      <FormField label={isRTL ? 'نوع الشاحنة' : 'Truck Type'}>
        <SearchableSelect
          options={TRUCK_TYPES}
          value={formData.truck_type}
          onChange={(value) => setFormData({ ...formData, truck_type: value })}
          placeholder={isRTL ? 'اختر نوع الشاحنة' : 'Select truck type'}
        />
      </FormField>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.has_insurance}
            onChange={(e) => setFormData({ ...formData, has_insurance: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            {isRTL ? 'يوجد تأمين' : 'Has Insurance'}
          </span>
        </label>
      </div>

      {formData.has_insurance && (
        <FormField label={isRTL ? 'نوع التأمين' : 'Insurance Type'}>
          <SearchableSelect
            options={DRIVER_INSURANCE_TYPES}
            value={formData.insurance_type}
            onChange={(value) => setFormData({ ...formData, insurance_type: value })}
            placeholder={isRTL ? 'اختر نوع التأمين' : 'Select insurance type'}
          />
        </FormField>
      )}

      <FormField label={isRTL ? 'كود الدعوة' : 'Invitation Code'}>
        <input
          type="text"
          value={formData.invitation_code}
          onChange={(e) => setFormData({ ...formData, invitation_code: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </FormField>
    </div>
  );
};

export default DriverForm;
