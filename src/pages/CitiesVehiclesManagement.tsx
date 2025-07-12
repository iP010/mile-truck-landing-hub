
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CitiesVehiclesManagement() {
  const { language } = useLanguage();
  
  const [cities, setCities] = useState([
    "الرياض", "جدة", "الدمام", "الطائف", "المدينة المنورة", "مكة المكرمة",
    "أبها", "تبوك", "بريدة", "خميس مشيط", "حائل", "الجبيل", "ينبع",
    "الأحساء", "نجران", "الباحة", "عرعر", "سكاكا", "جازان", "القصيم"
  ]);

  const [vehicleTypes, setVehicleTypes] = useState([
    "شاحنة صغيرة",
    "شاحنة متوسطة", 
    "شاحنة كبيرة",
    "مقطورة",
    "رافعة شوكية",
    "نقل ثقيل"
  ]);

  const [newCity, setNewCity] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("");
  const [editingCity, setEditingCity] = useState<number | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null);
  const [editingCityValue, setEditingCityValue] = useState("");
  const [editingVehicleValue, setEditingVehicleValue] = useState("");

  const addCity = () => {
    if (!newCity.trim()) {
      toast.error('اسم المدينة مطلوب');
      return;
    }
    
    if (cities.includes(newCity.trim())) {
      toast.error('هذه المدينة موجودة بالفعل');
      return;
    }

    setCities([...cities, newCity.trim()]);
    setNewCity("");
    toast.success('تم إضافة المدينة بنجاح');
  };

  const deleteCity = (index: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    
    const updatedCities = cities.filter((_, i) => i !== index);
    setCities(updatedCities);
    toast.success('تم حذف المدينة بنجاح');
  };

  const startEditingCity = (index: number) => {
    setEditingCity(index);
    setEditingCityValue(cities[index]);
  };

  const saveEditedCity = () => {
    if (!editingCityValue.trim()) {
      toast.error('اسم المدينة مطلوب');
      return;
    }

    if (cities.includes(editingCityValue.trim()) && cities[editingCity!] !== editingCityValue.trim()) {
      toast.error('هذه المدينة موجودة بالفعل');
      return;
    }

    const updatedCities = [...cities];
    updatedCities[editingCity!] = editingCityValue.trim();
    setCities(updatedCities);
    setEditingCity(null);
    setEditingCityValue("");
    toast.success('تم تحديث المدينة بنجاح');
  };

  const cancelEditingCity = () => {
    setEditingCity(null);
    setEditingCityValue("");
  };

  const addVehicleType = () => {
    if (!newVehicleType.trim()) {
      toast.error('نوع الشاحنة مطلوب');
      return;
    }
    
    if (vehicleTypes.includes(newVehicleType.trim())) {
      toast.error('هذا النوع موجود بالفعل');
      return;
    }

    setVehicleTypes([...vehicleTypes, newVehicleType.trim()]);
    setNewVehicleType("");
    toast.success('تم إضافة نوع الشاحنة بنجاح');
  };

  const deleteVehicleType = (index: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا النوع؟')) return;
    
    const updatedVehicleTypes = vehicleTypes.filter((_, i) => i !== index);
    setVehicleTypes(updatedVehicleTypes);
    toast.success('تم حذف نوع الشاحنة بنجاح');
  };

  const startEditingVehicle = (index: number) => {
    setEditingVehicle(index);
    setEditingVehicleValue(vehicleTypes[index]);
  };

  const saveEditedVehicle = () => {
    if (!editingVehicleValue.trim()) {
      toast.error('نوع الشاحنة مطلوب');
      return;
    }

    if (vehicleTypes.includes(editingVehicleValue.trim()) && vehicleTypes[editingVehicle!] !== editingVehicleValue.trim()) {
      toast.error('هذا النوع موجود بالفعل');
      return;
    }

    const updatedVehicleTypes = [...vehicleTypes];
    updatedVehicleTypes[editingVehicle!] = editingVehicleValue.trim();
    setVehicleTypes(updatedVehicleTypes);
    setEditingVehicle(null);
    setEditingVehicleValue("");
    toast.success('تم تحديث نوع الشاحنة بنجاح');
  };

  const cancelEditingVehicle = () => {
    setEditingVehicle(null);
    setEditingVehicleValue("");
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
        <h1 className="text-3xl font-bold">إدارة المدن وأنواع الشاحنات</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cities Management */}
        <Card>
          <CardHeader>
            <CardTitle>إدارة المدن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="أدخل اسم المدينة"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
              />
              <Button onClick={addCity}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cities.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  {editingCity === index ? (
                    <>
                      <Input
                        value={editingCityValue}
                        onChange={(e) => setEditingCityValue(e.target.value)}
                        className="flex-1 mr-2"
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedCity()}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEditedCity}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingCity}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{city}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingCity(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCity(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              إجمالي المدن: {cities.length}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Types Management */}
        <Card>
          <CardHeader>
            <CardTitle>إدارة أنواع الشاحنات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="أدخل نوع الشاحنة"
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addVehicleType()}
              />
              <Button onClick={addVehicleType}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vehicleTypes.map((vehicleType, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  {editingVehicle === index ? (
                    <>
                      <Input
                        value={editingVehicleValue}
                        onChange={(e) => setEditingVehicleValue(e.target.value)}
                        className="flex-1 mr-2"
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedVehicle()}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEditedVehicle}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingVehicle}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{vehicleType}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingVehicle(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteVehicleType(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              إجمالي أنواع الشاحنات: {vehicleTypes.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملاحظات هامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • عند تعديل أو حذف مدينة أو نوع شاحنة، تأكد من عدم استخدامها في الرحلات الموجودة
          </p>
          <p className="text-sm text-muted-foreground">
            • التغييرات ستؤثر على جميع الشركات عند إضافة رحلات جديدة
          </p>
          <p className="text-sm text-muted-foreground">
            • يمكنك إضافة مدن وأنواع شاحنات متعددة حسب احتياجات العمل
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
