
import { executeQuery } from '../api/database';
import { tables } from '../config/database';

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
    const results = await executeQuery(tables.companies, 'select');
    return results as Company[];
  },

  // إضافة شركة جديدة
  async createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const dataToInsert = {
      ...companyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await executeQuery(tables.companies, 'insert', dataToInsert);
  },

  // تحديث بيانات الشركة
  async updateCompany(id: string, companyData: Partial<Company>): Promise<void> {
    const dataToUpdate = {
      ...companyData,
      updated_at: new Date().toISOString()
    };
    
    await executeQuery(tables.companies, 'update', dataToUpdate, { id });
  },

  // حذف الشركات
  async deleteCompanies(ids: string[]): Promise<number> {
    await executeQuery(tables.companies, 'delete', null, { ids });
    return ids.length;
  }
};
