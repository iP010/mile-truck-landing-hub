
// Supabase Database Configuration
// تم استبدال MySQL بـ Supabase لضمان التوافق مع المتصفح

export const dbConfig = {
  // تتم إدارة الاتصال تلقائياً عبر Supabase
  type: 'supabase',
  tables: {
    drivers: 'drivers',
    companies: 'companies',
    admins: 'admins'
  }
};

// أسماء الجداول والحقول
export const tables = {
  drivers: 'drivers',
  companies: 'companies', 
  admins: 'admins'
};
