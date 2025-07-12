
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

        console.log('Starting to fetch form options...');

        // Fetch nationalities
        const { data: nationalities, error: nationalitiesError } = await supabase
          .from('driver_nationalities')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true, nullsFirst: true });

        if (nationalitiesError) {
          console.error('Error fetching nationalities:', nationalitiesError);
          throw nationalitiesError;
        }
        console.log('Fetched nationalities:', nationalities?.length);

        // Fetch truck brands
        const { data: truckBrands, error: truckBrandsError } = await supabase
          .from('truck_brands')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true, nullsFirst: true });

        if (truckBrandsError) {
          console.error('Error fetching truck brands:', truckBrandsError);
          throw truckBrandsError;
        }
        console.log('Fetched truck brands:', truckBrands?.length);

        // Fetch truck types
        const { data: truckTypes, error: truckTypesError } = await supabase
          .from('truck_types')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true, nullsFirst: true });

        if (truckTypesError) {
          console.error('Error fetching truck types:', truckTypesError);
          throw truckTypesError;
        }
        console.log('Fetched truck types:', truckTypes?.length);

        // Fetch driver insurance types
        const { data: driverInsurance, error: driverInsuranceError } = await supabase
          .from('insurance_types')
          .select('name')
          .eq('is_active', true)
          .eq('type', 'driver')
          .order('display_order', { ascending: true, nullsFirst: true });

        if (driverInsuranceError) {
          console.error('Error fetching driver insurance:', driverInsuranceError);
          throw driverInsuranceError;
        }
        console.log('Fetched driver insurance types:', driverInsurance?.length);

        // Fetch company insurance types
        const { data: companyInsurance, error: companyInsuranceError } = await supabase
          .from('insurance_types')
          .select('name')
          .eq('is_active', true)
          .eq('type', 'company')
          .order('display_order', { ascending: true, nullsFirst: true });

        if (companyInsuranceError) {
          console.error('Error fetching company insurance:', companyInsuranceError);
          throw companyInsuranceError;
        }
        console.log('Fetched company insurance types:', companyInsurance?.length);

        // Fetch cities
        const { data: cities, error: citiesError } = await supabase
          .from('cities')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true, nullsFirst: true });

        if (citiesError) {
          console.error('Error fetching cities:', citiesError);
          throw citiesError;
        }
        console.log('Fetched cities:', cities?.length);

        // Fetch vehicle types
        const { data: vehicleTypes, error: vehicleTypesError } = await supabase
          .from('vehicle_types')
          .select('name')
          .eq('is_active', true)
          .order('display_order', { ascending: true, nullsFirst: true });

        if (vehicleTypesError) {
          console.error('Error fetching vehicle types:', vehicleTypesError);
          throw vehicleTypesError;
        }
        console.log('Fetched vehicle types:', vehicleTypes?.length);

        console.log('All data fetched successfully');

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
