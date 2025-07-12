
-- إزالة العرض الحالي وإعادة إنشاؤه بدون SECURITY DEFINER
DROP VIEW IF EXISTS public.dashboard_stats;

-- إنشاء العرض مع سياسات RLS مناسبة
CREATE VIEW public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.drivers) as total_drivers,
  (SELECT COUNT(*) FROM public.companies) as total_companies,
  (SELECT COUNT(*) FROM public.companies_pricing) as total_pricing_companies,
  (SELECT COUNT(*) FROM public.trip_pricing) as total_trip_prices,
  (SELECT COUNT(*) FROM public.drivers WHERE has_insurance = true) as drivers_with_insurance,
  (SELECT COUNT(*) FROM public.companies WHERE has_insurance = true) as companies_with_insurance,
  (SELECT COUNT(*) FROM public.companies_pricing WHERE is_editing_enabled = true) as active_pricing_companies;

-- تمكين Row Level Security على العرض
ALTER VIEW public.dashboard_stats SET (security_barrier = true);

-- إضافة سياسة أمان للعرض - فقط الإداريون يمكنهم الوصول
CREATE POLICY "Admin only access dashboard_stats" 
ON public.dashboard_stats 
FOR SELECT 
USING (get_current_admin_id() IS NOT NULL);

-- تمكين RLS على العرض
ALTER VIEW public.dashboard_stats ENABLE ROW LEVEL SECURITY;
