-- Add trip_type column to trip_pricing table
ALTER TABLE public.trip_pricing 
ADD COLUMN trip_type text NOT NULL DEFAULT 'between_cities';

-- Add check constraint for trip_type values
ALTER TABLE public.trip_pricing 
ADD CONSTRAINT trip_type_check 
CHECK (trip_type IN ('between_cities', 'within_city'));

-- Update existing rows to have the default value
UPDATE public.trip_pricing 
SET trip_type = 'between_cities' 
WHERE trip_type IS NULL;