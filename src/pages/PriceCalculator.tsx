import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Truck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function PriceCalculator() {
  const { language } = useLanguage();
  const supabase = getSupabaseClient();
  
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("2.18");
  const [fuelConsumption, setFuelConsumption] = useState("35");
  const [brokerCommission, setBrokerCommission] = useState("15");
  const [otherExpenses, setOtherExpenses] = useState("100");
  
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  // Fetch cities
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      console.log('Fetching cities for price calculator');
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
      return data;
    }
  });

  // Fetch vehicle types
  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicle_types'],
    queryFn: async () => {
      console.log('Fetching vehicle types for price calculator');
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching vehicle types:', error);
        throw error;
      }
      return data;
    }
  });

  const calculatePrice = () => {
    if (!fromCity || !toCity || !vehicleType || !distance) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const distanceNum = parseFloat(distance);
    const fuelPriceNum = parseFloat(fuelPrice);
    const fuelConsumptionNum = parseFloat(fuelConsumption);
    const brokerCommissionNum = parseFloat(brokerCommission);
    const otherExpensesNum = parseFloat(otherExpenses);

    // حساب تكلفة الوقود
    const fuelCost = (distanceNum / 100) * fuelConsumptionNum * fuelPriceNum;
    
    // حساب عمولة الوسيط
    const brokerFee = (fuelCost + otherExpensesNum) * (brokerCommissionNum / 100);
    
    // إجمالي السعر
    const totalPrice = fuelCost + otherExpensesNum + brokerFee;

    const breakdown = {
      fuelCost: fuelCost,
      otherExpenses: otherExpensesNum,
      brokerFee: brokerFee,
      totalPrice: totalPrice
    };

    setCalculatedPrice(totalPrice);
    setPriceBreakdown(breakdown);
    toast.success('تم حساب السعر بنجاح');
  };

  const resetForm = () => {
    setFromCity("");
    setToCity("");
    setVehicleType("");
    setDistance("");
    setCalculatedPrice(null);
    setPriceBreakdown(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-6">
        <img 
          src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
          alt="Mile Truck Logo" 
          className="h-12 w-auto mr-4"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          حاسبة أسعار الشحن
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>بيانات الرحلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromCity">من مدينة</Label>
                <Select value={fromCity} onValueChange={setFromCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toCity">إلى مدينة</Label>
                <Select value={toCity} onValueChange={setToCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">نوع الشاحنة</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الشاحنة" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">المسافة (كم)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="أدخل المسافة بالكيلومتر"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelPrice">سعر الوقود (ريال/لتر)</Label>
                <Input
                  id="fuelPrice"
                  type="number"
                  step="0.01"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelConsumption">استهلاك الوقود (لتر/100كم)</Label>
                <Input
                  id="fuelConsumption"
                  type="number"
                  value={fuelConsumption}
                  onChange={(e) => setFuelConsumption(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brokerCommission">عمولة الوسيط (%)</Label>
                <Input
                  id="brokerCommission"
                  type="number"
                  value={brokerCommission}
                  onChange={(e) => setBrokerCommission(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherExpenses">مصاريف أخرى (ريال)</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={calculatePrice} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                احسب السعر
              </Button>
              <Button variant="outline" onClick={resetForm}>
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>نتائج الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            {calculatedPrice !== null && priceBreakdown ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-center">
                    <p className="text-sm text-green-600 mb-1">إجمالي سعر الشحن</p>
                    <p className="text-3xl font-bold text-green-700">
                      {calculatedPrice.toFixed(2)} ريال
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">تفاصيل التكلفة:</h3>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>تكلفة الوقود</span>
                    <span className="font-semibold">{priceBreakdown.fuelCost.toFixed(2)} ريال</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>مصاريف أخرى</span>
                    <span className="font-semibold">{priceBreakdown.otherExpenses.toFixed(2)} ريال</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>عمولة الوسيط</span>
                    <span className="font-semibold">{priceBreakdown.brokerFee.toFixed(2)} ريال</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="font-semibold">الإجمالي</span>
                    <span className="font-bold text-blue-700">{priceBreakdown.totalPrice.toFixed(2)} ريال</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><MapPin className="inline w-4 h-4 mr-1" />من: {fromCity}</p>
                  <p><MapPin className="inline w-4 h-4 mr-1" />إلى: {toCity}</p>
                  <p><Truck className="inline w-4 h-4 mr-1" />نوع الشاحنة: {vehicleType}</p>
                  <p>المسافة: {distance} كم</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>املأ البيانات المطلوبة لحساب السعر</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملاحظات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • الأسعار المحسوبة تقديرية وقد تختلف حسب ظروف السوق
          </p>
          <p className="text-sm text-muted-foreground">
            • يمكنك تعديل القيم الافتراضية حسب احتياجاتك
          </p>
          <p className="text-sm text-muted-foreground">
            • عمولة الوسيط محسوبة كنسبة مئوية من إجمالي التكاليف
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
