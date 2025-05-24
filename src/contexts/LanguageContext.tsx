
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translation } from '../types/language';
import { translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ['ar', 'en', 'ur', 'hi'];
    
    if (supportedLanguages.includes(browserLang)) {
      setLanguage(browserLang);
    } else {
      setLanguage('en'); // Default to English
    }

    // Set document direction based on language
    if (browserLang === 'ar' || browserLang === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = browserLang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = browserLang;
    }
  }, []);

  useEffect(() => {
    // Update document direction when language changes
    if (language === 'ar' || language === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
