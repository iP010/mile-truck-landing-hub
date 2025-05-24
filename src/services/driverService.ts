
import { executeQuery } from '../api/database';
import { tables } from '../config/database';

export interface Driver {
  id: string;
  driver_name: string;
  nationality: string;
  phone_number: string;
  whatsapp_number: string;
  truck_brand: string;
  truck_type: string;
  has_insurance: boolean;
  insurance_type: string | null;
  invitation_code: string | null;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

export const driverService = {
  // جلب جميع السائقين
  async getAllDrivers(): Promise<Driver[]> {
    const results = await executeQuery(tables.drivers, 'select');
    return results as Driver[];
  },

  // إضافة سائق جديد
  async createDriver(driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const dataToInsert = {
      ...driverData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await executeQuery(tables.drivers, 'insert', dataToInsert);
  },

  // تحديث بيانات السائق
  async updateDriver(id: string, driverData: Partial<Driver>): Promise<void> {
    const dataToUpdate = {
      ...driverData,
      updated_at: new Date().toISOString()
    };
    
    await executeQuery(tables.drivers, 'update', dataToUpdate, { id });
  },

  // حذف السائقين
  async deleteDrivers(ids: string[]): Promise<number> {
    await executeQuery(tables.drivers, 'delete', null, { ids });
    return ids.length;
  }
};
