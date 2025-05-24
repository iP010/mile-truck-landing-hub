
// MySQL Database Configuration
export const dbConfig = {
  host: 'localhost', // أو عنوان الخادم الخاص بك
  user: 'root', // اسم المستخدم
  password: '', // كلمة المرور
  database: 'miletruck_db', // اسم قاعدة البيانات
  port: 3306
};

// SQL queries for MySQL
export const queries = {
  // Driver queries
  getAllDrivers: `
    SELECT * FROM drivers 
    ORDER BY created_at DESC
  `,
  
  insertDriver: `
    INSERT INTO drivers (
      driver_name, nationality, phone_number, whatsapp_number,
      truck_brand, truck_type, has_insurance, insurance_type,
      invitation_code, referral_code, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `,
  
  updateDriver: `
    UPDATE drivers SET 
      driver_name = ?, nationality = ?, phone_number = ?, whatsapp_number = ?,
      truck_brand = ?, truck_type = ?, has_insurance = ?, insurance_type = ?,
      invitation_code = ?, updated_at = NOW()
    WHERE id = ?
  `,
  
  deleteDrivers: `
    DELETE FROM drivers WHERE id IN (?)
  `,
  
  // Company queries
  getAllCompanies: `
    SELECT * FROM companies 
    ORDER BY created_at DESC
  `,
  
  insertCompany: `
    INSERT INTO companies (
      company_name, manager_name, phone_number, whatsapp_number,
      truck_count, has_insurance, insurance_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `,
  
  updateCompany: `
    UPDATE companies SET 
      company_name = ?, manager_name = ?, phone_number = ?, whatsapp_number = ?,
      truck_count = ?, has_insurance = ?, insurance_type = ?, updated_at = NOW()
    WHERE id = ?
  `,
  
  deleteCompanies: `
    DELETE FROM companies WHERE id IN (?)
  `,
  
  // Admin queries
  getAdminByUsername: `
    SELECT id, username, email, password_hash 
    FROM admins 
    WHERE username = ?
  `,
  
  updateAdminPassword: `
    UPDATE admins SET 
      password_hash = ?, updated_at = NOW() 
    WHERE id = ?
  `
};
