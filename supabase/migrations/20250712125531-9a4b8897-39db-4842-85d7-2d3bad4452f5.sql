
-- إنشاء جدول الجنسيات
CREATE TABLE public.driver_nationalities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إدراج الجنسيات الافتراضية
INSERT INTO public.driver_nationalities (name, display_order) VALUES
('السعودية', 1),
('مصر', 2),
('الأردن', 3),
('الإمارات', 4),
('الكويت', 5),
('قطر', 6),
('البحرين', 7),
('عمان', 8),
('العراق', 9),
('سوريا', 10),
('لبنان', 11),
('اليمن', 12),
('ليبيا', 13),
('تونس', 14),
('الجزائر', 15),
('المغرب', 16),
('السودان', 17),
('الصومال', 18),
('جيبوتي', 19),
('موريتانيا', 20),
('جزر القمر', 21),
('الهند', 22),
('باكستان', 23),
('بنغلاديش', 24),
('الفلبين', 25),
('إندونيسيا', 26),
('نيبال', 27),
('سريلانكا', 28),
('أفغانستان', 29),
('ميانمار', 30),
('تايلاند', 31),
('فيتنام', 32),
('ماليزيا', 33),
('إثيوبيا', 34),
('كينيا', 35),
('أوغندا', 36),
('تنزانيا', 37),
('رواندا', 38),
('بوروندي', 39),
('الكونغو', 40),
('نيجيريا', 41),
('غانا', 42),
('تركيا', 43),
('إيران', 44),
('أذربيجان', 45),
('جورجيا', 46),
('أرمينيا', 47),
('كازاخستان', 48),
('أوزبكستان', 49),
('قرغيزستان', 50),
('طاجيكستان', 51),
('تركمانستان', 52),
('أخرى', 100);

-- إنشاء جدول ماركات الشاحنات
CREATE TABLE public.truck_brands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إدراج ماركات الشاحنات الافتراضية
INSERT INTO public.truck_brands (name, display_order) VALUES
('مرسيدس', 1),
('مان', 2),
('سكانيا', 3),
('فولفو', 4),
('دي أيه أف', 5),
('إيفيكو', 6),
('رينو', 7),
('فوتون', 8),
('هينو', 9),
('إيسوزو', 10),
('ميتسوبيشي فوسو', 11),
('تاتا', 12),
('أشوك ليلاند', 13),
('ماك', 14),
('فريتلاينر', 15),
('كينوورث', 16),
('بيتيربيلت', 17),
('ويسترن ستار', 18),
('هياندي', 19),
('كيا', 20),
('دونغ فنغ', 21),
('فاو', 22),
('سينوتروك', 23),
('شاكمان', 24),
('أخرى', 100);

-- إنشاء جدول أنواع الشاحنات
CREATE TABLE public.truck_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إدراج أنواع الشاحنات الافتراضية
INSERT INTO public.truck_types (name, display_order) VALUES
('براد', 1),
('براد مع تبريد', 2),
('سطحة', 3),
('جوانب', 4),
('جوانب ألماني', 5),
('ستارة', 6);

-- إنشاء جدول أنواع التأمين للسائقين
CREATE TABLE public.insurance_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('driver', 'company')),
  is_active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إدراج أنواع التأمين للسائقين
INSERT INTO public.insurance_types (name, type, display_order) VALUES
('شامل مع البضاعة', 'driver', 1),
('شامل', 'driver', 2),
('ضد الغير', 'driver', 3),
('تأمين شركة أو مؤسسة شامل المركبات', 'company', 1),
('شامل مع البضاعة', 'company', 2),
('شامل', 'company', 3),
('ضد الغير', 'company', 4);

-- تمكين RLS لجميع الجداول
ALTER TABLE public.driver_nationalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_types ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة للعناصر النشطة
CREATE POLICY "Public read active driver_nationalities" 
  ON public.driver_nationalities 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public read active truck_brands" 
  ON public.truck_brands 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public read active truck_types" 
  ON public.truck_types 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public read active insurance_types" 
  ON public.insurance_types 
  FOR SELECT 
  USING (is_active = true);

-- سياسات الوصول الكامل للمشرفين
CREATE POLICY "Admin full access driver_nationalities" 
  ON public.driver_nationalities 
  FOR ALL 
  USING (get_current_admin_id() IS NOT NULL)
  WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Admin full access truck_brands" 
  ON public.truck_brands 
  FOR ALL 
  USING (get_current_admin_id() IS NOT NULL)
  WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Admin full access truck_types" 
  ON public.truck_types 
  FOR ALL 
  USING (get_current_admin_id() IS NOT NULL)
  WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Admin full access insurance_types" 
  ON public.insurance_types 
  FOR ALL 
  USING (get_current_admin_id() IS NOT NULL)
  WITH CHECK (get_current_admin_id() IS NOT NULL);

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_driver_nationalities_updated_at
  BEFORE UPDATE ON public.driver_nationalities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_truck_brands_updated_at
  BEFORE UPDATE ON public.truck_brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_truck_types_updated_at
  BEFORE UPDATE ON public.truck_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_types_updated_at
  BEFORE UPDATE ON public.insurance_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
