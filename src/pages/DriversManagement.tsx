import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Edit, Trash2, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import EditDriverModal from '../components/EditDriverModal';

interface Driver {
  id: string;
  driver_name: string;
  nationality: string;
  truck_brand: string;
  truck_type: string;
  phone_number: string;
  whatsapp_number: string;
  has_insurance: boolean;
  insurance_type: string | null;
  invitation_code: string | null;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

const DriversManagement = () => {
  const { admin } = useAdmin();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('خطأ في تحميل بيانات السائقين');
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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone_number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">إدارة السائقين</h1>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link to="/admin-profile">الملف الشخصي</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin-dashboard">لوحة التقارير</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للوحة التقارير
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة السائقين</h1>
          <p className="text-muted-foreground">عرض وتعديل وحذف بيانات السائقين المسجلين</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>قائمة السائقين ({filteredDrivers.length})</CardTitle>
              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  تصدير
                </Button>
                <Button asChild>
                  <Link to="/driver-registration">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة سائق
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن سائق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا توجد بيانات سائقين</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">
                        <Checkbox
                          checked={selectedDrivers.length === filteredDrivers.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDrivers(filteredDrivers.map(d => d.id));
                            } else {
                              setSelectedDrivers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-right p-2">اسم السائق</th>
                      <th className="text-right p-2">الجنسية</th>
                      <th className="text-right p-2">نوع الشاحنة</th>
                      <th className="text-right p-2">الهاتف</th>
                      <th className="text-right p-2">التأمين</th>
                      <th className="text-right p-2">تاريخ التسجيل</th>
                      <th className="text-right p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <Checkbox
                            checked={selectedDrivers.includes(driver.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDrivers([...selectedDrivers, driver.id]);
                              } else {
                                setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-2 font-medium">{driver.driver_name}</td>
                        <td className="p-2">{driver.nationality}</td>
                        <td className="p-2">{driver.truck_type}</td>
                        <td className="p-2">{driver.phone_number}</td>
                        <td className="p-2">
                          {driver.has_insurance ? (
                            <span className="text-green-600">✓ {driver.insurance_type}</span>
                          ) : (
                            <span className="text-red-600">✗ لا يوجد</span>
                          )}
                        </td>
                        <td className="p-2">{new Date(driver.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingDriver(driver)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteDriver(driver.id)}
                            >
                              <Trash2 className="h-3 w-3" />
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

        {editingDriver && (
          <EditDriverModal
            driver={editingDriver}
            onClose={() => setEditingDriver(null)}
            onUpdate={(updatedDriver) => {
              setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
              setEditingDriver(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DriversManagement;
