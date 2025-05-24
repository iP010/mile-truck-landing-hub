
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, MessageCircle, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT_INFO } from '../utils/constants';

const Footer = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Mile Truck</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors"
              >
                <Phone size={16} />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors"
              >
                <MessageCircle size={16} />
                {t.contact.whatsapp}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isRTL ? 'خدماتنا' : 'Our Services'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/drivers" className="text-gray-300 hover:text-primary transition-colors">
                  {t.nav.driverRegistration}
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-primary transition-colors">
                  {t.nav.companyRegistration}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <a
                href={CONTACT_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
            
            <p className="text-gray-400 text-sm">
              © 2024 Mile Truck. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
