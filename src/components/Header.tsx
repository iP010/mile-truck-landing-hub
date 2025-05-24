
import React from 'react';
import { Truck } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 font-saudi">
              Mile Truck
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-gray-700 hover:text-primary transition-colors">
              الرئيسية
            </a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors">
              الخدمات
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
              من نحن
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">
              تواصل معنا
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
