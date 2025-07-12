import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Edit, Trash2, Plus, Download, Settings, BarChart3, Calculator, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
  created_at: string;
}

const NewPricingManagement = () => {
  const { admin } = useAdmin();
  const [companies, setCompanies] = useState<CompanyPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    membership_number: '',
    insurance_type: ''
  });

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
        .from('companies_pricing')
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

  const addCompany = async () => {
    if (!newCompany.company_name || !newCompany.membership_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
        .insert({
          company_name: newCompany.company_name,
          membership_number: newCompany.membership_number,
          insurance_type: newCompany.insurance_type || null,
          is_editing_enabled: true
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('رقم العضوية موجود بالفعل');
        } else {
          throw error;
        }
        return;
      }

      toast.success('تم إضافة الشركة بنجاح');
      setNewCompany({ company_name: '', membership_number: '', insurance_type: '' });
      setShowAddForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('خطأ في إضافة الشركة');
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
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

  const toggleEditingStatus = async (companyId: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
        .update({ is_editing_enabled: !currentStatus })
        .eq('id', companyId);

      if (error) throw error;

      toast.success('تم تحديث حالة التحرير بنجاح');
      fetchCompanies();
    } catch (error) {
      console.error('Error updating editing status:', error);
      toast.error('خطأ في تحديث حالة التحرير');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCompanies.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedCompanies.length} شركة؟`)) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
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
      ['اسم الشركة', 'رقم العضوية', 'نوع التأمين', 'حالة التحرير', 'تاريخ الإنشاء'],
      ...filteredCompanies.map(company => [
        company.company_name,
        company.membership_number,
        company.insurance_type || 'غير محدد',
        company.is_editing_enabled ? 'مفعل' : 'معطل',
        new Date(company.created_at).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pricing_companies_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.membership_number.includes(searchTerm)
  );

  const toggleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(company => company.id));
    }
  };

  const managementOptions = [
    {
      title: 'أسعار الرحلات',
      description: 'إدارة أسعار الرحلات للشركات',
      icon: BarChart3,
      color: 'bg-green-500',
      route: '/trip-pricing'
    },
    {
      title: 'حاسبة الأسعار',
      description: 'حساب تكلفة الرحلات',
      icon: Calculator,
      color: 'bg-orange-500',
      route: '/price-calculator'
    },
    {
      title: 'تقارير الأسعار',
      description: 'عرض وتصدير التقارير',
      icon: Settings,
      color: 'bg-red-500',
      route: '/pricing-reports'
    },
    {
      title: 'إعدادات الأسعار',
      description: 'إعدادات النظام',
      icon: Settings,
      color: 'bg-purple-500',
      route: '/pricing-settings'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للوحة التقارير
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الأسعار</h1>
          <p className="text-muted-foreground">إدارة أسعار الرحلات والشركات</p>
        </div>

        {/* Management Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {managementOptions.map((option, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{option.title}</CardTitle>
                    <CardDescription className="text-sm">{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Search and Tools */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>البحث والأدوات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم أو رقم العضوية..."
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
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة شركة جديدة
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

        {/* Add Company Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة شركة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الشركة *</label>
                  <Input
                    value={newCompany.company_name}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="أدخل اسم الشركة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم العضوية *</label>
                  <Input
                    value={newCompany.membership_number}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, membership_number: e.target.value }))}
                    placeholder="أدخل رقم العضوية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع التأمين</label>
                  <Input
                    value={newCompany.insurance_type}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, insurance_type: e.target.value }))}
                    placeholder="أدخل نوع التأمين (اختياري)"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCompany}>
                  إضافة الشركة
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Companies List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>شركات الأسعار ({filteredCompanies.length})</CardTitle>
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
                      <th className="text-right p-2">رقم العضوية</th>
                      <th className="text-right p-2">نوع التأمين</th>
                      <th className="text-right p-2">حالة التحرير</th>
                      <th className="text-right p-2">تاريخ الإنشاء</th>
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
                        <td className="p-2">
                          <Badge variant="secondary">{company.membership_number}</Badge>
                        </td>
                        <td className="p-2">
                          {company.insurance_type ? (
                            <Badge variant="outline">{company.insurance_type}</Badge>
                          ) : (
                            <span className="text-muted-foreground">غير محدد</span>
                          )}
                        </td>
                        <td className="p-2">
                          <Badge variant={company.is_editing_enabled ? "default" : "destructive"}>
                            {company.is_editing_enabled ? "مفعل" : "معطل"}
                          </Badge>
                        </td>
                        <td className="p-2">{new Date(company.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={company.is_editing_enabled ? "destructive" : "default"}
                              onClick={() => toggleEditingStatus(company.id, company.is_editing_enabled)}
                            >
                              {company.is_editing_enabled ? "تعطيل" : "تفعيل"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/pricing/${company.membership_number}`, '_blank')}
                            >
                              عرض الأسعار
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteCompany(company.id)}
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

export default NewPricingManagement;