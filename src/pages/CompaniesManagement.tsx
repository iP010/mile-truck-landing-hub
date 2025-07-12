
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Copy, Download, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    manager_name: "",
    phone_number: "",
    whatsapp_number: "",
    truck_count: "",
    has_insurance: false,
    insurance_type: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
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

  const addCompany = async () => {
    if (!newCompany.company_name || !newCompany.manager_name || !newCompany.phone_number) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .insert({
          company_name: newCompany.company_name,
          manager_name: newCompany.manager_name,
          phone_number: newCompany.phone_number,
          whatsapp_number: newCompany.whatsapp_number,
          truck_count: parseInt(newCompany.truck_count),
          has_insurance: newCompany.has_insurance,
          insurance_type: newCompany.insurance_type || null
        });

      if (error) throw error;

      toast.success('تم إضافة الشركة بنجاح');
      setNewCompany({
        company_name: "",
        manager_name: "",
        phone_number: "",
        whatsapp_number: "",
        truck_count: "",
        has_insurance: false,
        insurance_type: ""
      });
      setShowAddForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('خطأ في إضافة الشركة');
    }
  };

  const updateCompany = async () => {
    if (!editingCompany) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: newCompany.company_name,
          manager_name: newCompany.manager_name,
          phone_number: newCompany.phone_number,
          whatsapp_number: newCompany.whatsapp_number,
          truck_count: parseInt(newCompany.truck_count),
          has_insurance: newCompany.has_insurance,
          insurance_type: newCompany.insurance_type || null
        })
        .eq('id', editingCompany.id);

      if (error) throw error;

      toast.success('تم تحديث الشركة بنجاح');
      setEditingCompany(null);
      setNewCompany({
        company_name: "",
        manager_name: "",
        phone_number: "",
        whatsapp_number: "",
        truck_count: "",
        has_insurance: false,
        insurance_type: ""
      });
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('خطأ في تحديث الشركة');
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
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('خطأ في حذف الشركة');
    }
  };

  const copyRegistrationLink = () => {
    const link = `${window.location.origin}/company-registration`;
    navigator.clipboard.writeText(link);
    toast.success('تم نسخ رابط التسجيل');
  };

  const startEdit = (company: Company) => {
    setEditingCompany(company);
    setNewCompany({
      company_name: company.company_name,
      manager_name: company.manager_name,
      phone_number: company.phone_number,
      whatsapp_number: company.whatsapp_number,
      truck_count: company.truck_count.toString(),
      has_insurance: company.has_insurance,
      insurance_type: company.insurance_type || ""
    });
  };

  const cancelEdit = () => {
    setEditingCompany(null);
    setShowAddForm(false);
    setNewCompany({
      company_name: "",
      manager_name: "",
      phone_number: "",
      whatsapp_number: "",
      truck_count: "",
      has_insurance: false,
      insurance_type: ""
    });
  };

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    toast.info(`تصدير البيانات بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone_number.includes(searchTerm)
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
                <h1 className="text-3xl font-bold text-gray-800">إدارة الشركات</h1>
              </div>
              
              {/* Action buttons */}
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
                <Button 
                  variant="outline"
                  onClick={copyRegistrationLink}
                  className="flex items-center gap-2"
                >
                  <Link className="h-4 w-4" />
                  نسخ رابط التسجيل
                </Button>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  <Plus className="h-4 w-4" />
                  إضافة شركة
                </Button>
              </div>
            </div>

            {/* Add/Edit Company Form */}
            {(showAddForm || editingCompany) && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingCompany ? 'تعديل الشركة' : 'إضافة شركة جديدة'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">اسم الشركة *</label>
                      <Input
                        value={newCompany.company_name}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="أدخل اسم الشركة"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">اسم المسؤول *</label>
                      <Input
                        value={newCompany.manager_name}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, manager_name: e.target.value }))}
                        placeholder="أدخل اسم المسؤول"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الجوال *</label>
                      <Input
                        value={newCompany.phone_number}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, phone_number: e.target.value }))}
                        placeholder="أدخل رقم الجوال"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الواتساب</label>
                      <Input
                        value={newCompany.whatsapp_number}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                        placeholder="أدخل رقم الواتساب"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الشاحنات</label>
                      <Input
                        type="number"
                        value={newCompany.truck_count}
                        onChange={(e) => setNewCompany(prev => ({ ...prev, truck_count: e.target.value }))}
                        placeholder="أدخل عدد الشاحنات"
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
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="has_insurance"
                      checked={newCompany.has_insurance}
                      onChange={(e) => setNewCompany(prev => ({ ...prev, has_insurance: e.target.checked }))}
                    />
                    <label htmlFor="has_insurance" className="text-sm">لديها تأمين</label>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingCompany ? updateCompany : addCompany}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {editingCompany ? 'تحديث الشركة' : 'إضافة الشركة'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن شركة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                إجمالي الشركات: {companies.length}
              </Badge>
            </div>

            {/* Companies List */}
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
                                  onClick={() => startEdit(company)}
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
