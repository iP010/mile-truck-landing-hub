
import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, BarChart3, Calculator, MapPin, FileText, Truck, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { admin } = useAdmin();

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const managementCards = [
    {
      title: 'إدارة السائقين',
      description: 'عرض وتعديل وحذف بيانات السائقين المسجلين',
      icon: Users,
      path: '/drivers-management',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'إدارة الشركات',
      description: 'عرض وتعديل وحذف بيانات الشركات المسجلة',
      icon: Building2,
      path: '/companies-management',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'خيارات تسجيل السائقين',
      description: 'إدارة الجنسيات وأنواع الشاحنات والمركبات',
      icon: Truck,
      path: '/driver-registration-options',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'خيارات تسجيل الشركات',
      description: 'إدارة أنواع التأمين والمدن',
      icon: Database,
      path: '/company-registration-options',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'إدارة الأسعار',
      description: 'إدارة أسعار الرحلات والشركات',
      icon: BarChart3,
      path: '/new-pricing-management',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      title: 'حاسبة الأسعار',
      description: 'حساب تكلفة الرحلات مع جميع الرسوم',
      icon: Calculator,
      path: '/price-calculator',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      title: 'إدارة المدن والمركبات',
      description: 'إضافة وتعديل المدن وأنواع المركبات',
      icon: MapPin,
      path: '/cities-vehicles-management',
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600'
    },
    {
      title: 'التقارير',
      description: 'عرض التقارير والإحصائيات التفصيلية',
      icon: FileText,
      path: '/dashboard',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-primary">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
                alt="Mile Truck Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">لوحة التقارير</h1>
                <p className="text-gray-600 mt-1">مرحباً {admin.username}، اختر الخيار المناسب للإدارة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="border-2">
                <Link to="/admin-profile" className="flex items-center gap-2">
                  <Settings size={16} />
                  الملف الشخصي
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/" className="flex items-center gap-2">
                  الصفحة الرئيسية
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">لوحة الإدارة الرئيسية</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر من الخيارات أدناه للوصول إلى الأدوات المختلفة لإدارة النظام
          </p>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {managementCards.map((card, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <CardHeader className={`${card.color} text-white p-6 group-hover:${card.hoverColor.replace('hover:', '')} transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <card.icon className="h-12 w-12 text-white/90" />
                  <div className="bg-white/20 rounded-full p-2">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <CardTitle className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {card.description}
                </CardDescription>
                <Button 
                  asChild 
                  className="w-full group-hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={card.path} className="flex items-center justify-center gap-2">
                    فتح الصفحة
                    <card.icon size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">إحصائيات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">إجمالي السائقين</p>
                  <p className="text-3xl font-bold">152</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">إجمالي الشركات</p>
                  <p className="text-3xl font-bold">28</p>
                </div>
                <Building2 className="h-12 w-12 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">الرحلات النشطة</p>
                  <p className="text-3xl font-bold">89</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">آخر تحديث</p>
                  <p className="text-xl font-bold">منذ دقائق</p>
                </div>
                <Settings className="h-12 w-12 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
