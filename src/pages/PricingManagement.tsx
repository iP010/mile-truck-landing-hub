import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, Download, Upload, Settings, BarChart3, Calculator, MapPin, Home, LayoutDashboard, UserCog, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
  created_at: string;
}

const quickNavigationOptions = [
  {
    title: "الصفحة الرئيسية",
    description: "العودة إلى الصفحة الرئيسية",
    icon: Home,
    color: "bg-blue-500",
    route: "/"
  },
  {
    title: "لوحة التحكم",
    description: "عرض الإحصائيات والتقارير",
    icon: LayoutDashboard,
    color: "bg-green-500",
    route: "/dashboard"
  },
  {
    title: "لوحة الإدارة",
    description: "إدارة النظام والمستخدمين",
    icon: UserCog,
    color: "bg-purple-500",
    route: "/admin"
  },
  {
    title: "تسجيل الخروج",
    description: "إنهاء الجلسة الحالية",
    icon: LogOut,
    color: "bg-red-500",
    route: "/admin-login",
    isLogout: true
  }
];

const managementOptions = [
  {
    title: "إدارة الشركات",
    description: "إضافة وتعديل وحذف الشركات",
    icon: FileText,
    color: "bg-blue-500",
    route: "/pricing-management"
  },
  {
    title: "أسعار الرحلات", 
    description: "إدارة أسعار الرحلات للشركات",
    icon: BarChart3,
    color: "bg-green-500",
    route: "/trip-pricing"
  },
  {
    title: "إدارة المدن والشاحنات",
    description: "إضافة وتعديل المدن وأنواع الشاحنات",
    icon: MapPin,
    color: "bg-purple-500",
    route: "/cities-vehicles-management"
  },
  {
    title: "حاسبة الأسعار",
    description: "حساب تكلفة الرحلات",
    icon: Calculator,
    color: "bg-orange-500",
    route: "/price-calculator"
  },
  {
    title: "تقارير الأسعار",
    description: "عرض وتصدير التقارير",
    icon: Settings,
    color: "bg-red-500",
    route: "/pricing-reports"
  }
];

export default function PricingManagement() {
  const [companies, setCompanies] = useState<CompanyPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    membership_number: "",
    insurance_type: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies_pricing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('خطأ في تحميل البيانات');
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
      setNewCompany({ company_name: "", membership_number: "", insurance_type: "" });
      setShowAddForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('خطأ في إضافة الشركة');
    }
  };

  const toggleEditingStatus = async (companyId: string, currentStatus: boolean) => {
    try {
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

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.membership_number.includes(searchTerm)
  );

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    // Implementation for export functionality
    toast.info(`تصدير البيانات بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const handleNavigation = (option: typeof quickNavigationOptions[0]) => {
    if (option.isLogout) {
      // Handle logout logic here if needed
      navigate(option.route);
    } else {
      navigate(option.route);
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-800">إدارة أسعار الرحلات</h1>
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
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  <Plus className="h-4 w-4" />
                  إضافة شركة
                </Button>
              </div>
            </div>

            {/* Quick Navigation Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">التنقل السريع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickNavigationOptions.map((option, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => handleNavigation(option)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <option.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-800">
                            {option.title}
                          </CardTitle>
                          <p className="text-xs text-gray-600 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Management Options Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">إدارة الأسعار</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {managementOptions.map((option, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => navigate(option.route)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${option.color}`}>
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {option.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add Company Form */}
            {showAddForm && (
              <Card>
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
                    <Button onClick={addCompany} className="bg-green-500 hover:bg-green-600">
                      إضافة الشركة
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
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
                          <th className="text-right p-3">رقم العضوية</th>
                          <th className="text-right p-3">نوع التأمين</th>
                          <th className="text-right p-3">حالة التحرير</th>
                          <th className="text-right p-3">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map((company) => (
                          <tr key={company.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{company.company_name}</td>
                            <td className="p-3">
                              <Badge variant="secondary">{company.membership_number}</Badge>
                            </td>
                            <td className="p-3">
                              {company.insurance_type ? (
                                <Badge variant="outline">{company.insurance_type}</Badge>
                              ) : (
                                <span className="text-gray-400">غير محدد</span>
                              )}
                            </td>
                            <td className="p-3">
                              <Badge variant={company.is_editing_enabled ? "default" : "destructive"}>
                                {company.is_editing_enabled ? "مفعل" : "معطل"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/pricing/${company.membership_number}`)}
                                >
                                  عرض الأسعار
                                </Button>
                                <Button
                                  variant={company.is_editing_enabled ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => toggleEditingStatus(company.id, company.is_editing_enabled)}
                                >
                                  {company.is_editing_enabled ? "تعطيل التحرير" : "تفعيل التحرير"}
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
