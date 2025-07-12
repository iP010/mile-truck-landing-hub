-- Fix RLS policies for trip_pricing table
DROP POLICY IF EXISTS "Admin full access trip_pricing" ON public.trip_pricing;
DROP POLICY IF EXISTS "Public read trip_pricing when editing enabled" ON public.trip_pricing;

-- Create new policies that work properly
CREATE POLICY "Admin full access trip_pricing" 
ON public.trip_pricing 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Public read trip_pricing when editing enabled" 
ON public.trip_pricing 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM companies_pricing 
  WHERE companies_pricing.id = trip_pricing.company_pricing_id 
    AND companies_pricing.is_editing_enabled = true
));