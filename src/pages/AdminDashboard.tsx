
import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, BarChart3, Truck, MapPin, Calculator } from 'lucide-react';

const AdminDashboard = () => {
  const { admin } = useAdmin();

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                alt="Mile Truck Logo" 
                className="h-10 w-auto mr-4"
              />
              <h1 className="text-2xl font-bold text-foreground">لوحة التقارير</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link to="/admin-profile">الملف الشخصي</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">الصفحة الرئيسية</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التقارير</h1>
          <p className="text-muted-foreground">مرحباً {admin.username}، اختر الخيار المناسب للإدارة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>خيارات تسجيل السائقين</CardTitle>
                  <CardDescription>إدارة الجنسيات وأنواع الشاحنات والمركبات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/driver-registration-options">فتح خيارات السائقين</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>خيارات تسجيل الشركات</CardTitle>
                  <CardDescription>إدارة أنواع التأمين والمدن</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/company-registration-options">فتح خيارات الشركات</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إدارة السائقين</CardTitle>
                  <CardDescription>عرض وتعديل وحذف بيانات السائقين المسجلين</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/drivers-management">فتح إدارة السائقين</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إدارة الشركات</CardTitle>
                  <CardDescription>عرض وتعديل وحذف بيانات الشركات المسجلة</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/companies-management">فتح إدارة الشركات</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إدارة الأسعار</CardTitle>
                  <CardDescription>إدارة أسعار الرحلات والشركات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/new-pricing-management">فتح إدارة الأسعار</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>حاسبة الأسعار</CardTitle>
                  <CardDescription>حساب تكلفة الرحلات مع جميع الرسوم</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/price-calculator">فتح الحاسبة</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>إجمالي السائقين</CardDescription>
              <CardTitle className="text-2xl text-primary">152</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>إجمالي الشركات</CardDescription>
              <CardTitle className="text-2xl text-primary">28</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>الرحلات النشطة</CardDescription>
              <CardTitle className="text-2xl text-primary">89</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>آخر تحديث</CardDescription>
              <CardTitle className="text-lg">منذ دقائق</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
