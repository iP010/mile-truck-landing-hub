-- Fix database structure and add missing insurance types for companies
-- First, check and fix insurance types for companies
INSERT INTO public.insurance_types (name, type, is_active, display_order) 
VALUES 
  ('شامل مع البضاعة', 'company', true, 1),
  ('شامل', 'company', true, 2),
  ('ضد الغير', 'company', true, 3)
ON CONFLICT DO NOTHING;

-- Ensure we have the dashboard_stats view working properly
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.drivers) as total_drivers,
  (SELECT COUNT(*) FROM public.companies) as total_companies,
  (SELECT COUNT(*) FROM public.companies_pricing) as total_pricing_companies,
  (SELECT COUNT(*) FROM public.trip_pricing) as total_trip_prices,
  (SELECT COUNT(*) FROM public.drivers WHERE has_insurance = true) as drivers_with_insurance,
  (SELECT COUNT(*) FROM public.companies WHERE has_insurance = true) as companies_with_insurance,
  (SELECT COUNT(*) FROM public.companies_pricing WHERE is_editing_enabled = true) as active_pricing_companies;