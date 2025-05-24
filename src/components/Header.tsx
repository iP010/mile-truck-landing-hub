
import React from 'react';
import { Truck, Menu } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-green-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mile Truck
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              الرئيسية
            </a>
            <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              الخدمات
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              من نحن
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              اتصل بنا
            </a>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
              تسجيل الدخول
            </Button>
          </nav>

          <div className="md:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
