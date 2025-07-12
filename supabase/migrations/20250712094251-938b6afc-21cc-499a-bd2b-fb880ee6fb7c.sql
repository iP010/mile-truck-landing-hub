-- إضافة policy للسماح بإنشاء sessions للتسجيل دخول
CREATE POLICY "Allow session creation for login" 
ON public.admin_sessions 
FOR INSERT 
WITH CHECK (true);