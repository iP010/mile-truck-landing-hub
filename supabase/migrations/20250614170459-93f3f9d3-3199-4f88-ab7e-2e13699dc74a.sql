
-- المرحلة الأولى: بناء سياسات أمان متينة للجداول الإدارية مع تحقق صريح من الجلسة وصلاحيات الدور

-- حذف الدوال والسياسات القديمة إن وجدت
DROP FUNCTION IF EXISTS public.get_current_admin_id() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;

-- حذف جميع السياسات عن جميع الجداول الإدارية
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_admin_operations" ON public.admins;
DROP POLICY IF EXISTS "Allow all operations on admins" ON public.admins;
DROP POLICY IF EXISTS "Allow admin self update" ON public.admins;
DROP POLICY IF EXISTS "Allow admin insert" ON public.admins;
DROP POLICY IF EXISTS "admins_select_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_update_policy" ON public.admins;
DROP POLICY IF EXISTS "admins_insert_policy" ON public.admins;

DROP POLICY IF EXISTS "allow_all_operations_on_admin_sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "allow_all_session_operations" ON public.admin_sessions;

DROP POLICY IF EXISTS "Admins can view drivers" ON public.drivers;
DROP POLICY IF EXISTS "Admins can insert drivers" ON public.drivers;
DROP POLICY IF EXISTS "Admins can update drivers" ON public.drivers;
DROP POLICY IF EXISTS "Admins can delete drivers" ON public.drivers;

DROP POLICY IF EXISTS "Admins can view companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can update companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can delete companies" ON public.companies;

-- إعادة تمكين RLS للجداول
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- دالة استخراج admin_id من الجلسة معتمدة على id الجلسة
CREATE OR REPLACE FUNCTION public.get_current_admin_id()
RETURNS UUID AS $$
DECLARE
  session_id UUID;
  admin_id UUID;
BEGIN
  -- الحصول على session_id من إعداد عمومي خاص لسهولة الربط من الواجهة
  session_id := NULLIF(current_setting('request.headers', true)::json->>'x-admin-session-id', '');

  IF session_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- استخراج admin_id في حال عدم إنتهاء الجلسة
  SELECT admin_id INTO admin_id
  FROM public.admin_sessions
  WHERE id = session_id AND expires_at > NOW();

  RETURN admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- دالة إرجاع الدور الحالي إن وُجد
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS TEXT AS $$
DECLARE
  the_admin_id UUID := public.get_current_admin_id();
  out_role TEXT;
BEGIN
  IF the_admin_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT role::text INTO out_role
  FROM public.admins WHERE id = the_admin_id;
  RETURN out_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- == سياسات admins ===
-- السماح للمدير بعرض بيانات نفسه فقط
CREATE POLICY "admin_can_read_self" ON public.admins
  FOR SELECT USING (id = public.get_current_admin_id());

-- السماح للمدير بتحديث نفسه فقط
CREATE POLICY "admin_can_update_self" ON public.admins
  FOR UPDATE USING (id = public.get_current_admin_id());

-- السماح للقائد (super_admin) بالوصول الكامل لجميع الأدمن
CREATE POLICY "super_admin_full_access" ON public.admins
  FOR ALL
  USING (public.get_current_admin_role() = 'super_admin')
  WITH CHECK (public.get_current_admin_role() = 'super_admin');

-- == سياسات admin_sessions ==
-- السماح بصلاحيات كاملة فقط للمدير المرتبط بالجسلة، أو لـ(super_admin)
CREATE POLICY "admin_own_session" ON public.admin_sessions
  FOR ALL
  USING (
    admin_id = public.get_current_admin_id()
    OR public.get_current_admin_role() = 'super_admin'
  ) 
  WITH CHECK (
    admin_id = public.get_current_admin_id()
    OR public.get_current_admin_role() = 'super_admin'
  );

-- == سياسات drivers ==
CREATE POLICY "admin_access_drivers" ON public.drivers
  FOR ALL
  USING (public.get_current_admin_id() IS NOT NULL) 
  WITH CHECK (public.get_current_admin_id() IS NOT NULL);

-- == سياسات companies ==
CREATE POLICY "admin_access_companies" ON public.companies
  FOR ALL
  USING (public.get_current_admin_id() IS NOT NULL)
  WITH CHECK (public.get_current_admin_id() IS NOT NULL);

-- تنظيف الجلسات المنتهية من النظام
DELETE FROM public.admin_sessions WHERE expires_at < NOW();

