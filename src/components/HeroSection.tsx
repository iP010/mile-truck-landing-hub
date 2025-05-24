
import React from 'react';
import { Button } from './ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-saudi">
          وسيط شحن موثوق
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          نربط بين السائقين والشركات لتوفير خدمات شحن آمنة وموثوقة في جميع أنحاء المملكة
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
            ابدأ الآن
          </Button>
          <Button variant="outline" className="px-8 py-3 text-lg">
            اعرف المزيد
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
