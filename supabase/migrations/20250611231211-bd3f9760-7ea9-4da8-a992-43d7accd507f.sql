
-- حل مشكلة التكرار اللا نهائي في سياسات الأدمن
-- الخطوة 1: حذف جميع الدوال المسببة للمشكلة
DROP FUNCTION IF EXISTS public.get_current_admin_id() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;

-- الخطوة 2: تعطيل RLS مؤقتاً وحذف جميع السياسات
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin authentication" ON public.admins;
DROP POLICY IF EXISTS "Allow admin self update" ON public.admins;
DROP POLICY IF EXISTS "Allow admin insert" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for authentication" ON public.admins;
DROP POLICY IF EXISTS "Enable update for authenticated admins" ON public.admins;
DROP POLICY IF EXISTS "Enable insert for system" ON public.admins;
DROP POLICY IF EXISTS "admins_select_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_update_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_insert_policy" ON public.admins;
DROP POLICY IF EXISTS "Allow all operations on admins" ON public.admins;

-- الخطوة 3: التأكد من وجود المدير الافتراضي
DELETE FROM public.admins WHERE username = 'admin';
INSERT INTO public.admins (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', 'Zz115599', 'super_admin');

-- الخطوة 4: إعادة تمكين RLS مع سياسات بسيطة جداً
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- سياسة واحدة بسيطة تسمح بجميع العمليات
CREATE POLICY "allow_all_admin_operations" ON public.admins
FOR ALL USING (true) WITH CHECK (true);

-- تنظيف الجلسات المنتهية الصلاحية
DELETE FROM public.admin_sessions WHERE expires_at < NOW();
