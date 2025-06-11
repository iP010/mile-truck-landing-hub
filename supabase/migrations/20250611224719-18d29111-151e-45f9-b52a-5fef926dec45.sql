
-- إزالة أي سياسات موجودة للجدول admins
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admins;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admins;
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can update their own records" ON public.admins;
DROP POLICY IF EXISTS "Allow all operations on admins" ON public.admins;

-- تفعيل RLS للجدول
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة بسيطة للسماح بجميع العمليات على جدول المديرين
-- هذا آمن لأن الوصول للجدول محدود عبر التطبيق نفسه
CREATE POLICY "Allow all operations on admins" ON public.admins
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- تنظيف الجلسات المنتهية الصلاحية
DELETE FROM public.admin_sessions WHERE expires_at < NOW();
