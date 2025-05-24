
import { executeQuery } from '../api/database';
import { queries } from '../config/database';

export interface Company {
  id: string;
  company_name: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
  truck_count: number;
  has_insurance: boolean;
  insurance_type: string | null;
  created_at: string;
  updated_at: string;
}

export const companyService = {
  // جلب جميع الشركات
  async getAllCompanies(): Promise<Company[]> {
    const results = await executeQuery(queries.getAllCompanies);
    return results as Company[];
  },

  // إضافة شركة جديدة
  async createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const params = [
      companyData.company_name,
      companyData.manager_name,
      companyData.phone_number,
      companyData.whatsapp_number,
      companyData.truck_count,
      companyData.has_insurance,
      companyData.insurance_type
    ];
    
    await executeQuery(queries.insertCompany, params);
  },

  // تحديث بيانات الشركة
  async updateCompany(id: string, companyData: Partial<Company>): Promise<void> {
    const params = [
      companyData.company_name,
      companyData.manager_name,
      companyData.phone_number,
      companyData.whatsapp_number,
      companyData.truck_count,
      companyData.has_insurance,
      companyData.insurance_type,
      id
    ];
    
    await executeQuery(queries.updateCompany, params);
  },

  // حذف الشركات
  async deleteCompanies(ids: string[]): Promise<number> {
    const placeholders = ids.map(() => '?').join(',');
    const query = queries.deleteCompanies.replace('?', placeholders);
    const result: any = await executeQuery(query, ids);
    return result.affectedRows;
  }
};
