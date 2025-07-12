-- إضافة policy للسماح بقراءة admin للتسجيل دخول
CREATE POLICY "Allow login access to admins" 
ON public.admins 
FOR SELECT 
USING (true);