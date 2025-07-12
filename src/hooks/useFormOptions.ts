
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../integrations/supabase/client';

interface FormOptions {
  nationalities: string[];
  truckBrands: string[];
  truckTypes: string[];
  driverInsuranceTypes: string[];
  companyInsuranceTypes: string[];
  cities: string[];
  vehicleTypes: string[];
  loading: boolean;
  error: string | null;
}

export const useFormOptions = (): FormOptions => {
  const supabase = getSupabaseClient();
  const [options, setOptions] = useState<FormOptions>({
    nationalities: [],
    truckBrands: [],
    truckTypes: [],
    driverInsuranceTypes: [],
    companyInsuranceTypes: [],
    cities: [],
    vehicleTypes: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptions(prev => ({ ...prev, loading: true, error: null }));

        // Fetch nationalities
        const { data: nationalities, error: nationalitiesError } = await supabase
          .from('driver_nationalities')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (nationalitiesError) throw nationalitiesError;

        // Fetch truck brands
        const { data: truckBrands, error: truckBrandsError } = await supabase
          .from('truck_brands')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (truckBrandsError) throw truckBrandsError;

        // Fetch truck types
        const { data: truckTypes, error: truckTypesError } = await supabase
          .from('truck_types')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (truckTypesError) throw truckTypesError;

        // Fetch driver insurance types
        const { data: driverInsurance, error: driverInsuranceError } = await supabase
          .from('insurance_types')
          .select('name')
          .eq('is_active', true)
          .eq('type', 'driver')
          .order('display_order', { ascending: true });

        if (driverInsuranceError) throw driverInsuranceError;

        // Fetch company insurance types
        const { data: companyInsurance, error: companyInsuranceError } = await supabase
          .from('insurance_types')
          .select('name')
          .eq('is_active', true)
          .eq('type', 'company')
          .order('display_order', { ascending: true });

        if (companyInsuranceError) throw companyInsuranceError;

        // Fetch cities
        const { data: cities, error: citiesError } = await supabase
          .from('cities')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (citiesError) throw citiesError;

        // Fetch vehicle types
        const { data: vehicleTypes, error: vehicleTypesError } = await supabase
          .from('vehicle_types')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (vehicleTypesError) throw vehicleTypesError;

        setOptions({
          nationalities: nationalities?.map(item => item.name) || [],
          truckBrands: truckBrands?.map(item => item.name) || [],
          truckTypes: truckTypes?.map(item => item.name) || [],
          driverInsuranceTypes: driverInsurance?.map(item => item.name) || [],
          companyInsuranceTypes: companyInsurance?.map(item => item.name) || [],
          cities: cities?.map(item => item.name) || [],
          vehicleTypes: vehicleTypes?.map(item => item.name) || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching form options:', error);
        setOptions(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load form options',
        }));
      }
    };

    fetchOptions();
  }, [supabase]);

  return options;
};
