
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Users, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAdmin } from '@/contexts/AdminContext';
import Header from '@/components/Header';

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
  created_at: string;
}

interface Company {
  id: string;
  company_name: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
  truck_count: number;
  has_insurance: boolean;
  insurance_type?: string;
  created_at: string;
}

const Admin = () => {
  const { admin } = useAdmin();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drivers' | 'companies'>('drivers');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching drivers and companies data...');
      
      // Fetch drivers
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (driversError) {
        console.error('Error fetching drivers:', driversError);
        toast.error('خطأ في تحميل بيانات السائقين');
      } else {
        console.log('Drivers data loaded:', driversData);
        setDrivers(driversData || []);
      }

      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        toast.error('خطأ في تحميل بيانات الشركات');
      } else {
        console.log('Companies data loaded:', companiesData);
        setCompanies(companiesData || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching data:', error);
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
      fetchData();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('خطأ في حذف السائق');
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف الشركة بنجاح');
      fetchData();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('خطأ في حذف الشركة');
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone_number.includes(searchTerm)
  );

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone_number.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي السائقين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الشركات</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'drivers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            السائقين ({drivers.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'companies'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            الشركات ({companies.length})
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={activeTab === 'drivers' ? 'البحث عن سائق...' : 'البحث عن شركة...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'drivers' ? (
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>قائمة الشركات المسجلة</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCompanies.length === 0 ? (
                <p className="text-center text-gray-500 py-8">لا توجد شركات مسجلة</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">اسم الشركة</th>
                        <th className="text-right p-3">اسم المسؤول</th>
                        <th className="text-right p-3">رقم الجوال</th>
                        <th className="text-right p-3">عدد الشاحنات</th>
                        <th className="text-right p-3">التأمين</th>
                        <th className="text-right p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompanies.map((company) => (
                        <tr key={company.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{company.company_name}</td>
                          <td className="p-3">{company.manager_name}</td>
                          <td className="p-3">{company.phone_number}</td>
                          <td className="p-3">
                            <Badge variant="outline">{company.truck_count}</Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={company.has_insurance ? "default" : "destructive"}>
                              {company.has_insurance ? "مؤمنة" : "غير مؤمنة"}
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
                                onClick={() => deleteCompany(company.id)}
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
        )}
      </div>
    </div>
  );
};

export default Admin;
