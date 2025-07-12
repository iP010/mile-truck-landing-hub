
-- Add policies to allow public users to insert, update, and delete trip_pricing when editing is enabled
CREATE POLICY "Public insert trip_pricing when editing enabled" 
ON public.trip_pricing 
FOR INSERT 
TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1 
  FROM companies_pricing 
  WHERE companies_pricing.id = trip_pricing.company_pricing_id 
    AND companies_pricing.is_editing_enabled = true
));

CREATE POLICY "Public update trip_pricing when editing enabled" 
ON public.trip_pricing 
FOR UPDATE 
TO anon, authenticated
USING (EXISTS (
  SELECT 1 
  FROM companies_pricing 
  WHERE companies_pricing.id = trip_pricing.company_pricing_id 
    AND companies_pricing.is_editing_enabled = true
))
WITH CHECK (EXISTS (
  SELECT 1 
  FROM companies_pricing 
  WHERE companies_pricing.id = trip_pricing.company_pricing_id 
    AND companies_pricing.is_editing_enabled = true
));

CREATE POLICY "Public delete trip_pricing when editing enabled" 
ON public.trip_pricing 
FOR DELETE 
TO anon, authenticated
USING (EXISTS (
  SELECT 1 
  FROM companies_pricing 
  WHERE companies_pricing.id = trip_pricing.company_pricing_id 
    AND companies_pricing.is_editing_enabled = true
));
