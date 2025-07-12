import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, Calculator, BarChart3, Settings } from 'lucide-react';

const NewPricingManagement = () => {
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
          <p className="text-muted-foreground">نظام شامل لإدارة أسعار الرحلات والشركات</p>
        </div>

        {/* Main Pricing Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip Pricing Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>أسعار الرحلات</CardTitle>
                  <CardDescription>إدارة أسعار الرحلات للشركات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                تحديد وإدارة أسعار الرحلات بين المدن المختلفة وحسب نوع المركبة
              </p>
              <Button asChild className="w-full">
                <Link to="/trip-pricing">
                  <Truck className="h-4 w-4 mr-2" />
                  إدارة أسعار الرحلات
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Price Calculator */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>حاسبة الأسعار</CardTitle>
                  <CardDescription>حساب تكلفة الرحلات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                حساب التكلفة الإجمالية للرحلات مع جميع الرسوم والضرائب
              </p>
              <Button asChild className="w-full">
                <Link to="/price-calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  فتح الحاسبة
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pricing Reports */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>تقارير الأسعار</CardTitle>
                  <CardDescription>عرض وتصدير التقارير</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                عرض التقارير المفصلة للأسعار وتصديرها بصيغ مختلفة
              </p>
              <Button asChild className="w-full">
                <Link to="/pricing-reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  عرض التقارير
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pricing Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إعدادات الأسعار</CardTitle>
                  <CardDescription>إعدادات النظام</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                إدارة الإعدادات العامة لنظام الأسعار والقواعد الأساسية
              </p>
              <Button asChild className="w-full">
                <Link to="/pricing-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  فتح الإعدادات
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">إحصائيات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>الشركات النشطة</CardDescription>
                <CardTitle className="text-2xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>خطوط الرحلات</CardDescription>
                <CardTitle className="text-2xl">45</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>متوسط السعر</CardDescription>
                <CardTitle className="text-2xl">850 ريال</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>آخر تحديث</CardDescription>
                <CardTitle className="text-2xl">اليوم</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPricingManagement;