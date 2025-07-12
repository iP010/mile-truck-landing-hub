
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TripFormProps {
  selectedCompany: string;
  onTripAdded: () => void;
}

const cities = ["الرياض", "جدة", "الدمام", "الطائف", "المدينة المنورة", "مكة المكرمة"];
const vehicleTypes = ["شاحنة صغيرة", "شاحنة متوسطة", "شاحنة كبيرة", "مقطورة"];

export function TripForm({ selectedCompany, onTripAdded }: TripFormProps) {
  const [newTrip, setNewTrip] = useState({
    from_city: "",
    to_city: "",
    vehicle_type: "",
    price: "",
    trip_type: "between_cities"
  });

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
      onTripAdded();
    } catch (error) {
      console.error('Error adding trip price:', error);
      toast.error('خطأ في إضافة سعر الرحلة');
    }
  };

  return (
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
                  <SelectItem key={city} value={city}>{city}</SelectItem>
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
                  <SelectItem key={city} value={city}>{city}</SelectItem>
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
                  <SelectItem key={type} value={type}>{type}</SelectItem>
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
  );
}
