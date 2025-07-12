
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface City {
  id: string;
  name: string;
  is_active: boolean;
  display_order?: number;
}

interface VehicleType {
  id: string;
  name: string;
  is_active: boolean;
  display_order?: number;
}

export default function CitiesVehiclesManagement() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  
  const [newCity, setNewCity] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("");
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editingCityValue, setEditingCityValue] = useState("");
  const [editingVehicleValue, setEditingVehicleValue] = useState("");

  // Fetch cities
  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as City[];
    }
  });

  // Fetch vehicle types
  const { data: vehicleTypes = [], isLoading: vehicleTypesLoading } = useQuery({
    queryKey: ['vehicle_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as VehicleType[];
    }
  });

  // Add city mutation
  const addCityMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('cities')
        .insert([{ 
          name: name.trim(),
          display_order: cities.length + 1
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setNewCity("");
      toast.success('تم إضافة المدينة بنجاح');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('هذه المدينة موجودة بالفعل');
      } else {
        toast.error('حدث خطأ في إضافة المدينة');
      }
    }
  });

  // Add vehicle type mutation
  const addVehicleTypeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .insert([{ 
          name: name.trim(),
          display_order: vehicleTypes.length + 1
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle_types'] });
      setNewVehicleType("");
      toast.success('تم إضافة نوع الشاحنة بنجاح');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('هذا النوع موجود بالفعل');
      } else {
        toast.error('حدث خطأ في إضافة نوع الشاحنة');
      }
    }
  });

  // Update city mutation
  const updateCityMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('cities')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setEditingCity(null);
      setEditingCityValue("");
      toast.success('تم تحديث المدينة بنجاح');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('هذه المدينة موجودة بالفعل');
      } else {
        toast.error('حدث خطأ في تحديث المدينة');
      }
    }
  });

  // Update vehicle type mutation
  const updateVehicleTypeMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle_types'] });
      setEditingVehicle(null);
      setEditingVehicleValue("");
      toast.success('تم تحديث نوع الشاحنة بنجاح');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('هذا النوع موجود بالفعل');
      } else {
        toast.error('حدث خطأ في تحديث نوع الشاحنة');
      }
    }
  });

  // Delete city mutation
  const deleteCityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('تم حذف المدينة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في حذف المدينة');
    }
  });

  // Delete vehicle type mutation
  const deleteVehicleTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle_types'] });
      toast.success('تم حذف نوع الشاحنة بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في حذف نوع الشاحنة');
    }
  });

  const addCity = () => {
    if (!newCity.trim()) {
      toast.error('اسم المدينة مطلوب');
      return;
    }
    
    addCityMutation.mutate(newCity);
  };

  const deleteCity = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    deleteCityMutation.mutate(id);
  };

  const startEditingCity = (city: City) => {
    setEditingCity(city.id);
    setEditingCityValue(city.name);
  };

  const saveEditedCity = () => {
    if (!editingCityValue.trim()) {
      toast.error('اسم المدينة مطلوب');
      return;
    }

    updateCityMutation.mutate({
      id: editingCity!,
      name: editingCityValue
    });
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
    
    addVehicleTypeMutation.mutate(newVehicleType);
  };

  const deleteVehicleType = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا النوع؟')) return;
    deleteVehicleTypeMutation.mutate(id);
  };

  const startEditingVehicle = (vehicleType: VehicleType) => {
    setEditingVehicle(vehicleType.id);
    setEditingVehicleValue(vehicleType.name);
  };

  const saveEditedVehicle = () => {
    if (!editingVehicleValue.trim()) {
      toast.error('نوع الشاحنة مطلوب');
      return;
    }

    updateVehicleTypeMutation.mutate({
      id: editingVehicle!,
      name: editingVehicleValue
    });
  };

  const cancelEditingVehicle = () => {
    setEditingVehicle(null);
    setEditingVehicleValue("");
  };

  if (citiesLoading || vehicleTypesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center mb-6">
          <img 
            src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
            alt="Mile Truck Logo" 
            className="h-12 w-auto mr-4"
          />
        </div>
        <div className="text-center">جاري التحميل...</div>
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
              <Button onClick={addCity} disabled={addCityMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cities.map((city) => (
                <div key={city.id} className="flex items-center justify-between p-3 border rounded-md">
                  {editingCity === city.id ? (
                    <>
                      <Input
                        value={editingCityValue}
                        onChange={(e) => setEditingCityValue(e.target.value)}
                        className="flex-1 mr-2"
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedCity()}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEditedCity} disabled={updateCityMutation.isPending}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingCity}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <span>{city.name}</span>
                        {!city.is_active && <Badge variant="secondary">غير نشط</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingCity(city)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCity(city.id)}
                          disabled={deleteCityMutation.isPending}
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
              <Button onClick={addVehicleType} disabled={addVehicleTypeMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                إضافة
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vehicleTypes.map((vehicleType) => (
                <div key={vehicleType.id} className="flex items-center justify-between p-3 border rounded-md">
                  {editingVehicle === vehicleType.id ? (
                    <>
                      <Input
                        value={editingVehicleValue}
                        onChange={(e) => setEditingVehicleValue(e.target.value)}
                        className="flex-1 mr-2"
                        onKeyPress={(e) => e.key === 'Enter' && saveEditedVehicle()}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEditedVehicle} disabled={updateVehicleTypeMutation.isPending}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingVehicle}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <span>{vehicleType.name}</span>
                        {!vehicleType.is_active && <Badge variant="secondary">غير نشط</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditingVehicle(vehicleType)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteVehicleType(vehicleType.id)}
                          disabled={deleteVehicleTypeMutation.isPending}
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
          <p className="text-sm text-muted-foreground">
            • البيانات محفوظة في قاعدة البيانات ومتاحة لجميع الصفحات
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
