
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT_INFO } from '../utils/constants';
import Header from '../components/Header';

const Contact = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
            {t.contact.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.phone}: {CONTACT_INFO.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.whatsapp}: {CONTACT_INFO.whatsapp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.email}: {CONTACT_INFO.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.address}: {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.contact.social}
              </h2>
              <div className="flex gap-4">
                <a
                  href={CONTACT_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href={CONTACT_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href={CONTACT_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href={CONTACT_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
