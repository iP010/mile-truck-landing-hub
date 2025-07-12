
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
import DriverRegistrationToggle from "@/components/DriverRegistrationToggle";
import CompanyRegistrationToggle from "@/components/CompanyRegistrationToggle";

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
    route: "/companies-management"
  },
  {
    title: "إدارة السائقين",
    description: "إضافة وتعديل وحذف السائقين",
    icon: UserCog,
    color: "bg-indigo-500",
    route: "/drivers-management"
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
  const navigate = useNavigate();

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    toast.info(`تصدير البيانات بتنسيق ${format.toUpperCase()} قيد التطوير`);
  };

  const handleNavigation = (option: typeof quickNavigationOptions[0]) => {
    if (option.isLogout) {
      navigate(option.route);
    } else {
      navigate(option.route);
    }
  };

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
              </div>
            </div>

            {/* Registration Controls */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">إدارة التسجيل</h2>
              <DriverRegistrationToggle />
              <CompanyRegistrationToggle />
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
