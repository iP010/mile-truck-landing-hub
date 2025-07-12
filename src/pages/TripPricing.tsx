
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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

interface City {
  id: string;
  name: string;
}

interface VehicleType {
  id: string;
  name: string;
}

export default function TripPricing() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [newTrip, setNewTrip] = useState({
    from_city: "",
    to_city: "",
    vehicle_type: "",
    price: "",
    trip_type: "between_cities"
  });

  useEffect(() => {
    Promise.all([
      fetchCompanies(),
      fetchCities(),
      fetchVehicleTypes()
    ]).finally(() => setLoading(false));
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
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('خطأ في تحميل المدن');
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVehicleTypes(data || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      toast.error('خطأ في تحميل أنواع المركبات');
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

  const addTripPrice = async () => {
    if (!selectedCompany || !newTrip.from_city || !newTrip.to_city || !newTrip.vehicle_type || !newTrip.price) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .insert({
          company_pricing_id: selectedCompany,
          from_city: newTrip.from_city,
          to_city: newTrip.to_city,
          vehicle_type: newTrip.vehicle_type,
          price: parseFloat(newTrip.price),
          trip_type: newTrip.trip_type
        });

      if (error) throw error;

      toast.success('تم إضافة سعر الرحلة بنجاح');
      setNewTrip({
        from_city: "",
        to_city: "",
        vehicle_type: "",
        price: "",
        trip_type: "between_cities"
      });
      fetchTripPrices();
    } catch (error) {
      console.error('Error adding trip price:', error);
      toast.error('خطأ في إضافة سعر الرحلة');
    }
  };

  const deleteTripPrice = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السعر؟')) return;

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف سعر الرحلة بنجاح');
      fetchTripPrices();
    } catch (error) {
      console.error('Error deleting trip price:', error);
      toast.error('خطأ في حذف سعر الرحلة');
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

            {/* Company Selection */}
            <Card>
              <CardHeader>
                <CardTitle>اختيار الشركة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>الشركة</Label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر شركة..." />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.company_name} - {company.membership_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedCompany && (
              <>
                {/* Add New Trip Price */}
                <Card>
                  <CardHeader>
                    <CardTitle>إضافة سعر رحلة جديد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <Label>من المدينة</Label>
                        <Select value={newTrip.from_city} onValueChange={(value) => setNewTrip(prev => ({ ...prev, from_city: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة..." />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>إلى المدينة</Label>
                        <Select value={newTrip.to_city} onValueChange={(value) => setNewTrip(prev => ({ ...prev, to_city: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة..." />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>نوع المركبة</Label>
                        <Select value={newTrip.vehicle_type} onValueChange={(value) => setNewTrip(prev => ({ ...prev, vehicle_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع..." />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>السعر (ريال)</Label>
                        <Input
                          type="number"
                          value={newTrip.price}
                          onChange={(e) => setNewTrip(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="أدخل السعر"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addTripPrice} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          إضافة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search */}
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

                {/* Trip Prices List */}
                <Card>
                  <CardHeader>
                    <CardTitle>أسعار الرحلات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredTripPrices.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">لا توجد أسعار رحلات</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-right p-3">من</th>
                              <th className="text-right p-3">إلى</th>
                              <th className="text-right p-3">نوع المركبة</th>
                              <th className="text-right p-3">السعر</th>
                              <th className="text-right p-3">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTripPrices.map((trip) => (
                              <tr key={trip.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{trip.from_city}</td>
                                <td className="p-3">{trip.to_city}</td>
                                <td className="p-3">
                                  <Badge variant="outline">{trip.vehicle_type}</Badge>
                                </td>
                                <td className="p-3 font-medium">{trip.price} ريال</td>
                                <td className="p-3">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteTripPrice(trip.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
