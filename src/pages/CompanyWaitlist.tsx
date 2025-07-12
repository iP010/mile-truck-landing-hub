
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface CompanyWaitlistItem {
  id: string;
  company_name: string;
  manager_name: string;
  phone_number: string;
  whatsapp_number: string;
  created_at: string;
}

export default function CompanyWaitlist() {
  const [waitlist, setWaitlist] = useState<CompanyWaitlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('company_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaitlist(data || []);
    } catch (error) {
      console.error('Error fetching company waitlist:', error);
      toast.error('خطأ في تحميل قائمة انتظار الشركات');
    } finally {
      setLoading(false);
    }
  };

  const deleteFromWaitlist = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة من قائمة الانتظار؟')) return;

    try {
      const { error } = await supabase
        .from('company_waitlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف الشركة من قائمة الانتظار');
      fetchWaitlist();
    } catch (error) {
      console.error('Error deleting from waitlist:', error);
      toast.error('خطأ في حذف الشركة من قائمة الانتظار');
    }
  };

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    toast.info(`تصدير البيانات بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const filteredWaitlist = waitlist.filter(item =>
    item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone_number.includes(searchTerm)
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
                <Button
                  variant="outline"
                  onClick={() => navigate('/companies-management')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة
                </Button>
                <img 
                  src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                  alt="Mile Truck Logo" 
                  className="h-12 w-auto"
                />
                <h1 className="text-3xl font-bold text-gray-800">قائمة انتظار الشركات</h1>
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

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في قائمة الانتظار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                إجمالي الشركات في الانتظار: {waitlist.length}
              </Badge>
            </div>

            {/* Waitlist */}
            <Card>
              <CardHeader>
                <CardTitle>الشركات في قائمة الانتظار</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredWaitlist.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا توجد شركات في قائمة الانتظار</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">اسم الشركة</th>
                          <th className="text-right p-3">اسم المسؤول</th>
                          <th className="text-right p-3">رقم الجوال</th>
                          <th className="text-right p-3">رقم الواتساب</th>
                          <th className="text-right p-3">تاريخ التسجيل</th>
                          <th className="text-right p-3">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWaitlist.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{item.company_name}</td>
                            <td className="p-3">{item.manager_name}</td>
                            <td className="p-3">{item.phone_number}</td>
                            <td className="p-3">{item.whatsapp_number}</td>
                            <td className="p-3">
                              {new Date(item.created_at).toLocaleDateString('ar-SA')}
                            </td>
                            <td className="p-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteFromWaitlist(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
