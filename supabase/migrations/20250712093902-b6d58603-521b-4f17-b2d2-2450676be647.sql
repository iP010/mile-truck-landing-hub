-- تحديث كلمة مرور admin للاختبار (غير مشفرة)
UPDATE public.admins 
SET password_hash = 'admin123' 
WHERE username = 'admin';