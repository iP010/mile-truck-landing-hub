import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, BarChart3, Truck, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const { admin } = useAdmin();

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground">مرحباً {admin.username}، اختر الخيار المناسب للإدارة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Driver Management */}
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

          {/* Companies Management */}
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

          {/* Registration Options */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إدارة خيارات التسجيل</CardTitle>
                  <CardDescription>إدارة الجنسيات، أنواع الشاحنات، والتأمين</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/cities-vehicles-management">فتح إدارة الخيارات</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pricing Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>إدارة الأسعار</CardTitle>
                  <CardDescription>إدارة أسعار الرحلات والتسعير</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/pricing-management">فتح إدارة الأسعار</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trip Pricing */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>تسعير الرحلات</CardTitle>
                  <CardDescription>إدارة أسعار الرحلات بين المدن</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/trip-pricing">فتح تسعير الرحلات</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>التقارير</CardTitle>
                  <CardDescription>عرض التقارير والإحصائيات</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/pricing-reports">فتح التقارير</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button asChild variant="outline">
            <Link to="/admin-profile">الملف الشخصي</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;