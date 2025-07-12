
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Download, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tables } from '../integrations/supabase/types';
import { toast } from 'sonner';
import EditDriverModal from '../components/EditDriverModal';
import ExportModal from '../components/ExportModal';
import { useLanguage } from '../contexts/LanguageContext';

type Driver = Tables<'drivers'>;

const DriversManagement = () => {
  const { admin } = useAdmin();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  const supabase = getSupabaseClient();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      console.log('Loading drivers...');
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Drivers data:', data);
      console.log('Drivers error:', error);

      if (error) {
        console.error('Error loading drivers:', error);
        toast.error(isRTL ? 'خطأ في تحميل بيانات السائقين' : 'Error loading drivers data');
        return;
      }

      setDrivers(data || []);
    } catch (error) {
      console.error('Unexpected error loading drivers:', error);
      toast.error(isRTL ? 'خطأ غير متوقع في تحميل البيانات' : 'Unexpected error loading data');
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا السائق؟' : 'Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting driver:', error);
        toast.error(isRTL ? 'خطأ في حذف السائق' : 'Error deleting driver');
        return;
      }

      toast.success(isRTL ? 'تم حذف السائق بنجاح' : 'Driver deleted successfully');
      loadDrivers();
    } catch (error) {
      console.error('Unexpected error deleting driver:', error);
      toast.error(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
    }
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(drivers.map(driver => 
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
    setEditingDriver(null);
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone_number.includes(searchTerm) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isRTL ? 'العودة للوحة التقارير' : 'Back to Dashboard'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isRTL ? 'إدارة السائقين' : 'Drivers Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة بيانات السائقين المسجلين' : 'Manage registered drivers data'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>
                {isRTL ? 'قائمة السائقين' : 'Drivers List'}
                <Badge variant="secondary" className="ml-2">
                  {filteredDrivers.length}
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => setShowExportModal(true)} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {isRTL ? 'تصدير' : 'Export'}
                </Button>
                <Link to="/driver-registration">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? 'إضافة سائق' : 'Add Driver'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Input
                placeholder={isRTL ? 'البحث بالاسم أو رقم الهاتف أو الجنسية...' : 'Search by name, phone or nationality...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 
                  (isRTL ? 'لا توجد نتائج للبحث' : 'No search results found') :
                  (isRTL ? 'لا توجد سائقين مسجلين' : 'No drivers registered')
                }
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-lg">{driver.driver_name}</h3>
                          <Badge variant={driver.has_insurance ? "default" : "secondary"}>
                            {driver.has_insurance ? 
                              (isRTL ? 'يوجد تأمين' : 'Insured') : 
                              (isRTL ? 'لا يوجد تأمين' : 'Not Insured')
                            }
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{isRTL ? 'الجنسية:' : 'Nationality:'}</span> {driver.nationality}
                          </div>
                          <div>
                            <span className="font-medium">{isRTL ? 'الهاتف:' : 'Phone:'}</span> {driver.phone_number}
                          </div>
                          <div>
                            <span className="font-medium">{isRTL ? 'واتساب:' : 'WhatsApp:'}</span> {driver.whatsapp_number}
                          </div>
                          <div>
                            <span className="font-medium">{isRTL ? 'نوع الشاحنة:' : 'Truck Type:'}</span> {driver.truck_type}
                          </div>
                          <div>
                            <span className="font-medium">{isRTL ? 'ماركة الشاحنة:' : 'Truck Brand:'}</span> {driver.truck_brand}
                          </div>
                          {driver.has_insurance && driver.insurance_type && (
                            <div>
                              <span className="font-medium">{isRTL ? 'نوع التأمين:' : 'Insurance Type:'}</span> {driver.insurance_type}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingDriver(driver)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDriver(driver.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {editingDriver && (
          <EditDriverModal
            driver={editingDriver}
            onClose={() => setEditingDriver(null)}
            onUpdate={handleUpdateDriver}
          />
        )}

        {showExportModal && (
          <ExportModal
            title={isRTL ? 'تصدير بيانات السائقين' : 'Export Drivers Data'}
            data={filteredDrivers}
            filename="drivers"
            onClose={() => setShowExportModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DriversManagement;
