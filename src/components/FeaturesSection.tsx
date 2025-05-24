
import React from 'react';
import { Shield, Clock, TrendingUp, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturesSection = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const features = [
    {
      icon: Shield,
      title: isRTL ? 'خدمات موثوقة' : 'Reliable Services',
      description: isRTL 
        ? 'نقدم خدمات نقل وشحن موثوقة مع ضمان السلامة والجودة'
        : 'We provide reliable transportation and shipping services with safety and quality guarantee'
    },
    {
      icon: Clock,
      title: isRTL ? 'متاح 24/7' : 'Available 24/7',
      description: isRTL
        ? 'فريقنا متاح على مدار الساعة لخدمتكم وتلبية احتياجاتكم'
        : 'Our team is available around the clock to serve you and meet your needs'
    },
    {
      icon: TrendingUp,
      title: isRTL ? 'نمو الأعمال' : 'Business Growth',
      description: isRTL
        ? 'نساعدكم في توسيع أعمالكم وزيادة الأرباح من خلال فرص النقل المتنوعة'
        : 'We help you expand your business and increase profits through diverse transportation opportunities'
    },
    {
      icon: MapPin,
      title: isRTL ? 'تغطية شاملة' : 'Comprehensive Coverage',
      description: isRTL
        ? 'تغطية جميع أنحاء المملكة العربية السعودية ودول الخليج'
        : 'Coverage throughout Saudi Arabia and Gulf countries'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'لماذا تختار Mile Truck؟' : 'Why Choose Mile Truck?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isRTL 
              ? 'نحن نقدم أفضل خدمات الوساطة في النقل والشحن'
              : 'We provide the best brokerage services in transportation and shipping'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
