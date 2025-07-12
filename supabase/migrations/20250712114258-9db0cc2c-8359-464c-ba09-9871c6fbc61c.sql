
-- Create cities table
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle_types table
CREATE TABLE public.vehicle_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin full access cities" 
ON public.cities 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

CREATE POLICY "Admin full access vehicle_types" 
ON public.vehicle_types 
FOR ALL 
USING (get_current_admin_id() IS NOT NULL)
WITH CHECK (get_current_admin_id() IS NOT NULL);

-- Create policies for public read access
CREATE POLICY "Public read cities" 
ON public.cities 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public read vehicle_types" 
ON public.vehicle_types 
FOR SELECT 
USING (is_active = true);

-- Insert existing cities data
INSERT INTO public.cities (name, display_order) VALUES
  ('الرياض', 1),
  ('جدة', 2),
  ('الدمام', 3),
  ('الطائف', 4),
  ('المدينة المنورة', 5),
  ('مكة المكرمة', 6),
  ('أبها', 7),
  ('تبوك', 8),
  ('بريدة', 9),
  ('خميس مشيط', 10),
  ('حائل', 11),
  ('الجبيل', 12),
  ('ينبع', 13),
  ('الأحساء', 14),
  ('نجران', 15),
  ('الباحة', 16),
  ('عرعر', 17),
  ('سكاكا', 18),
  ('جازان', 19),
  ('القصيم', 20);

-- Insert existing vehicle types data
INSERT INTO public.vehicle_types (name, display_order) VALUES
  ('شاحنة صغيرة', 1),
  ('شاحنة متوسطة', 2),
  ('شاحنة كبيرة', 3),
  ('مقطورة', 4),
  ('رافعة شوكية', 5),
  ('نقل ثقيل', 6);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_types_updated_at
BEFORE UPDATE ON public.vehicle_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
