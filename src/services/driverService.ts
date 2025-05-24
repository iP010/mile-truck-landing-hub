
import { executeQuery } from '../api/database';
import { queries } from '../config/database';

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
    const results = await executeQuery(queries.getAllDrivers);
    return results as Driver[];
  },

  // إضافة سائق جديد
  async createDriver(driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const params = [
      driverData.driver_name,
      driverData.nationality,
      driverData.phone_number,
      driverData.whatsapp_number,
      driverData.truck_brand,
      driverData.truck_type,
      driverData.has_insurance,
      driverData.insurance_type,
      driverData.invitation_code,
      driverData.referral_code
    ];
    
    await executeQuery(queries.insertDriver, params);
  },

  // تحديث بيانات السائق
  async updateDriver(id: string, driverData: Partial<Driver>): Promise<void> {
    const params = [
      driverData.driver_name,
      driverData.nationality,
      driverData.phone_number,
      driverData.whatsapp_number,
      driverData.truck_brand,
      driverData.truck_type,
      driverData.has_insurance,
      driverData.insurance_type,
      driverData.invitation_code,
      id
    ];
    
    await executeQuery(queries.updateDriver, params);
  },

  // حذف السائقين
  async deleteDrivers(ids: string[]): Promise<number> {
    const placeholders = ids.map(() => '?').join(',');
    const query = queries.deleteDrivers.replace('?', placeholders);
    const result: any = await executeQuery(query, ids);
    return result.affectedRows;
  }
};
