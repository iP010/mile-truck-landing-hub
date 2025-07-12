-- Create companies_pricing table for pricing management
CREATE TABLE public.companies_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  membership_number TEXT NOT NULL UNIQUE,
  insurance_type TEXT,
  is_editing_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip_pricing table for trip prices
CREATE TABLE public.trip_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_pricing_id UUID NOT NULL REFERENCES public.companies_pricing(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_pricing_id, from_city, to_city, vehicle_type)
);

-- Enable RLS
ALTER TABLE public.companies_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin full access companies_pricing" 
ON public.companies_pricing 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Admin full access trip_pricing" 
ON public.trip_pricing 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

-- Create policy for public access to trip pricing when editing is enabled
CREATE POLICY "Public read trip_pricing when editing enabled" 
ON public.trip_pricing 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.companies_pricing 
    WHERE id = trip_pricing.company_pricing_id 
    AND is_editing_enabled = true
  )
);

CREATE POLICY "Public read companies_pricing when editing enabled" 
ON public.companies_pricing 
FOR SELECT 
USING (is_editing_enabled = true);

-- Create function to generate membership numbers starting from 10001
CREATE OR REPLACE FUNCTION public.generate_membership_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  membership_num TEXT;
BEGIN
  -- Get the highest membership number and increment
  SELECT COALESCE(MAX(CAST(membership_number AS INTEGER)), 10000) + 1
  INTO next_number
  FROM public.companies_pricing
  WHERE membership_number ~ '^[0-9]+$';
  
  membership_num := next_number::TEXT;
  
  -- Check if this number already exists (safety check)
  WHILE EXISTS (SELECT 1 FROM public.companies_pricing WHERE membership_number = membership_num) LOOP
    next_number := next_number + 1;
    membership_num := next_number::TEXT;
  END LOOP;
  
  RETURN membership_num;
END;
$$;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_pricing_updated_at
BEFORE UPDATE ON public.companies_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_pricing_updated_at
BEFORE UPDATE ON public.trip_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();