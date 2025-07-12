
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface PricingSettings {
  defaultFuelPrice: string;
  defaultFuelConsumption: string;
  defaultBrokerCommission: string;
  defaultInsurancePercentage: string;
  defaultProfitMargin: string;
  autoCalculateDistance: boolean;
  requireApprovalForPriceChanges: boolean;
  enableBulkPriceUpdates: boolean;
  showCalculatorInPricing: boolean;
  enablePriceHistory: boolean;
  maxPriceDeviation: string;
}

export default function PricingSettings() {
  const [settings, setSettings] = useState<PricingSettings>({
    defaultFuelPrice: "2.18",
    defaultFuelConsumption: "25",
    defaultBrokerCommission: "500",
    defaultInsurancePercentage: "3",
    defaultProfitMargin: "15",
    autoCalculateDistance: true,
    requireApprovalForPriceChanges: false,
    enableBulkPriceUpdates: true,
    showCalculatorInPricing: true,
    enablePriceHistory: true,
    maxPriceDeviation: "50"
  });

  const [originalSettings, setOriginalSettings] = useState<PricingSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('pricingSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setOriginalSettings(parsed);
    }
  }, []);

  useEffect(() => {
    // Check if there are unsaved changes
    const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(hasUnsavedChanges);
  }, [settings, originalSettings]);

  const handleInputChange = (field: keyof PricingSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('pricingSettings', JSON.stringify(settings));
      setOriginalSettings(settings);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطأ في حفظ الإعدادات');
    }
  };

  const resetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      const defaultSettings: PricingSettings = {
        defaultFuelPrice: "2.18",
        defaultFuelConsumption: "25",
        defaultBrokerCommission: "500",
        defaultInsurancePercentage: "3",
        defaultProfitMargin: "15",
        autoCalculateDistance: true,
        requireApprovalForPriceChanges: false,
        enableBulkPriceUpdates: true,
        showCalculatorInPricing: true,
        enablePriceHistory: true,
        maxPriceDeviation: "50"
      };
      
      setSettings(defaultSettings);
      toast.success('تم إعادة تعيين الإعدادات');
    }
  };

  const cancelChanges = () => {
    setSettings(originalSettings);
    toast.info('تم إلغاء التغييرات');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PricingSidebar />
        <SidebarInset>
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                  alt="Mile Truck Logo" 
                  className="h-12 w-auto mr-4"
                />
                <h1 className="text-3xl font-bold">إعدادات أسعار الشحن</h1>
              </div>
              
              {hasChanges && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelChanges}>
                    إلغاء
                  </Button>
                  <Button onClick={saveSettings} className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Default Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    القيم الافتراضية للحاسبة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>سعر الوقود الافتراضي (ريال/لتر)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={settings.defaultFuelPrice}
                        onChange={(e) => handleInputChange('defaultFuelPrice', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>استهلاك الوقود الافتراضي (لتر/100كم)</Label>
                      <Input
                        type="number"
                        value={settings.defaultFuelConsumption}
                        onChange={(e) => handleInputChange('defaultFuelConsumption', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>عمولة الوسيط الافتراضية (ريال)</Label>
                      <Input
                        type="number"
                        value={settings.defaultBrokerCommission}
                        onChange={(e) => handleInputChange('defaultBrokerCommission', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>نسبة التأمين الافتراضية (%)</Label>
                      <Input
                        type="number"
                        value={settings.defaultInsurancePercentage}
                        onChange={(e) => handleInputChange('defaultInsurancePercentage', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>هامش الربح الافتراضي (%)</Label>
                      <Input
                        type="number"
                        value={settings.defaultProfitMargin}
                        onChange={(e) => handleInputChange('defaultProfitMargin', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>أقصى انحراف مسموح في السعر (ريال)</Label>
                      <Input
                        type="number"
                        value={settings.maxPriceDeviation}
                        onChange={(e) => handleInputChange('maxPriceDeviation', e.target.value)}
                        placeholder="50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">حساب المسافة تلقائياً</Label>
                      <p className="text-sm text-gray-500">حساب المسافة بين المدن تلقائياً</p>
                    </div>
                    <Switch
                      checked={settings.autoCalculateDistance}
                      onCheckedChange={(checked) => handleInputChange('autoCalculateDistance', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">عرض الحاسبة في صفحة الأسعار</Label>
                      <p className="text-sm text-gray-500">إظهار حاسبة الأسعار في صفحات إدارة الأسعار</p>
                    </div>
                    <Switch
                      checked={settings.showCalculatorInPricing}
                      onCheckedChange={(checked) => handleInputChange('showCalculatorInPricing', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">تفعيل التحديث المجمع للأسعار</Label>
                      <p className="text-sm text-gray-500">السماح بتحديث أسعار متعددة مرة واحدة</p>
                    </div>
                    <Switch
                      checked={settings.enableBulkPriceUpdates}
                      onCheckedChange={(checked) => handleInputChange('enableBulkPriceUpdates', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">تفعيل سجل تاريخ الأسعار</Label>
                      <p className="text-sm text-gray-500">حفظ تاريخ تغييرات الأسعار</p>
                    </div>
                    <Switch
                      checked={settings.enablePriceHistory}
                      onCheckedChange={(checked) => handleInputChange('enablePriceHistory', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">طلب موافقة على تغيير الأسعار</Label>
                      <p className="text-sm text-gray-500">يتطلب موافقة المدير لتغيير الأسعار</p>
                    </div>
                    <Switch
                      checked={settings.requireApprovalForPriceChanges}
                      onCheckedChange={(checked) => handleInputChange('requireApprovalForPriceChanges', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>الإعدادات المتقدمة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveSettings} className="bg-green-500 hover:bg-green-600">
                      <Save className="h-4 w-4 mr-2" />
                      حفظ جميع الإعدادات
                    </Button>
                    <Button variant="outline" onClick={resetSettings}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      إعادة تعيين للافتراضي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ملاحظات هامة لوسطاء الشحن</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • ستؤثر هذه الإعدادات على جميع الحسابات الجديدة في حاسبة أسعار الشحن
                </p>
                <p className="text-sm text-muted-foreground">
                  • يتم حفظ الإعدادات محلياً في المتصفح
                </p>
                <p className="text-sm text-muted-foreground">
                  • عمولة الوسيط هي المبلغ الذي تحصل عليه مقابل خدمة الوساطة
                </p>
                <p className="text-sm text-muted-foreground">
                  • يمكنك تخصيص إعدادات مختلفة لكل نوع من أنواع الشحن
                </p>
                <p className="text-sm text-muted-foreground">
                  • سيتم تطبيق التغييرات فوراً على النظام
                </p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
