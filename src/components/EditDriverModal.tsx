import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import { useLanguage } from '../contexts/LanguageContext';
import { NATIONALITIES, TRUCK_BRANDS, TRUCK_TYPES, DRIVER_INSURANCE_TYPES } from '../utils/constants';
import SearchableSelect from './SearchableSelect';
import PhoneInputWithCountry from './PhoneInputWithCountry';

type Driver = Tables<'drivers'>;

interface EditDriverModalProps {
  driver: Driver;
  onClose: () => void;
  onUpdate: (driver: Driver) => void;
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ driver, onClose, onUpdate }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [formData, setFormData] = useState({
    driver_name: driver.driver_name,
    nationality: driver.nationality,
    phone_number: driver.phone_number,
    whatsapp_number: driver.whatsapp_number,
    truck_brand: driver.truck_brand,
    truck_type: driver.truck_type,
    has_insurance: driver.has_insurance,
    insurance_type: driver.insurance_type || '',
    invitation_code: driver.invitation_code || ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('drivers')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', driver.id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      alert(isRTL ? 'حدث خطأ في تحديث البيانات' : 'Error updating driver data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isRTL ? 'تعديل بيانات السائق' : 'Edit Driver Information'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'اسم السائق' : 'Driver Name'}
            </label>
            <input
              type="text"
              value={formData.driver_name}
              onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'الجنسية' : 'Nationality'}
            </label>
            <SearchableSelect
              options={NATIONALITIES}
              value={formData.nationality}
              onChange={(value) => setFormData({ ...formData, nationality: value })}
              placeholder={isRTL ? 'اختر الجنسية' : 'Select nationality'}
            />
          </div>

          <PhoneInputWithCountry
            label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
            value={formData.phone_number}
            onChange={(value) => setFormData({ ...formData, phone_number: value })}
          />

          <PhoneInputWithCountry
            label={isRTL ? 'رقم الواتس آب' : 'WhatsApp Number'}
            value={formData.whatsapp_number}
            onChange={(value) => setFormData({ ...formData, whatsapp_number: value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'ماركة الشاحنة' : 'Truck Brand'}
            </label>
            <SearchableSelect
              options={TRUCK_BRANDS}
              value={formData.truck_brand}
              onChange={(value) => setFormData({ ...formData, truck_brand: value })}
              placeholder={isRTL ? 'اختر ماركة الشاحنة' : 'Select truck brand'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'نوع الشاحنة' : 'Truck Type'}
            </label>
            <SearchableSelect
              options={TRUCK_TYPES}
              value={formData.truck_type}
              onChange={(value) => setFormData({ ...formData, truck_type: value })}
              placeholder={isRTL ? 'اختر نوع الشاحنة' : 'Select truck type'}
            />
          </div>

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? 'نوع التأمين' : 'Insurance Type'}
              </label>
              <SearchableSelect
                options={DRIVER_INSURANCE_TYPES}
                value={formData.insurance_type}
                onChange={(value) => setFormData({ ...formData, insurance_type: value })}
                placeholder={isRTL ? 'اختر نوع التأمين' : 'Select insurance type'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'كود الدعوة' : 'Invitation Code'}
            </label>
            <input
              type="text"
              value={formData.invitation_code}
              onChange={(e) => setFormData({ ...formData, invitation_code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriverModal;
