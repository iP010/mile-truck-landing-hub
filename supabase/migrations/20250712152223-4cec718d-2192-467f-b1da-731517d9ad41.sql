
-- إنشاء جدول قائمة انتظار السائقين
CREATE TABLE public.driver_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول قائمة انتظار الشركات
CREATE TABLE public.company_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول إعدادات تسجيل الشركات
CREATE TABLE public.company_registration_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدراج سجل افتراضي لإعدادات تسجيل الشركات
INSERT INTO public.company_registration_settings (is_enabled) VALUES (true);

-- إضافة RLS للجداول الجديدة
-- قائمة انتظار السائقين
ALTER TABLE public.driver_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access driver_waitlist"
ON public.driver_waitlist
FOR ALL
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public can register in driver waitlist when registration disabled"
ON public.driver_waitlist
FOR INSERT
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM driver_registration_settings 
    WHERE is_enabled = true
  )
);

-- قائمة انتظار الشركات
ALTER TABLE public.company_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access company_waitlist"
ON public.company_waitlist
FOR ALL
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public can register in company waitlist when registration disabled"
ON public.company_waitlist
FOR INSERT
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM company_registration_settings 
    WHERE is_enabled = true
  )
);

-- إعدادات تسجيل الشركات
ALTER TABLE public.company_registration_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access company_registration_settings"
ON public.company_registration_settings
FOR ALL
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public read company_registration_settings"
ON public.company_registration_settings
FOR SELECT
USING (true);

-- إضافة triggers للتحديث التلقائي لـ updated_at
CREATE TRIGGER update_driver_waitlist_updated_at
  BEFORE UPDATE ON public.driver_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_waitlist_updated_at
  BEFORE UPDATE ON public.company_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_registration_settings_updated_at
  BEFORE UPDATE ON public.company_registration_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
