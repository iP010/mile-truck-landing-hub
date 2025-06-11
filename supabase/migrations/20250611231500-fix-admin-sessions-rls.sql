
-- إضافة سياسات RLS لجدول admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- حذف أي سياسات موجودة
DROP POLICY IF EXISTS "Allow session creation" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session validation" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow session cleanup" ON public.admin_sessions;

-- سياسة بسيطة تسمح بجميع العمليات على الجلسات
CREATE POLICY "allow_all_session_operations" ON public.admin_sessions
FOR ALL USING (true) WITH CHECK (true);
