
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <Truck className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Quote Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-100">
            <blockquote className={`text-lg md:text-xl text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              "{t.hero.quote}"
            </blockquote>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/drivers"
              className="group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Users className="w-6 h-6" />
              {t.hero.driverBtn}
            </Link>
            
            <Link
              to="/companies"
              className="group flex items-center justify-center gap-3 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Building2 className="w-6 h-6" />
              {t.hero.companyBtn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
