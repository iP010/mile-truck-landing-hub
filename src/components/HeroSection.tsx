
import React from 'react';
import { Button } from './ui/button';
import { Play, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end mb-4">
              <div className="flex items-center space-x-1 space-x-reverse bg-green-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-green-600 fill-current" />
                <span className="text-sm text-green-800 font-medium">الأفضل في المملكة</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              منصة الشحن
              <span className="text-green-600 block">الأكثر موثوقية</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              نربط السائقين مع أصحاب البضائع لتوفير خدمات شحن آمنة وسريعة في جميع أنحاء المملكة العربية السعودية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-xl">
                ابدأ الشحن الآن
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg rounded-xl">
                <Play className="h-5 w-5 ml-2" />
                شاهد كيف يعمل
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end mt-8 space-x-8 space-x-reverse">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">+10,000</div>
                <div className="text-sm text-gray-600">شحنة مكتملة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">+5,000</div>
                <div className="text-sm text-gray-600">سائق نشط</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">رضا العملاء</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="bg-green-600 text-white p-4 rounded-xl mb-6">
                <h3 className="text-xl font-bold mb-2">طلب شحن جديد</h3>
                <p className="text-green-100">من الرياض إلى جدة</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">نوع البضاعة:</span>
                  <span className="font-medium">إلكترونيات</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الوزن:</span>
                  <span className="font-medium">500 كيلو</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">السعر:</span>
                  <span className="font-bold text-green-600 text-xl">2,500 ريال</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl">
                قبول الطلب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
