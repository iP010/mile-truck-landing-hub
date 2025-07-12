
-- إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_drivers_nationality ON public.drivers(nationality);
CREATE INDEX IF NOT EXISTS idx_drivers_truck_brand ON public.drivers(truck_brand);
CREATE INDEX IF NOT EXISTS idx_drivers_truck_type ON public.drivers(truck_type);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON public.drivers(created_at);

CREATE INDEX IF NOT EXISTS idx_companies_created_at ON public.companies(created_at);
CREATE INDEX IF NOT EXISTS idx_companies_has_insurance ON public.companies(has_insurance);

CREATE INDEX IF NOT EXISTS idx_trip_pricing_company_id ON public.trip_pricing(company_pricing_id);
CREATE INDEX IF NOT EXISTS idx_trip_pricing_cities ON public.trip_pricing(from_city, to_city);
CREATE INDEX IF NOT EXISTS idx_trip_pricing_vehicle_type ON public.trip_pricing(vehicle_type);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);

-- تحسين القيود والتحقق من البيانات
ALTER TABLE public.drivers 
ADD CONSTRAINT check_phone_format 
CHECK (phone_number ~ '^[\+]?[0-9\-\(\)\s]+$');

ALTER TABLE public.companies 
ADD CONSTRAINT check_truck_count_positive 
CHECK (truck_count > 0);

ALTER TABLE public.trip_pricing 
ADD CONSTRAINT check_price_positive 
CHECK (price IS NULL OR price >= 0);

-- إضافة قيود فريدة مهمة
ALTER TABLE public.drivers 
ADD CONSTRAINT unique_phone_number UNIQUE (phone_number);

-- تحسين سياسات RLS للأمان
DROP POLICY IF EXISTS "Allow public insert to drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow public read access to drivers" ON public.drivers;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.drivers;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.drivers;
DROP POLICY IF EXISTS "Enable read for all users" ON public.drivers;
DROP POLICY IF EXISTS "Enable update for all users" ON public.drivers;

-- إنشاء سياسات أمان محسنة للسائقين
CREATE POLICY "Public can register as driver when enabled" 
ON public.drivers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.driver_registration_settings 
    WHERE is_enabled = true
  )
);

CREATE POLICY "Admin full access drivers" 
ON public.drivers 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public read drivers for admin" 
ON public.drivers 
FOR SELECT 
USING (get_current_admin_id() IS NOT NULL);

-- تحسين سياسات الشركات
DROP POLICY IF EXISTS "Allow public insert to companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public read access to companies" ON public.companies;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable read for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable update for all users" ON public.companies;

CREATE POLICY "Public can register company" 
ON public.companies 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin full access companies" 
ON public.companies 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public read companies for admin" 
ON public.companies 
FOR SELECT 
USING (get_current_admin_id() IS NOT NULL);

-- تنظيف الجلسات المنتهية الصلاحية
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < NOW();
END;
$$;

-- إضافة مهمة تنظيف دورية (يمكن استخدامها مع pg_cron إذا كان متاحاً)
COMMENT ON FUNCTION public.cleanup_expired_admin_sessions() IS 
'Function to clean up expired admin sessions. Should be called periodically.';

-- تحسين دالة إنشاء أرقام العضوية
CREATE OR REPLACE FUNCTION public.generate_membership_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number INTEGER;
  membership_num TEXT;
  max_attempts INTEGER := 100;
  attempt_count INTEGER := 0;
BEGIN
  LOOP
    -- الحصول على أعلى رقم عضوية وزيادته
    SELECT COALESCE(MAX(CAST(membership_number AS INTEGER)), 10000) + 1
    INTO next_number
    FROM public.companies_pricing
    WHERE membership_number ~ '^[0-9]+$';
    
    membership_num := next_number::TEXT;
    
    -- التحقق من عدم وجود الرقم
    IF NOT EXISTS (SELECT 1 FROM public.companies_pricing WHERE membership_number = membership_num) THEN
      RETURN membership_num;
    END IF;
    
    -- منع الحلقة اللانهائية
    attempt_count := attempt_count + 1;
    IF attempt_count >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique membership number after % attempts', max_attempts;
    END IF;
    
    next_number := next_number + 1;
  END LOOP;
END;
$$;

-- إضافة دالة للتحقق من صحة البيانات
CREATE OR REPLACE FUNCTION public.validate_driver_data()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- التحقق من صحة رقم الهاتف
  IF NEW.phone_number IS NULL OR LENGTH(TRIM(NEW.phone_number)) < 10 THEN
    RAISE EXCEPTION 'Phone number must be at least 10 characters long';
  END IF;
  
  -- التحقق من صحة رقم الواتس آب
  IF NEW.whatsapp_number IS NULL OR LENGTH(TRIM(NEW.whatsapp_number)) < 10 THEN
    RAISE EXCEPTION 'WhatsApp number must be at least 10 characters long';
  END IF;
  
  -- التحقق من وجود نوع التأمين إذا كان هناك تأمين
  IF NEW.has_insurance = true AND (NEW.insurance_type IS NULL OR LENGTH(TRIM(NEW.insurance_type)) = 0) THEN
    RAISE EXCEPTION 'Insurance type is required when has_insurance is true';
  END IF;
  
  RETURN NEW;
END;
$$;

-- إضافة trigger للتحقق من البيانات
DROP TRIGGER IF EXISTS validate_driver_data_trigger ON public.drivers;
CREATE TRIGGER validate_driver_data_trigger
  BEFORE INSERT OR UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_driver_data();

-- دالة مماثلة للشركات
CREATE OR REPLACE FUNCTION public.validate_company_data()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- التحقق من عدد الشاحنات
  IF NEW.truck_count IS NULL OR NEW.truck_count <= 0 THEN
    RAISE EXCEPTION 'Truck count must be greater than 0';
  END IF;
  
  -- التحقق من صحة رقم الهاتف
  IF NEW.phone_number IS NULL OR LENGTH(TRIM(NEW.phone_number)) < 10 THEN
    RAISE EXCEPTION 'Phone number must be at least 10 characters long';
  END IF;
  
  -- التحقق من صحة رقم الواتس آب
  IF NEW.whatsapp_number IS NULL OR LENGTH(TRIM(NEW.whatsapp_number)) < 10 THEN
    RAISE EXCEPTION 'WhatsApp number must be at least 10 characters long';
  END IF;
  
  -- التحقق من وجود نوع التأمين إذا كان هناك تأمين
  IF NEW.has_insurance = true AND (NEW.insurance_type IS NULL OR LENGTH(TRIM(NEW.insurance_type)) = 0) THEN
    RAISE EXCEPTION 'Insurance type is required when has_insurance is true';
  END IF;
  
  RETURN NEW;
END;
$$;

-- إضافة trigger للتحقق من بيانات الشركات
DROP TRIGGER IF EXISTS validate_company_data_trigger ON public.companies;
CREATE TRIGGER validate_company_data_trigger
  BEFORE INSERT OR UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_company_data();

-- إضافة إحصائيات مفيدة كـ views
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.drivers) as total_drivers,
  (SELECT COUNT(*) FROM public.companies) as total_companies,
  (SELECT COUNT(*) FROM public.companies_pricing) as total_pricing_companies,
  (SELECT COUNT(*) FROM public.trip_pricing) as total_trip_prices,
  (SELECT COUNT(*) FROM public.drivers WHERE has_insurance = true) as drivers_with_insurance,
  (SELECT COUNT(*) FROM public.companies WHERE has_insurance = true) as companies_with_insurance,
  (SELECT COUNT(*) FROM public.companies_pricing WHERE is_editing_enabled = true) as active_pricing_companies;
