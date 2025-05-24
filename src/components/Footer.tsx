
import React from 'react';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="bg-green-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Mile Truck</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              منصة الشحن الرائدة في المملكة العربية السعودية. نربط السائقين مع أصحاب البضائع لتوفير خدمات شحن موثوقة وآمنة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">الخدمات</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">شحن البضائع</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">النقل السريع</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">الشحن الدولي</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">تخزين البضائع</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">التأمين</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">روابط مهمة</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">من نحن</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">كيف نعمل</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">الأسعار</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">الشروط والأحكام</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-400">+966 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-gray-400">info@miletruck.sa</span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="h-5 w-5 text-green-400 mt-1" />
                <span className="text-gray-400">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Mile Truck. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">الشروط والأحكام</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">ملفات تعريف الارتباط</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
