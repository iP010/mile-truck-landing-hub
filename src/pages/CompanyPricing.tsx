
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyHeader } from "@/components/company-pricing/CompanyHeader";
import { CompanyTripForm } from "@/components/company-pricing/CompanyTripForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Edit, X } from "lucide-react";

interface TripPrice {
  id: string;
  from_city: string;
  to_city: string;
  vehicle_type: string;
  price: number;
  trip_type: string;
}

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
}

export default function CompanyPricing() {
  const { membershipNumber } = useParams();
  const [company, setCompany] = useState<CompanyPricing | null>(null);
  const [tripPrices, setTripPrices] = useState<TripPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const [editingTripData, setEditingTripData] = useState<{
    trip_type: string;
    from_city: string;
    to_city: string;
    vehicle_type: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    if (membershipNumber) {
      fetchCompanyData();
    }
  }, [membershipNumber]);

  const fetchCompanyData = async () => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies_pricing')
        .select('*')
        .eq('membership_number', membershipNumber)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

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
        setCompany(null);
      } else {
        toast.error('عذراً، لا يوجد لديك صلاحيات للوصول لهذه البيانات. تواصل مع الدعم الفني');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const startEditingTrip = (trip: TripPrice) => {
    setEditingTrip(trip.id);
    setEditingTripData({
      trip_type: trip.trip_type,
      from_city: trip.from_city,
      to_city: trip.to_city,
      vehicle_type: trip.vehicle_type,
      price: trip.price.toString()
    });
  };

  const cancelEditingTrip = () => {
    setEditingTrip(null);
    setEditingTripData(null);
  };

  const saveEditedTrip = async () => {
    if (!editingTripData || !editingTrip) return;

    if (!editingTripData.vehicle_type || !editingTripData.price) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (editingTripData.trip_type === 'between_cities') {
      if (!editingTripData.from_city || !editingTripData.to_city) {
        toast.error('يجب اختيار مدينة المغادرة والوصول للرحلات بين المدن');
        return;
      }
      if (editingTripData.from_city === editingTripData.to_city) {
        toast.error('مدينة المغادرة والوصول لا يمكن أن تكون نفسها');
        return;
      }
    } else if (editingTripData.trip_type === 'within_city') {
      if (!editingTripData.from_city) {
        toast.error('يجب اختيار المدينة للرحلات الداخلية');
        return;
      }
    }

    if (!company?.is_editing_enabled) {
      toast.error('التحرير غير مفعل لهذه الشركة');
      return;
    }

    try {
      const updatedTripData = {
        trip_type: editingTripData.trip_type,
        from_city: editingTripData.from_city,
        to_city: editingTripData.trip_type === 'within_city' ? editingTripData.from_city : editingTripData.to_city,
        vehicle_type: editingTripData.vehicle_type,
        price: parseFloat(editingTripData.price)
      };

      const { error } = await supabase
        .from('trip_pricing')
        .update(updatedTripData)
        .eq('id', editingTrip);

      if (error) throw error;

      toast.success('تم تحديث الرحلة بنجاح');
      setEditingTrip(null);
      setEditingTripData(null);
      fetchCompanyData();
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('خطأ في تحديث الرحلة');
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
      
      <CompanyHeader company={company} />
      
      <CompanyTripForm 
        companyId={company.id}
        isEditingEnabled={company.is_editing_enabled}
        onTripAdded={fetchCompanyData}
      />

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
                    <th className="text-right p-3">نوع الرحلة</th>
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
                      <td className="p-3">
                        {editingTrip === trip.id ? (
                          <Select
                            value={editingTripData?.trip_type}
                            onValueChange={(value) => 
                              setEditingTripData(prev => prev ? {
                                ...prev,
                                trip_type: value,
                                to_city: value === 'within_city' ? prev.from_city : prev.to_city
                              } : null)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="between_cities">بين المدن</SelectItem>
                              <SelectItem value="within_city">داخل المدينة</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={trip.trip_type === 'within_city' ? 'secondary' : 'default'}>
                            {trip.trip_type === 'within_city' ? 'داخل المدينة' : 'بين المدن'}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {editingTrip === trip.id ? (
                          <Select
                            value={editingTripData?.from_city}
                            onValueChange={(value) => 
                              setEditingTripData(prev => prev ? {
                                ...prev,
                                from_city: value,
                                to_city: prev.trip_type === 'within_city' ? value : prev.to_city
                              } : null)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          trip.from_city
                        )}
                      </td>
                      <td className="p-3">
                        {editingTrip === trip.id ? (
                          editingTripData?.trip_type === 'within_city' ? (
                            <Input
                              value={editingTripData.from_city}
                              readOnly
                              className="bg-muted w-32"
                            />
                          ) : (
                            <Select
                              value={editingTripData?.to_city}
                              onValueChange={(value) => 
                                setEditingTripData(prev => prev ? { ...prev, to_city: value } : null)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map(city => (
                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )
                        ) : (
                          trip.trip_type === 'within_city' ? 'داخل المدينة' : trip.to_city
                        )}
                      </td>
                      <td className="p-3">
                        {editingTrip === trip.id ? (
                          <Select
                            value={editingTripData?.vehicle_type}
                            onValueChange={(value) => 
                              setEditingTripData(prev => prev ? { ...prev, vehicle_type: value } : null)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicleTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          trip.vehicle_type
                        )}
                      </td>
                      <td className="p-3">
                        {editingTrip === trip.id ? (
                          <Input
                            type="number"
                            value={editingTripData?.price}
                            onChange={(e) => 
                              setEditingTripData(prev => prev ? { ...prev, price: e.target.value } : null)
                            }
                            className="w-24"
                          />
                        ) : (
                          trip.price.toLocaleString()
                        )}
                      </td>
                      {company.is_editing_enabled && (
                        <td className="p-3">
                          <div className="flex gap-2">
                            {editingTrip === trip.id ? (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={saveEditedTrip}
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditingTrip}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditingTrip(trip)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteTripPrice(trip.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
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
