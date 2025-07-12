
export const handleDatabaseError = (error: any, isRTL: boolean) => {
  console.error('Database error:', error);
  
  if (error?.message?.includes('Phone number must be at least 10 characters')) {
    return isRTL ? 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل' : 'Phone number must be at least 10 characters long';
  }
  
  if (error?.message?.includes('WhatsApp number must be at least 10 characters')) {
    return isRTL ? 'رقم الواتس آب يجب أن يكون 10 أرقام على الأقل' : 'WhatsApp number must be at least 10 characters long';
  }
  
  if (error?.message?.includes('Insurance type is required')) {
    return isRTL ? 'نوع التأمين مطلوب عند وجود تأمين' : 'Insurance type is required when insurance is selected';
  }
  
  if (error?.message?.includes('Truck count must be greater than 0')) {
    return isRTL ? 'عدد الشاحنات يجب أن يكون أكبر من صفر' : 'Number of trucks must be greater than 0';
  }
  
  if (error?.message?.includes('duplicate key value violates unique constraint "unique_phone_number"')) {
    return isRTL ? 'رقم الهاتف مستخدم من قبل' : 'Phone number is already registered';
  }
  
  if (error?.message?.includes('check_phone_format')) {
    return isRTL ? 'تنسيق رقم الهاتف غير صحيح' : 'Invalid phone number format';
  }
  
  return isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
};
