
import React, { useState } from 'react';
import { Button } from './ui/button';
import { driverService, Driver } from '../services/driverService';
import { useLanguage } from '../contexts/LanguageContext';
import DriverForm from './forms/DriverForm';
import ModalWrapper from './modals/ModalWrapper';

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
      await driverService.updateDriver(driver.id, formData);
      
      // إنشاء كائن السائق المحدث
      const updatedDriver: Driver = {
        ...driver,
        ...formData,
        updated_at: new Date().toISOString()
      };
      
      onUpdate(updatedDriver);
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
