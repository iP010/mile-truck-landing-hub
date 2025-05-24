
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

const ARABIC_COUNTRIES = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦', dialCode: '+966', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪', dialCode: '+971', minLength: 9, maxLength: 9 },
  { code: 'QA', name: 'قطر', flag: '🇶🇦', dialCode: '+974', minLength: 8, maxLength: 8 },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼', dialCode: '+965', minLength: 8, maxLength: 8 },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭', dialCode: '+973', minLength: 8, maxLength: 8 },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲', dialCode: '+968', minLength: 8, maxLength: 8 },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴', dialCode: '+962', minLength: 9, maxLength: 9 },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧', dialCode: '+961', minLength: 8, maxLength: 8 },
  { code: 'EG', name: 'مصر', flag: '🇪🇬', dialCode: '+20', minLength: 10, maxLength: 11 },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦', dialCode: '+212', minLength: 9, maxLength: 9 },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶', dialCode: '+964', minLength: 10, maxLength: 10 },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾', dialCode: '+963', minLength: 9, maxLength: 9 },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪', dialCode: '+967', minLength: 9, maxLength: 9 },
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸', dialCode: '+970', minLength: 9, maxLength: 9 },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿', dialCode: '+213', minLength: 9, maxLength: 9 },
  { code: 'TN', name: 'تونس', flag: '🇹🇳', dialCode: '+216', minLength: 8, maxLength: 8 },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾', dialCode: '+218', minLength: 9, maxLength: 9 },
  { code: 'SD', name: 'السودان', flag: '🇸🇩', dialCode: '+249', minLength: 9, maxLength: 9 },
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
  placeholder = "أدخل رقم الهاتف",
  error,
  className = ""
}) => {
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
      return `رقم الهاتف يجب أن يكون على الأقل ${selectedCountry.minLength} أرقام`;
    }
    if (cleanNumber.length > selectedCountry.maxLength) {
      return `رقم الهاتف يجب أن يكون بحد أقصى ${selectedCountry.maxLength} أرقام`;
    }
    return '';
  };

  const validationMessage = getValidationMessage();
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const isValid = cleanNumber.length >= selectedCountry.minLength && cleanNumber.length <= selectedCountry.maxLength;

  return (
    <div className={`space-y-2 ${className}`} dir="rtl">
      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          {/* Phone Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={cleanNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder}
              className={`w-full pr-10 pl-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-right ${
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
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 border-l-0 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <span className="text-lg">{selectedCountry.flag}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {ARABIC_COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-3 py-2 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-3 justify-end"
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
          <p className="text-sm text-red-600 mt-1 text-right">
            {error || validationMessage}
          </p>
        )}

        {/* Success Message */}
        {cleanNumber.length > 0 && isValid && !error && (
          <p className="text-sm text-green-600 mt-1 text-right">
            ✓ رقم هاتف صحيح
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
