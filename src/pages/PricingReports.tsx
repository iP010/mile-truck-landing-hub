
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PricingSidebar } from "@/components/PricingSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface CompanyReport {
  id: string;
  company_name: string;
  membership_number: string;
  total_routes: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

export default function PricingReports() {
  const [reports, setReports] = useState<CompanyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState("companies");

  useEffect(() => {
    fetchReports();
  }, [selectedReportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch companies with their pricing statistics
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies_pricing')
        .select(`
          id,
          company_name,
          membership_number,
          trip_pricing (
            price
          )
        `);

      if (companiesError) throw companiesError;

      const reportsData = companiesData?.map(company => {
        const prices = company.trip_pricing?.map(tp => tp.price).filter(p => p != null) || [];
        return {
          id: company.id,
          company_name: company.company_name,
          membership_number: company.membership_number,
          total_routes: prices.length,
          avg_price: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
          min_price: prices.length > 0 ? Math.min(...prices) : 0,
          max_price: prices.length > 0 ? Math.max(...prices) : 0,
        };
      }) || [];

      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('خطأ في تحميل التقارير');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'csv' | 'excel' | 'pdf') => {
    toast.info(`تصدير التقرير بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const totalCompanies = reports.length;
  const totalRoutes = reports.reduce((sum, report) => sum + report.total_routes, 0);
  const averagePrice = reports.length > 0 
    ? reports.reduce((sum, report) => sum + report.avg_price, 0) / reports.length 
    : 0;

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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                  alt="Mile Truck Logo" 
                  className="h-12 w-auto mr-4"
                />
                <h1 className="text-3xl font-bold">تقارير الأسعار</h1>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportReport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => exportReport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => exportReport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الشركات</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">شركة مسجلة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطرق</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRoutes}</div>
                  <p className="text-xs text-muted-foreground">طريق محددة الأسعار</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط السعر</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averagePrice.toFixed(0)} ريال</div>
                  <p className="text-xs text-muted-foreground">لجميع الطرق</p>
                </CardContent>
              </Card>
            </div>

            {/* Report Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>نوع التقرير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div>
                    <Label>نوع التقرير</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger className="w-60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="companies">تقرير الشركات</SelectItem>
                        <SelectItem value="routes">تقرير الطرق</SelectItem>
                        <SelectItem value="pricing">تقرير الأسعار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies Report */}
            <Card>
              <CardHeader>
                <CardTitle>تقرير تفصيلي للشركات</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا توجد بيانات للعرض</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">اسم الشركة</th>
                          <th className="text-right p-3">رقم العضوية</th>
                          <th className="text-right p-3">عدد الطرق</th>
                          <th className="text-right p-3">متوسط السعر</th>
                          <th className="text-right p-3">أقل سعر</th>
                          <th className="text-right p-3">أعلى سعر</th>
                          <th className="text-right p-3">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{report.company_name}</td>
                            <td className="p-3">
                              <Badge variant="secondary">{report.membership_number}</Badge>
                            </td>
                            <td className="p-3">{report.total_routes}</td>
                            <td className="p-3">{report.avg_price.toFixed(0)} ريال</td>
                            <td className="p-3">{report.min_price} ريال</td>
                            <td className="p-3">{report.max_price} ريال</td>
                            <td className="p-3">
                              <Badge variant={report.total_routes > 0 ? "default" : "destructive"}>
                                {report.total_routes > 0 ? "نشط" : "غير نشط"}
                              </Badge>
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
