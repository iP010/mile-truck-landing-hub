import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Edit, Trash2, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import EditDriverModal from '../components/EditDriverModal';

interface Driver {
  id: string;
  driver_name: string;
  nationality: string;
  phone_number: string;
  whatsapp_number: string;
  truck_brand: string;
  truck_type: string;
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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();
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

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السائق؟')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDrivers(drivers.filter(driver => driver.id !== id));
      toast.success('تم حذف السائق بنجاح');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('خطأ في حذف السائق');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDrivers.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedDrivers.length} سائق؟`)) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('drivers')
        .delete()
        .in('id', selectedDrivers);

      if (error) throw error;
      setDrivers(drivers.filter(driver => !selectedDrivers.includes(driver.id)));
      setSelectedDrivers([]);
      toast.success(`تم حذف ${selectedDrivers.length} سائق بنجاح`);
    } catch (error) {
      console.error('Error bulk deleting drivers:', error);
      toast.error('خطأ في حذف السائقين');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['اسم السائق', 'الجنسية', 'رقم الهاتف', 'رقم الواتساب', 'ماركة الشاحنة', 'نوع الشاحنة', 'يوجد تأمين', 'نوع التأمين', 'كود الدعوة', 'كود الإحالة', 'تاريخ التسجيل'],
      ...filteredDrivers.map(driver => [
        driver.driver_name,
        driver.nationality,
        driver.phone_number,
        driver.whatsapp_number,
        driver.truck_brand,
        driver.truck_type,
        driver.has_insurance ? 'نعم' : 'لا',
        driver.insurance_type || 'لا يوجد',
        driver.invitation_code || 'لا يوجد',
        driver.referral_code || 'لا يوجد',
        new Date(driver.created_at).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `drivers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone_number.includes(searchTerm) ||
    driver.truck_brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedDrivers.length === filteredDrivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(filteredDrivers.map(driver => driver.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة لوحة التقارير
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة السائقين المسجلين</h1>
          <p className="text-muted-foreground">عرض وتعديل وحذف بيانات السائقين</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>البحث والأدوات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم أو الجنسية أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير البيانات
                </Button>
                <Button asChild>
                  <Link to="/driver-registration">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة سائق جديد
                  </Link>
                </Button>
              </div>
            </div>
            {selectedDrivers.length > 0 && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg flex items-center justify-between">
                <span>تم تحديد {selectedDrivers.length} سائق</span>
                <Button variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف المحدد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>قائمة السائقين ({filteredDrivers.length})</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDrivers.length === filteredDrivers.length && filteredDrivers.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-muted-foreground">تحديد الكل</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا يوجد سائقين مسجلين</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">تحديد</th>
                      <th className="text-right p-2">اسم السائق</th>
                      <th className="text-right p-2">الجنسية</th>
                      <th className="text-right p-2">رقم الهاتف</th>
                      <th className="text-right p-2">ماركة الشاحنة</th>
                      <th className="text-right p-2">نوع الشاحنة</th>
                      <th className="text-right p-2">التأمين</th>
                      <th className="text-right p-2">تاريخ التسجيل</th>
                      <th className="text-right p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedDrivers.includes(driver.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDrivers([...selectedDrivers, driver.id]);
                              } else {
                                setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{driver.driver_name}</td>
                        <td className="p-2">{driver.nationality}</td>
                        <td className="p-2">{driver.phone_number}</td>
                        <td className="p-2">{driver.truck_brand}</td>
                        <td className="p-2">{driver.truck_type}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driver.has_insurance 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {driver.has_insurance ? 'يوجد' : 'لا يوجد'}
                          </span>
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
                              onClick={() => handleDeleteDriver(driver.id)}
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