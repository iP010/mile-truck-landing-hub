-- Fix RLS policies for driver and company registration
-- Drop existing problematic policies and recreate them

-- Fix company registration policies
DROP POLICY IF EXISTS "Public can register company" ON public.companies;
CREATE POLICY "Public can register company" 
ON public.companies 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.company_registration_settings WHERE is_enabled = true)
);

-- Fix driver registration policies
DROP POLICY IF EXISTS "Public can register as driver when enabled" ON public.drivers;
CREATE POLICY "Public can register as driver when enabled" 
ON public.drivers 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.driver_registration_settings WHERE is_enabled = true)
);

-- Ensure both registration settings are enabled by default
INSERT INTO public.company_registration_settings (is_enabled) 
SELECT true WHERE NOT EXISTS (SELECT 1 FROM public.company_registration_settings);

INSERT INTO public.driver_registration_settings (is_enabled) 
SELECT true WHERE NOT EXISTS (SELECT 1 FROM public.driver_registration_settings);