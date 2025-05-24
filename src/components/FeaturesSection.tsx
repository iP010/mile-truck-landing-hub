
import React from 'react';
import { Shield, Clock, MapPin, Smartphone, CreditCard, HeadphonesIcon } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'أمان مضمون',
      description: 'تأمين شامل على جميع الشحنات مع ضمان الوصول الآمن',
      color: 'bg-blue-500'
    },
    {
      icon: Clock,
      title: 'توصيل سريع',
      description: 'شبكة واسعة من السائقين لضمان التوصيل في الوقت المحدد',
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'تغطية شاملة',
      description: 'نغطي جميع مناطق ومدن المملكة العربية السعودية',
      color: 'bg-purple-500'
    },
    {
      icon: Smartphone,
      title: 'تطبيق ذكي',
      description: 'تطبيق سهل الاستخدام لتتبع الشحنات والتواصل المباشر',
      color: 'bg-orange-500'
    },
    {
      icon: CreditCard,
      title: 'دفع آمن',
      description: 'طرق دفع متعددة وآمنة مع إمكانية الدفع عند الاستلام',
      color: 'bg-red-500'
    },
    {
      icon: HeadphonesIcon,
      title: 'دعم 24/7',
      description: 'فريق دعم فني متاح على مدار الساعة لمساعدتك',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            لماذا تختار Mile Truck؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نوفر لك أفضل خدمات الشحن مع ضمان الجودة والأمان والسرعة في التوصيل
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
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
