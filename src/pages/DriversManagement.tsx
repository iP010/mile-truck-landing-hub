
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText, Download, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DriverRegistrationToggle from "@/components/DriverRegistrationToggle";

interface Driver {
  id: string;
  driver_name: string;
  nationality: string;
  truck_brand: string;
  truck_type: string;
  phone_number: string;
  whatsapp_number: string;
  has_insurance: boolean;
  insurance_type?: string;
  invitation_code?: string;
  referral_code?: string;
  created_at: string;
}

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      console.log('Fetching drivers...');
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Drivers data:', data);
      console.log('Drivers error:', error);

      if (error) {
        console.error('Error fetching drivers:', error);
        toast.error('خطأ في تحميل بيانات السائقين');
        return;
      }

      setDrivers(data || []);
    } catch (error) {
      console.error('Unexpected error fetching drivers:', error);
      toast.error('خطأ غير متوقع في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السائق؟')) return;

    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف السائق بنجاح');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('خطأ في حذف السائق');
    }
  };

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    toast.info(`تصدير البيانات بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone_number.includes(searchTerm)
  );

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <PricingSidebar />
          <SidebarInset>
            <div className="flex justify-center items-center h-64">جاري التحميل...</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PricingSidebar />
        <SidebarInset>
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                  alt="Mile Truck Logo" 
                  className="h-12 w-auto"
                />
                <h1 className="text-3xl font-bold text-gray-800">إدارة السائقين</h1>
              </div>
              
              {/* Export buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => exportData('sql')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  SQL
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportData('excel')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => exportData('csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>

            {/* Driver Registration Toggle */}
            <DriverRegistrationToggle />

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن سائق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                إجمالي السائقين: {drivers.length}
              </Badge>
            </div>

            {/* Drivers List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة السائقين المسجلين</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDrivers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا توجد سائقين مسجلين</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">اسم السائق</th>
                          <th className="text-right p-3">الجنسية</th>
                          <th className="text-right p-3">نوع الشاحنة</th>
                          <th className="text-right p-3">رقم الجوال</th>
                          <th className="text-right p-3">التأمين</th>
                          <th className="text-right p-3">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDrivers.map((driver) => (
                          <tr key={driver.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{driver.driver_name}</td>
                            <td className="p-3">{driver.nationality}</td>
                            <td className="p-3">
                              <Badge variant="outline">{driver.truck_type}</Badge>
                            </td>
                            <td className="p-3">{driver.phone_number}</td>
                            <td className="p-3">
                              <Badge variant={driver.has_insurance ? "default" : "destructive"}>
                                {driver.has_insurance ? "مؤمن" : "غير مؤمن"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteDriver(driver.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
