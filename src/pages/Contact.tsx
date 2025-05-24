import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';

const Contact = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const contactDetails = {
    phone: '+1234567890',
    whatsapp: '+1234567890',
    email: 'info@example.com',
    address: '123 Main Street, City, Country',
    social: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  };

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
                    {t.contact.phone}: {contactDetails.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.whatsapp}: {contactDetails.whatsapp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.email}: {contactDetails.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-700">
                    {t.contact.address}: {contactDetails.address}
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
                  href={contactDetails.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href={contactDetails.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href={contactDetails.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href={contactDetails.social.linkedin}
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
