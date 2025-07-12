
import React, { useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import { useLanguage } from '../contexts/LanguageContext';
import DriverForm from './forms/DriverForm';
import ModalWrapper from './modals/ModalWrapper';

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
    <ModalWrapper 
      title={isRTL ? 'تعديل بيانات السائق' : 'Edit Driver Information'} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-6">
        <DriverForm formData={formData} setFormData={setFormData} />
        
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default EditDriverModal;
