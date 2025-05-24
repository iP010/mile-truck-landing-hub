
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getArabicCountries = (t: any) => [
  { code: 'SA', name: t.phoneInput.countries.saudi, flag: '🇸🇦', dialCode: '+966', minLength: 9, maxLength: 9 },
  { code: 'AE', name: t.phoneInput.countries.uae, flag: '🇦🇪', dialCode: '+971', minLength: 9, maxLength: 9 },
  { code: 'QA', name: t.phoneInput.countries.qatar, flag: '🇶🇦', dialCode: '+974', minLength: 8, maxLength: 8 },
  { code: 'KW', name: t.phoneInput.countries.kuwait, flag: '🇰🇼', dialCode: '+965', minLength: 8, maxLength: 8 },
  { code: 'BH', name: t.phoneInput.countries.bahrain, flag: '🇧🇭', dialCode: '+973', minLength: 8, maxLength: 8 },
  { code: 'OM', name: t.phoneInput.countries.oman, flag: '🇴🇲', dialCode: '+968', minLength: 8, maxLength: 8 },
  { code: 'JO', name: t.phoneInput.countries.jordan, flag: '🇯🇴', dialCode: '+962', minLength: 9, maxLength: 9 },
  { code: 'LB', name: t.phoneInput.countries.lebanon, flag: '🇱🇧', dialCode: '+961', minLength: 8, maxLength: 8 },
  { code: 'EG', name: t.phoneInput.countries.egypt, flag: '🇪🇬', dialCode: '+20', minLength: 10, maxLength: 11 },
  { code: 'MA', name: t.phoneInput.countries.morocco, flag: '🇲🇦', dialCode: '+212', minLength: 9, maxLength: 9 },
  { code: 'IQ', name: t.phoneInput.countries.iraq, flag: '🇮🇶', dialCode: '+964', minLength: 10, maxLength: 10 },
  { code: 'SY', name: t.phoneInput.countries.syria, flag: '🇸🇾', dialCode: '+963', minLength: 9, maxLength: 9 },
  { code: 'YE', name: t.phoneInput.countries.yemen, flag: '🇾🇪', dialCode: '+967', minLength: 9, maxLength: 9 },
  { code: 'DZ', name: t.phoneInput.countries.algeria, flag: '🇩🇿', dialCode: '+213', minLength: 9, maxLength: 9 },
  { code: 'TN', name: t.phoneInput.countries.tunisia, flag: '🇹🇳', dialCode: '+216', minLength: 8, maxLength: 8 },
  { code: 'LY', name: t.phoneInput.countries.libya, flag: '🇱🇾', dialCode: '+218', minLength: 9, maxLength: 9 },
  { code: 'SD', name: t.phoneInput.countries.sudan, flag: '🇸🇩', dialCode: '+249', minLength: 9, maxLength: 9 },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  className = ""
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  const ARABIC_COUNTRIES = getArabicCountries(t);
  
  const [selectedCountry, setSelectedCountry] = useState(ARABIC_COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Extract phone number without country code
  const phoneNumber = value.startsWith(selectedCountry.dialCode) 
    ? value.replace(selectedCountry.dialCode, '') 
    : value.replace(/^\+\d+/, '');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCountrySelect = (country: typeof ARABIC_COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const fullNumber = country.dialCode + cleanNumber;
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    
    // Check length constraints
    if (inputValue.length <= selectedCountry.maxLength) {
      const fullNumber = selectedCountry.dialCode + inputValue;
      onChange(fullNumber);
    }
  };

  const getValidationMessage = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length === 0) return '';
    if (cleanNumber.length < selectedCountry.minLength) {
      return t.phoneInput.validation.tooShort.replace('{min}', selectedCountry.minLength.toString());
    }
    if (cleanNumber.length > selectedCountry.maxLength) {
      return t.phoneInput.validation.tooLong.replace('{max}', selectedCountry.maxLength.toString());
    }
    return '';
  };

  const validationMessage = getValidationMessage();
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const isValid = cleanNumber.length >= selectedCountry.minLength && cleanNumber.length <= selectedCountry.maxLength;

  return (
    <div className={`space-y-2 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          {/* Phone Input */}
          <div className="relative flex-1">
            <div className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={cleanNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder || t.phoneInput.placeholder}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 ${isRTL ? 'rounded-r-md' : 'rounded-l-md'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${isRTL ? 'text-right' : 'text-left'} ${
                error || (validationMessage && !isValid) ? 'border-red-500' : ''
              }`}
              dir="ltr"
            />
          </div>

          {/* Country Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 border border-gray-300 ${isRTL ? 'border-r-0 rounded-l-md' : 'border-l-0 rounded-r-md'} bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
            >
              <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <span className="text-lg">{selectedCountry.flag}</span>
            </button>

            {isDropdownOpen && (
              <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto`}>
                {ARABIC_COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full px-3 py-2 ${isRTL ? 'text-right' : 'text-left'} hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}
                  >
                    <span className="text-sm text-gray-600">{country.name}</span>
                    <span className="text-sm font-medium">{country.dialCode}</span>
                    <span className="text-lg">{country.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Validation Message */}
        {(validationMessage || error) && (
          <p className={`text-sm text-red-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {error || validationMessage}
          </p>
        )}

        {/* Success Message */}
        {cleanNumber.length > 0 && isValid && !error && (
          <p className={`text-sm text-green-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.phoneInput.validation.valid}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
