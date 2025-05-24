
import React from 'react';
import { Shield, Clock, MapPin } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'آمان وموثوقية',
      description: 'نضمن لك خدمة آمنة مع سائقين معتمدين ومؤهلين'
    },
    {
      icon: Clock,
      title: 'توصيل سريع',
      description: 'نوفر خدمات توصيل سريعة في الأوقات المحددة'
    },
    {
      icon: MapPin,
      title: 'تغطية شاملة',
      description: 'نغطي جميع مناطق المملكة العربية السعودية'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-saudi">
          لماذا تختار Mile Truck؟
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3 font-saudi">
                {feature.title}
              </h4>
              <p className="text-gray-600">
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
