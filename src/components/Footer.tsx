
import React from 'react';
import { Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold font-saudi">Mile Truck</h3>
            </div>
            <p className="text-gray-400">
              وسيط شحن موثوق يربط بين السائقين والشركات
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 font-saudi">الخدمات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>شحن البضائع</li>
              <li>توصيل سريع</li>
              <li>نقل المواد</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 font-saudi">روابط مهمة</h4>
            <ul className="space-y-2 text-gray-400">
              <li>من نحن</li>
              <li>اتصل بنا</li>
              <li>الشروط والأحكام</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 font-saudi">تواصل معنا</h4>
            <p className="text-gray-400">
              البريد الإلكتروني: info@miletruck.sa<br />
              الهاتف: +966 50 123 4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mile Truck. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
