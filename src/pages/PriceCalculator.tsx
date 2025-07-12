
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface CalculationData {
  fromCity: string;
  toCity: string;
  distance: string;
  vehicleType: string;
  fuelPrice: string;
  fuelConsumption: string;
  tollFees: string;
  brokerCommission: string;
  insurancePercentage: string;
  profitMargin: string;
}

interface CalculationResult {
  fuelCost: number;
  tollFees: number;
  brokerCommission: number;
  insuranceCost: number;
  subtotal: number;
  profitAmount: number;
  totalPrice: number;
}

export default function PriceCalculator() {
  const [calculation, setCalculation] = useState<CalculationData>({
    fromCity: "",
    toCity: "",
    distance: "",
    vehicleType: "",
    fuelPrice: "2.18",
    fuelConsumption: "25",
    tollFees: "0",
    brokerCommission: "500",
    insurancePercentage: "3",
    profitMargin: "15"
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  const cities = ["الرياض", "جدة", "الدمام", "الطائف", "المدينة المنورة", "مكة المكرمة"];
  const vehicleTypes = ["شاحنة صغيرة", "شاحنة متوسطة", "شاحنة كبيرة", "مقطورة"];

  useEffect(() => {
    // Load saved calculations from localStorage
    const saved = localStorage.getItem('savedCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }

    // Load default settings
    const settings = localStorage.getItem('pricingSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setCalculation(prev => ({
        ...prev,
        fuelPrice: parsed.defaultFuelPrice || "2.18",
        fuelConsumption: parsed.defaultFuelConsumption || "25",
        brokerCommission: parsed.defaultBrokerCommission || "500",
        insurancePercentage: parsed.defaultInsurancePercentage || "3",
        profitMargin: parsed.defaultProfitMargin || "15"
      }));
    }
  }, []);

  const handleInputChange = (field: keyof CalculationData, value: string) => {
    setCalculation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrice = () => {
    const distance = parseFloat(calculation.distance) || 0;
    const fuelPrice = parseFloat(calculation.fuelPrice) || 0;
    const fuelConsumption = parseFloat(calculation.fuelConsumption) || 0;
    const tollFees = parseFloat(calculation.tollFees) || 0;
    const brokerCommission = parseFloat(calculation.brokerCommission) || 0;
    const insurancePercentage = parseFloat(calculation.insurancePercentage) || 0;
    const profitMargin = parseFloat(calculation.profitMargin) || 0;

    // حساب تكلفة الوقود
    const fuelCost = (distance * fuelConsumption / 100) * fuelPrice;
    
    // المجموع الفرعي
    const subtotal = fuelCost + tollFees + brokerCommission;
    
    // تكلفة التأمين
    const insuranceCost = subtotal * (insurancePercentage / 100);
    
    // المجموع مع التأمين
    const totalWithInsurance = subtotal + insuranceCost;
    
    // هامش الربح
    const profitAmount = totalWithInsurance * (profitMargin / 100);
    
    // السعر النهائي
    const totalPrice = totalWithInsurance + profitAmount;

    const calculationResult: CalculationResult = {
      fuelCost,
      tollFees,
      brokerCommission,
      insuranceCost,
      subtotal: totalWithInsurance,
      profitAmount,
      totalPrice
    };

    setResult(calculationResult);
  };

  const saveCalculation = () => {
    if (!result) {
      toast.error('يرجى حساب السعر أولاً');
      return;
    }

    const newCalculation = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...calculation,
      result
    };

    const updated = [...savedCalculations, newCalculation];
    setSavedCalculations(updated);
    localStorage.setItem('savedCalculations', JSON.stringify(updated));
    toast.success('تم حفظ الحساب بنجاح');
  };

  const resetCalculation = () => {
    setCalculation({
      fromCity: "",
      toCity: "",
      distance: "",
      vehicleType: "",
      fuelPrice: "2.18",
      fuelConsumption: "25",
      tollFees: "0",
      brokerCommission: "500",
      insurancePercentage: "3",
      profitMargin: "15"
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
              <h1 className="text-3xl font-bold">حاسبة أسعار الشحن</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator Inputs */}
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
                      <Select value={calculation.fromCity} onValueChange={(value) => handleInputChange('fromCity', value)}>
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
                      <Select value={calculation.toCity} onValueChange={(value) => handleInputChange('toCity', value)}>
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
                      <Label>المسافة (كم)</Label>
                      <Input
                        type="number"
                        value={calculation.distance}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                        placeholder="أدخل المسافة"
                      />
                    </div>

                    <div>
                      <Label>نوع المركبة</Label>
                      <Select value={calculation.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المركبة..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>سعر الوقود (ريال/لتر)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={calculation.fuelPrice}
                        onChange={(e) => handleInputChange('fuelPrice', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>استهلاك الوقود (لتر/100كم)</Label>
                      <Input
                        type="number"
                        value={calculation.fuelConsumption}
                        onChange={(e) => handleInputChange('fuelConsumption', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>رسوم الطرق (ريال)</Label>
                      <Input
                        type="number"
                        value={calculation.tollFees}
                        onChange={(e) => handleInputChange('tollFees', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>عمولة الوسيط (ريال)</Label>
                      <Input
                        type="number"
                        value={calculation.brokerCommission}
                        onChange={(e) => handleInputChange('brokerCommission', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نسبة التأمين (%)</Label>
                      <Input
                        type="number"
                        value={calculation.insurancePercentage}
                        onChange={(e) => handleInputChange('insurancePercentage', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>هامش الربح (%)</Label>
                      <Input
                        type="number"
                        value={calculation.profitMargin}
                        onChange={(e) => handleInputChange('profitMargin', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={calculatePrice} className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      احسب السعر
                    </Button>
                    <Button variant="outline" onClick={resetCalculation}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      إعادة تعيين
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>نتيجة الحساب</CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>تكلفة الوقود:</span>
                        <span className="font-medium">{result.fuelCost.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>رسوم الطرق:</span>
                        <span className="font-medium">{result.tollFees.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>عمولة الوسيط:</span>
                        <span className="font-medium">{result.brokerCommission.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>تكلفة التأمين:</span>
                        <span className="font-medium">{result.insuranceCost.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المجموع الفرعي:</span>
                        <span className="font-medium">{result.subtotal.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>هامش الربح:</span>
                        <span className="font-medium">{result.profitAmount.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>السعر النهائي:</span>
                        <span className="text-green-600">{result.totalPrice.toFixed(2)} ريال</span>
                      </div>
                      
                      <Button onClick={saveCalculation} className="w-full mt-4">
                        <Save className="w-4 h-4 mr-2" />
                        حفظ الحساب
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      أدخل البيانات واضغط "احسب السعر" لعرض النتيجة
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Saved Calculations */}
            {savedCalculations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>الحسابات المحفوظة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">التاريخ</th>
                          <th className="text-right p-3">من - إلى</th>
                          <th className="text-right p-3">المسافة</th>
                          <th className="text-right p-3">نوع المركبة</th>
                          <th className="text-right p-3">السعر النهائي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedCalculations.map((calc) => (
                          <tr key={calc.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{new Date(calc.date).toLocaleDateString('ar-SA')}</td>
                            <td className="p-3">{calc.fromCity} - {calc.toCity}</td>
                            <td className="p-3">{calc.distance} كم</td>
                            <td className="p-3">{calc.vehicleType}</td>
                            <td className="p-3 font-medium text-green-600">{calc.result.totalPrice.toFixed(2)} ريال</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
