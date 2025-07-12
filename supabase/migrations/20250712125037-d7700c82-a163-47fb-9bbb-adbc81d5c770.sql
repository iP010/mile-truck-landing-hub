
-- إنشاء جدول لإعدادات تسجيل السائقين
CREATE TABLE public.driver_registration_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إدراج سجل افتراضي
INSERT INTO public.driver_registration_settings (is_enabled) VALUES (true);

-- تمكين Row Level Security
ALTER TABLE public.driver_registration_settings ENABLE ROW LEVEL SECURITY;

-- سياسة للمشرفين للوصول الكامل
CREATE POLICY "Admin full access driver_registration_settings" 
  ON public.driver_registration_settings 
  FOR ALL 
  USING (get_current_admin_id() IS NOT NULL)
  WITH CHECK (get_current_admin_id() IS NOT NULL);

-- سياسة للقراءة العامة لمعرفة حالة التسجيل
CREATE POLICY "Public read driver_registration_settings" 
  ON public.driver_registration_settings 
  FOR SELECT 
  USING (true);

-- إضافة trigger لتحديث updated_at
CREATE TRIGGER update_driver_registration_settings_updated_at
  BEFORE UPDATE ON public.driver_registration_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
