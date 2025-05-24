
// Supabase Database Configuration
// تم استبدال MySQL بـ Supabase لضمان التوافق مع المتصفح

export const dbConfig = {
  // تتم إدارة الاتصال تلقائياً عبر Supabase
  type: 'supabase',
  tables: {
    drivers: 'drivers' as const,
    companies: 'companies' as const,
    admins: 'admins' as const
  }
};

// أسماء الجداول والحقول
export const tables = {
  drivers: 'drivers' as const,
  companies: 'companies' as const, 
  admins: 'admins' as const
} as const;
