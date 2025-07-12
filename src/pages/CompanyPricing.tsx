import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TripPrice {
  id: string;
  from_city: string;
  to_city: string;
  vehicle_type: string;
  price: number;
}

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
}

const vehicleTypes = [
  "شاحنة صغيرة",
  "شاحنة متوسطة", 
  "شاحنة كبيرة",
  "مقطورة",
  "رافعة شوكية",
  "نقل ثقيل"
];

const cities = [
  "الرياض", "جدة", "الدمام", "الطائف", "المدينة المنورة", "مكة المكرمة",
  "أبها", "تبوك", "بريدة", "خميس مشيط", "حائل", "الجبيل", "ينبع",
  "الأحساء", "نجران", "الباحة", "عرعر", "سكاكا", "جازان", "القصيم"
];

export default function CompanyPricing() {
  const { membershipNumber } = useParams();
  const [company, setCompany] = useState<CompanyPricing | null>(null);
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    from_city: "",
    to_city: "",
    vehicle_type: "",
    price: ""
  });
  const [editingPrices, setEditingPrices] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (membershipNumber) {
      fetchCompanyData();
    }
  }, [membershipNumber]);

  const fetchCompanyData = async () => {
    try {
      // Fetch company info
      const { data: companyData, error: companyError } = await supabase
        .from('companies_pricing')
        .select('*')
        .eq('membership_number', membershipNumber)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch trip prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('trip_pricing')
        .select('*')
        .eq('company_pricing_id', companyData.id)
        .order('from_city');

      if (pricesError) throw pricesError;
      setTripPrices(pricesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!company) {
        // If company is not found, don't show generic error
        setCompany(null);
      } else {
        toast.error('عذراً، لا يوجد لديك صلاحيات للوصول لهذه البيانات. تواصل مع الدعم الفني');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTripPrice = async () => {
    if (!newTrip.from_city || !newTrip.to_city || !newTrip.vehicle_type || !newTrip.price) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (newTrip.from_city === newTrip.to_city) {
      toast.error('مدينة المغادرة والوصول لا يمكن أن تكون نفسها');
      return;
    }

    if (!company?.is_editing_enabled) {
      toast.error('التحرير غير مفعل لهذه الشركة');
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .insert({
          company_pricing_id: company.id,
          from_city: newTrip.from_city,
          to_city: newTrip.to_city,
          vehicle_type: newTrip.vehicle_type,
          price: parseFloat(newTrip.price)
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('هذه الرحلة موجودة بالفعل');
        } else {
          throw error;
        }
        return;
      }

      toast.success('تم إضافة الرحلة بنجاح');
      setNewTrip({ from_city: "", to_city: "", vehicle_type: "", price: "" });
      fetchCompanyData();
    } catch (error) {
      console.error('Error adding trip:', error);
      toast.error('خطأ في إضافة الرحلة');
    }
  };

  const updateTripPrice = async (tripId: string, newPrice: string) => {
    if (!company?.is_editing_enabled) {
      toast.error('التحرير غير مفعل لهذه الشركة');
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .update({ price: parseFloat(newPrice) })
        .eq('id', tripId);

      if (error) throw error;

      toast.success('تم تحديث السعر بنجاح');
      setEditingPrices(prev => {
        const updated = { ...prev };
        delete updated[tripId];
        return updated;
      });
      fetchCompanyData();
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('خطأ في تحديث السعر');
    }
  };

  const deleteTripPrice = async (tripId: string) => {
    if (!company?.is_editing_enabled) {
      toast.error('التحرير غير مفعل لهذه الشركة');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      toast.success('تم حذف الرحلة بنجاح');
      fetchCompanyData();
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('خطأ في حذف الرحلة');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <img 
            src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
            alt="Mile Truck Logo" 
            className="h-12 w-auto mr-4"
          />
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              عذراً، لا يوجد لديك صلاحيات للوصول لهذه الصفحة
            </p>
            <p className="text-muted-foreground">
              تواصل مع الدعم الفني للحصول على المساعدة
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-6">
        <img 
          src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
          alt="Mile Truck Logo" 
          className="h-12 w-auto mr-4"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          قائمة أسعار الشحن لـ {company.company_name}
        </h1>
        <div className="flex justify-center gap-4 mb-4">
          <Badge variant="secondary">رقم العضوية: {company.membership_number}</Badge>
          {company.insurance_type && (
            <Badge variant="outline">{company.insurance_type}</Badge>
          )}
          <Badge variant={company.is_editing_enabled ? "default" : "destructive"}>
            {company.is_editing_enabled ? "التحرير مفعل" : "التحرير معطل"}
          </Badge>
        </div>
      </div>

      {company.is_editing_enabled && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة رحلة جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="from_city">من مدينة</Label>
                <Select
                  value={newTrip.from_city}
                  onValueChange={(value) => setNewTrip(prev => ({ ...prev, from_city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to_city">إلى مدينة</Label>
                <Select
                  value={newTrip.to_city}
                  onValueChange={(value) => setNewTrip(prev => ({ ...prev, to_city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicle_type">نوع الشاحنة</Label>
                <Select
                  value={newTrip.vehicle_type}
                  onValueChange={(value) => setNewTrip(prev => ({ ...prev, vehicle_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الشاحنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">السعر (ريال)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTrip.price}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="أدخل السعر"
                />
              </div>
            </div>
            <Button onClick={addTripPrice} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              إضافة رحلة
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة أسعار الرحلات</CardTitle>
        </CardHeader>
        <CardContent>
          {tripPrices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد رحلات مضافة حتى الآن</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">من</th>
                    <th className="text-right p-3">إلى</th>
                    <th className="text-right p-3">نوع الشاحنة</th>
                    <th className="text-right p-3">السعر (ريال)</th>
                    {company.is_editing_enabled && (
                      <th className="text-right p-3">الإجراءات</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tripPrices.map((trip) => (
                    <tr key={trip.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{trip.from_city}</td>
                      <td className="p-3">{trip.to_city}</td>
                      <td className="p-3">{trip.vehicle_type}</td>
                      <td className="p-3">
                        {editingPrices[trip.id] !== undefined ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={editingPrices[trip.id]}
                              onChange={(e) => setEditingPrices(prev => ({
                                ...prev,
                                [trip.id]: e.target.value
                              }))}
                              className="w-24"
                            />
                            <Button
                              size="sm"
                              onClick={() => updateTripPrice(trip.id, editingPrices[trip.id])}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={company.is_editing_enabled ? "cursor-pointer hover:bg-muted p-1 rounded" : ""}
                            onClick={() => {
                              if (company.is_editing_enabled) {
                                setEditingPrices(prev => ({
                                  ...prev,
                                  [trip.id]: trip.price.toString()
                                }));
                              }
                            }}
                          >
                            {trip.price.toLocaleString()}
                          </span>
                        )}
                      </td>
                      {company.is_editing_enabled && (
                        <td className="p-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTripPrice(trip.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}