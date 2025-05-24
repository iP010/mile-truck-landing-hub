
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types/language';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; abbreviation: string }[] = [
    { code: 'ar', name: 'العربية', abbreviation: 'AR' },
    { code: 'en', name: 'English', abbreviation: 'EN' },
    { code: 'ur', name: 'اردو', abbreviation: 'UR' },
    { code: 'hi', name: 'हिंदी', abbreviation: 'HI' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
        <Globe size={16} />
        <span className="font-semibold text-primary">
          {languages.find(l => l.code === language)?.abbreviation}
        </span>
      </button>
      
      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 ${
              language === lang.code ? 'bg-primary/10 text-primary' : 'text-gray-700'
            }`}
          >
            <span className="font-semibold text-primary w-8">
              {lang.abbreviation}
            </span>
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
