
-- إعادة تكوين سياسات RLS لجدول admin_sessions
-- تعطيل RLS مؤقتاً
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "allow_all_session_operations" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session creation" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session validation" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session cleanup" ON public.admin_sessions;

-- إعادة تمكين RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- إضافة سياسة شاملة تسمح بجميع العمليات للجميع
CREATE POLICY "allow_all_operations_on_admin_sessions" ON public.admin_sessions
FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- التأكد من أن الجدول يحتوي على البيانات المطلوبة
-- حذف أي جلسات منتهية الصلاحية
DELETE FROM public.admin_sessions WHERE expires_at < NOW();
