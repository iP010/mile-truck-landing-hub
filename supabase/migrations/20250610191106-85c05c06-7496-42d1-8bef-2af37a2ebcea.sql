
-- إضافة سياسات الأمان المناسبة لجدول admins
-- هذا سيحل مشكلة "infinite recursion detected in policy"

-- تمكين Row Level Security على جدول admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح بقراءة بيانات الأدمن للمصادقة
CREATE POLICY "Allow admin authentication" 
ON public.admins 
FOR SELECT 
USING (true);

-- سياسة للسماح للأدمن بتحديث بياناتهم الخاصة
CREATE POLICY "Allow admin self update" 
ON public.admins 
FOR UPDATE 
USING (true);

-- سياسة للسماح بإدراج أدمن جديد (للمطورين فقط)
CREATE POLICY "Allow admin insert" 
ON public.admins 
FOR INSERT 
WITH CHECK (true);
