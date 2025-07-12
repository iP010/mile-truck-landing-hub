import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Edit, Trash2, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Company {
  id: string;
  company_name: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
  truck_count: number;
  has_insurance: boolean;
  insurance_type: string | null;
  created_at: string;
}

const CompaniesManagement = () => {
  const { admin } = useAdmin();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('خطأ في تحميل بيانات الشركات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCompanies(companies.filter(company => company.id !== id));
      toast.success('تم حذف الشركة بنجاح');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('خطأ في حذف الشركة');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCompanies.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedCompanies.length} شركة؟`)) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies')
        .delete()
        .in('id', selectedCompanies);

      if (error) throw error;
      setCompanies(companies.filter(company => !selectedCompanies.includes(company.id)));
      setSelectedCompanies([]);
      toast.success(`تم حذف ${selectedCompanies.length} شركة بنجاح`);
    } catch (error) {
      console.error('Error bulk deleting companies:', error);
      toast.error('خطأ في حذف الشركات');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['اسم الشركة', 'اسم المدير', 'رقم الهاتف', 'رقم الواتساب', 'عدد الشاحنات', 'يوجد تأمين', 'نوع التأمين', 'تاريخ التسجيل'],
      ...filteredCompanies.map(company => [
        company.company_name,
        company.manager_name,
        company.phone_number,
        company.whatsapp_number,
        company.truck_count.toString(),
        company.has_insurance ? 'نعم' : 'لا',
        company.insurance_type || 'لا يوجد',
        new Date(company.created_at).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `companies_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone_number.includes(searchTerm)
  );

  const toggleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(company => company.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة لوحة التحكم
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الشركات المسجلة</h1>
          <p className="text-muted-foreground">عرض وتعديل وحذف بيانات الشركات</p>
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
                  placeholder="البحث بالاسم أو رقم الهاتف..."
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
                  <Link to="/company-registration">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة شركة جديدة
                  </Link>
                </Button>
              </div>
            </div>
            {selectedCompanies.length > 0 && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg flex items-center justify-between">
                <span>تم تحديد {selectedCompanies.length} شركة</span>
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
              <CardTitle>قائمة الشركات ({filteredCompanies.length})</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
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
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا توجد شركات مسجلة</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">تحديد</th>
                      <th className="text-right p-2">اسم الشركة</th>
                      <th className="text-right p-2">اسم المدير</th>
                      <th className="text-right p-2">رقم الهاتف</th>
                      <th className="text-right p-2">عدد الشاحنات</th>
                      <th className="text-right p-2">التأمين</th>
                      <th className="text-right p-2">تاريخ التسجيل</th>
                      <th className="text-right p-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCompanies([...selectedCompanies, company.id]);
                              } else {
                                setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 font-medium">{company.company_name}</td>
                        <td className="p-2">{company.manager_name}</td>
                        <td className="p-2">{company.phone_number}</td>
                        <td className="p-2">{company.truck_count}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            company.has_insurance 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.has_insurance ? 'يوجد' : 'لا يوجد'}
                          </span>
                        </td>
                        <td className="p-2">{new Date(company.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteCompany(company.id)}
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
      </div>
    </div>
  );
};

export default CompaniesManagement;