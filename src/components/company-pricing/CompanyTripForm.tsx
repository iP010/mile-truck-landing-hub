
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CompanyTripFormProps {
  companyId: string;
  isEditingEnabled: boolean;
  onTripAdded: () => void;
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

export function CompanyTripForm({ companyId, isEditingEnabled, onTripAdded }: CompanyTripFormProps) {
  const [newTrip, setNewTrip] = useState({
    trip_type: "between_cities",
    from_city: "",
    to_city: "",
    vehicle_type: "",
    price: ""
  });

  const addTripPrice = async () => {
    if (!newTrip.vehicle_type || !newTrip.price) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (newTrip.trip_type === 'between_cities') {
      if (!newTrip.from_city || !newTrip.to_city) {
        toast.error('يجب اختيار مدينة المغادرة والوصول للرحلات بين المدن');
        return;
      }
      if (newTrip.from_city === newTrip.to_city) {
        toast.error('مدينة المغادرة والوصول لا يمكن أن تكون نفسها');
        return;
      }
    } else if (newTrip.trip_type === 'within_city') {
      if (!newTrip.from_city) {
        toast.error('يجب اختيار المدينة للرحلات الداخلية');
        return;
      }
    }

    if (!isEditingEnabled) {
      toast.error('التحرير غير مفعل لهذه الشركة');
      return;
    }

    try {
      const tripData = {
        company_pricing_id: companyId,
        trip_type: newTrip.trip_type,
        from_city: newTrip.from_city,
        to_city: newTrip.trip_type === 'within_city' ? newTrip.from_city : newTrip.to_city,
        vehicle_type: newTrip.vehicle_type,
        price: parseFloat(newTrip.price)
      };

      const { error } = await supabase
        .from('trip_pricing')
        .insert(tripData);

      if (error) {
        if (error.code === '23505') {
          toast.error('هذه الرحلة موجودة بالفعل');
        } else {
          throw error;
        }
        return;
      }

      toast.success('تم إضافة الرحلة بنجاح');
      setNewTrip({ trip_type: "between_cities", from_city: "", to_city: "", vehicle_type: "", price: "" });
      onTripAdded();
    } catch (error) {
      console.error('Error adding trip:', error);
      toast.error('خطأ في إضافة الرحلة');
    }
  };

  if (!isEditingEnabled) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إضافة رحلة جديدة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="trip_type">نوع الرحلة</Label>
            <Select
              value={newTrip.trip_type}
              onValueChange={(value) => {
                setNewTrip(prev => ({ 
                  ...prev, 
                  trip_type: value,
                  to_city: value === 'within_city' ? prev.from_city : prev.to_city
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="between_cities">بين المدن</SelectItem>
                <SelectItem value="within_city">داخل المدينة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="from_city">
              {newTrip.trip_type === 'within_city' ? 'المدينة' : 'من مدينة'}
            </Label>
            <Select
              value={newTrip.from_city}
              onValueChange={(value) => setNewTrip(prev => ({ 
                ...prev, 
                from_city: value,
                to_city: newTrip.trip_type === 'within_city' ? value : prev.to_city
              }))}
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
            <Label htmlFor="to_city">
              {newTrip.trip_type === 'within_city' ? 'المدينة' : 'إلى مدينة'}
            </Label>
            {newTrip.trip_type === 'within_city' ? (
              <Input
                value={newTrip.from_city}
                readOnly
                className="bg-muted"
                placeholder="سيتم ملؤها تلقائياً"
              />
            ) : (
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
            )}
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
  );
}
