
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Route, Truck } from "lucide-react";
import { toast } from "sonner";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface CalculationResult {
  basePrice: number;
  fuelCost: number;
  insuranceCost: number;
  maintenanceCost: number;
  driverCost: number;
  totalCost: number;
  recommendedPrice: number;
}

export default function PriceCalculator() {
  const [calculation, setCalculation] = useState({
    from_city: "",
    to_city: "",
    vehicle_type: "",
    distance: "",
    fuel_price: "2.18",
    fuel_consumption: "25",
    driver_daily_wage: "200",
    insurance_percentage: "5",
    maintenance_percentage: "10",
    profit_margin: "20"
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const cities = ["الرياض", "جدة", "الدمام", "الطائف", "المدينة المنورة", "مكة المكرمة"];
  const vehicleTypes = ["شاحنة صغيرة", "شاحنة متوسطة", "شاحنة كبيرة", "مقطورة"];

  const cityDistances: { [key: string]: { [key: string]: number } } = {
    "الرياض": {
      "جدة": 950,
      "الدمام": 395,
      "الطائف": 750,
      "المدينة المنورة": 848,
      "مكة المكرمة": 870
    },
    "جدة": {
      "الرياض": 950,
      "الدمام": 1343,
      "الطائف": 167,
      "المدينة المنورة": 420,
      "مكة المكرمة": 79
    },
    "الدمام": {
      "الرياض": 395,
      "جدة": 1343,
      "الطائف": 1147,
      "المدينة المنورة": 1243,
      "مكة المكرمة": 1265
    }
  };

  const calculatePrice = () => {
    if (!calculation.from_city || !calculation.to_city || !calculation.vehicle_type) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    let distance = parseFloat(calculation.distance);
    
    // Auto-calculate distance if available
    if (!distance && cityDistances[calculation.from_city]?.[calculation.to_city]) {
      distance = cityDistances[calculation.from_city][calculation.to_city];
      setCalculation(prev => ({ ...prev, distance: distance.toString() }));
    }

    if (!distance) {
      toast.error('يرجى إدخال المسافة');
      return;
    }

    const fuelPrice = parseFloat(calculation.fuel_price);
    const fuelConsumption = parseFloat(calculation.fuel_consumption);
    const driverWage = parseFloat(calculation.driver_daily_wage);
    const insurancePercentage = parseFloat(calculation.insurance_percentage);
    const maintenancePercentage = parseFloat(calculation.maintenance_percentage);
    const profitMargin = parseFloat(calculation.profit_margin);

    // Calculate costs
    const fuelCost = (distance / 100) * fuelConsumption * fuelPrice;
    const driverCost = driverWage * Math.ceil(distance / 1000); // Assuming 1 day per 1000km
    const basePrice = fuelCost + driverCost;
    const insuranceCost = (basePrice * insurancePercentage) / 100;
    const maintenanceCost = (basePrice * maintenancePercentage) / 100;
    const totalCost = basePrice + insuranceCost + maintenanceCost;
    const recommendedPrice = totalCost + (totalCost * profitMargin) / 100;

    const calculationResult: CalculationResult = {
      basePrice,
      fuelCost,
      insuranceCost,
      maintenanceCost,
      driverCost,
      totalCost,
      recommendedPrice
    };

    setResult(calculationResult);
    toast.success('تم حساب السعر بنجاح');
  };

  const resetCalculation = () => {
    setCalculation({
      from_city: "",
      to_city: "",
      vehicle_type: "",
      distance: "",
      fuel_price: "2.18",
      fuel_consumption: "25",
      driver_daily_wage: "200",
      insurance_percentage: "5",
      maintenance_percentage: "10",
      profit_margin: "20"
    });
    setResult(null);
  };

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
              <h1 className="text-3xl font-bold">حاسبة أسعار الرحلات</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    بيانات الرحلة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>من المدينة</Label>
                      <Select 
                        value={calculation.from_city} 
                        onValueChange={(value) => {
                          setCalculation(prev => ({ ...prev, from_city: value }));
                          // Auto-update distance if both cities are selected
                          if (value && calculation.to_city && cityDistances[value]?.[calculation.to_city]) {
                            setCalculation(prev => ({ 
                              ...prev, 
                              distance: cityDistances[value][calculation.to_city].toString() 
                            }));
                          }
                        }}
                      >
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
                      <Select 
                        value={calculation.to_city} 
                        onValueChange={(value) => {
                          setCalculation(prev => ({ ...prev, to_city: value }));
                          // Auto-update distance if both cities are selected
                          if (calculation.from_city && value && cityDistances[calculation.from_city]?.[value]) {
                            setCalculation(prev => ({ 
                              ...prev, 
                              distance: cityDistances[calculation.from_city][value].toString() 
                            }));
                          }
                        }}
                      >
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نوع المركبة</Label>
                      <Select value={calculation.vehicle_type} onValueChange={(value) => setCalculation(prev => ({ ...prev, vehicle_type: value }))}>
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
                      <Label>المسافة (كم)</Label>
                      <Input
                        type="number"
                        value={calculation.distance}
                        onChange={(e) => setCalculation(prev => ({ ...prev, distance: e.target.value }))}
                        placeholder="أدخل المسافة"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>سعر الوقود (ريال/لتر)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={calculation.fuel_price}
                        onChange={(e) => setCalculation(prev => ({ ...prev, fuel_price: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label>استهلاك الوقود (لتر/100كم)</Label>
                      <Input
                        type="number"
                        value={calculation.fuel_consumption}
                        onChange={(e) => setCalculation(prev => ({ ...prev, fuel_consumption: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>راتب السائق اليومي (ريال)</Label>
                      <Input
                        type="number"
                        value={calculation.driver_daily_wage}
                        onChange={(e) => setCalculation(prev => ({ ...prev, driver_daily_wage: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label>نسبة التأمين (%)</Label>
                      <Input
                        type="number"
                        value={calculation.insurance_percentage}
                        onChange={(e) => setCalculation(prev => ({ ...prev, insurance_percentage: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نسبة الصيانة (%)</Label>
                      <Input
                        type="number"
                        value={calculation.maintenance_percentage}
                        onChange={(e) => setCalculation(prev => ({ ...prev, maintenance_percentage: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label>هامش الربح (%)</Label>
                      <Input
                        type="number"
                        value={calculation.profit_margin}
                        onChange={(e) => setCalculation(prev => ({ ...prev, profit_margin: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={calculatePrice} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      احسب السعر
                    </Button>
                    <Button variant="outline" onClick={resetCalculation}>
                      إعادة تعيين
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    نتائج الحساب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600">تكلفة الوقود</div>
                          <div className="text-lg font-bold text-blue-600">
                            {result.fuelCost.toFixed(0)} ريال
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">تكلفة السائق</div>
                          <div className="text-lg font-bold text-green-600">
                            {result.driverCost.toFixed(0)} ريال
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-sm text-gray-600">تكلفة التأمين</div>
                          <div className="text-lg font-bold text-orange-600">
                            {result.insuranceCost.toFixed(0)} ريال
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm text-gray-600">تكلفة الصيانة</div>
                          <div className="text-lg font-bold text-purple-600">
                            {result.maintenanceCost.toFixed(0)} ريال
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg mb-3">
                          <div className="text-sm text-gray-600">إجمالي التكلفة</div>
                          <div className="text-xl font-bold text-gray-800">
                            {result.totalCost.toFixed(0)} ريال
                          </div>
                        </div>

                        <div className="text-center p-4 bg-green-100 rounded-lg">
                          <div className="text-sm text-gray-600">السعر المقترح</div>
                          <div className="text-2xl font-bold text-green-700">
                            {result.recommendedPrice.toFixed(0)} ريال
                          </div>
                          <Badge variant="outline" className="mt-2">
                            شامل هامش الربح
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 text-center pt-2">
                        * الأسعار تقديرية وقد تختلف حسب الظروف الفعلية
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>أدخل بيانات الرحلة واضغط "احسب السعر" لعرض النتائج</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
