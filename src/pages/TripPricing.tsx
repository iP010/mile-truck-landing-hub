
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CompanySelector } from "@/components/trip-pricing/CompanySelector";
import { TripForm } from "@/components/trip-pricing/TripForm";
import { TripTable } from "@/components/trip-pricing/TripTable";

interface Company {
  id: string;
  company_name: string;
  membership_number: string;
}

interface TripPrice {
  id: string;
  from_city: string;
  to_city: string;
  vehicle_type: string;
  price: number;
  trip_type: string;
}

export default function TripPricing() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchTripPrices();
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies_pricing')
        .select('id, company_name, membership_number')
        .eq('is_editing_enabled', true)
        .order('company_name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('خطأ في تحميل الشركات');
    } finally {
      setLoading(false);
    }
  };

  const fetchTripPrices = async () => {
    if (!selectedCompany) return;

    try {
      const { data, error } = await supabase
        .from('trip_pricing')
        .select('*')
        .eq('company_pricing_id', selectedCompany)
        .order('from_city');

      if (error) throw error;
      setTripPrices(data || []);
    } catch (error) {
      console.error('Error fetching trip prices:', error);
      toast.error('خطأ في تحميل أسعار الرحلات');
    }
  };

  const filteredTripPrices = tripPrices.filter(trip =>
    trip.from_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.to_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <PricingSidebar />
          <SidebarInset>
            <div className="flex justify-center items-center h-64">جاري التحميل...</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PricingSidebar />
        <SidebarInset>
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                alt="Mile Truck Logo" 
                className="h-12 w-auto mr-4"
              />
              <h1 className="text-3xl font-bold">أسعار الرحلات</h1>
            </div>

            <CompanySelector 
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
            />

            {selectedCompany && (
              <>
                <TripForm 
                  selectedCompany={selectedCompany}
                  onTripAdded={fetchTripPrices}
                />

                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في أسعار الرحلات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <TripTable 
                  tripPrices={filteredTripPrices}
                  onTripDeleted={fetchTripPrices}
                />
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
