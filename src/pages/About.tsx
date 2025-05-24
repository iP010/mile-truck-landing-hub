
import React from 'react';
import { Shield, Users, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const features = [
    {
      icon: Shield,
      title: isRTL ? 'خدمات موثوقة' : 'Reliable Services',
      description: isRTL 
        ? 'نقدم خدمات وساطة شحن موثوقة ومضمونة لجميع عملائنا'
        : 'We provide reliable and guaranteed shipping brokerage services for all our clients'
    },
    {
      icon: Users,
      title: isRTL ? 'فريق متخصص' : 'Expert Team',
      description: isRTL
        ? 'فريق عمل متخصص في مجال النقل والشحن مع خبرة واسعة'
        : 'Specialized team in transportation and shipping with extensive experience'
    },
    {
      icon: TrendingUp,
      title: isRTL ? 'نمو مستمر' : 'Continuous Growth',
      description: isRTL
        ? 'نساعد عملائنا في تنمية أعمالهم وزيادة أرباحهم بشكل مستمر'
        : 'We help our clients grow their business and increase their profits continuously'
    },
    {
      icon: Award,
      title: isRTL ? 'جودة عالية' : 'High Quality',
      description: isRTL
        ? 'نلتزم بتقديم أعلى معايير الجودة في جميع خدماتنا'
        : 'We are committed to providing the highest quality standards in all our services'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.about.title}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="prose prose-lg max-w-none">
              <p className={`text-gray-700 leading-relaxed text-lg mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.about.content}
              </p>
              
              <div className={`text-gray-700 leading-relaxed space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? (
                  <>
                    <p>
                      تأسست شركة Mile Truck لتكون الجسر الذي يربط بين أصحاب الشاحنات وأصحاب البضائع، 
                      حيث نسعى لتوفير منصة موثوقة وآمنة تضمن حقوق جميع الأطراف.
                    </p>
                    <p>
                      نحن نفهم التحديات التي يواجهها سائقو الشاحنات وأصحاب الشركات في العثور على 
                      فرص نقل مناسبة ومربحة، ولذلك نعمل على تسهيل هذه العملية من خلال شبكتنا الواسعة 
                      من العملاء والشراكات الاستراتيجية.
                    </p>
                    <p>
                      رؤيتنا هي أن نصبح الشركة الرائدة في مجال وساطة الشحن في المنطقة، ونساهم في 
                      تطوير قطاع النقل والخدمات اللوجستية بما يخدم الاقتصاد الوطني.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Mile Truck was founded to be the bridge that connects truck owners with cargo owners, 
                      where we strive to provide a reliable and secure platform that guarantees the rights of all parties.
                    </p>
                    <p>
                      We understand the challenges faced by truck drivers and company owners in finding 
                      suitable and profitable transportation opportunities, so we work to facilitate this process 
                      through our extensive network of clients and strategic partnerships.
                    </p>
                    <p>
                      Our vision is to become the leading company in the field of shipping brokerage in the region, 
                      and contribute to the development of the transportation and logistics sector in service of the national economy.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-gray-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-primary rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'انضم إلينا اليوم' : 'Join Us Today'}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {isRTL 
                ? 'سجل معنا الآن واستفد من خدماتنا المتميزة في وساطة الشحن'
                : 'Register with us now and benefit from our excellent shipping brokerage services'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/drivers"
                className="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                {isRTL ? 'تسجيل السائقين' : 'Driver Registration'}
              </a>
              <a
                href="/companies"
                className="bg-white/10 border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/20 transition-colors"
              >
                {isRTL ? 'تسجيل الشركات' : 'Company Registration'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
