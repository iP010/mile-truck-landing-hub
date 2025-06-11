
-- حذف جميع السياسات الموجودة وإعادة إنشاءها بشكل صحيح
-- هذا سيحل مشكلة التكرار اللا نهائي نهائياً

-- حذف السياسات الموجودة
DROP POLICY IF EXISTS "Allow admin authentication" ON public.admins;
DROP POLICY IF EXISTS "Allow admin self update" ON public.admins;
DROP POLICY IF EXISTS "Allow admin insert" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for authentication" ON public.admins;
DROP POLICY IF EXISTS "Enable update for authenticated admins" ON public.admins;
DROP POLICY IF EXISTS "Enable insert for system" ON public.admins;

-- تعطيل RLS مؤقتاً لحل المشكلة
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- التأكد من وجود الأدمن الافتراضي
DELETE FROM public.admins WHERE username = 'admin';
INSERT INTO public.admins (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', 'Zz115599', 'super_admin');

-- إعادة تمكين RLS مع سياسات بسيطة
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- سياسة بسيطة للقراءة (بدون شروط معقدة)
CREATE POLICY "admins_select_policy" ON public.admins
FOR SELECT USING (true);

-- سياسة بسيطة للتحديث
CREATE POLICY "admins_update_policy" ON public.admins
FOR UPDATE USING (true);

-- سياسة بسيطة للإدراج
CREATE POLICY "admins_insert_policy" ON public.admins
FOR INSERT WITH CHECK (true);

-- تنظيف الجلسات المنتهية الصلاحية
DELETE FROM public.admin_sessions WHERE expires_at < NOW();
