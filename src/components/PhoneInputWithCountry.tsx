
import React, { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', minLength: 9, maxLength: 9 },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', minLength: 8, maxLength: 8 },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', minLength: 8, maxLength: 8 },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', minLength: 8, maxLength: 8 },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', minLength: 8, maxLength: 8 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', minLength: 9, maxLength: 9 },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', minLength: 8, maxLength: 8 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', minLength: 10, maxLength: 11 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', minLength: 9, maxLength: 9 },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', minLength: 10, maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', minLength: 10, maxLength: 11 },
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter phone number",
  error,
  className = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(value.replace(selectedCountry.dialCode, ''));

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    const fullNumber = country.dialCode + phoneNumber;
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    
    // Check length constraints
    if (inputValue.length <= selectedCountry.maxLength) {
      setPhoneNumber(inputValue);
      const fullNumber = selectedCountry.dialCode + inputValue;
      onChange(fullNumber);
    }
  };

  const getValidationMessage = () => {
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length < selectedCountry.minLength) {
      return `Phone number should be at least ${selectedCountry.minLength} digits`;
    }
    if (phoneNumber.length > selectedCountry.maxLength) {
      return `Phone number should be at most ${selectedCountry.maxLength} digits`;
    }
    return '';
  };

  const validationMessage = getValidationMessage();
  const isValid = phoneNumber.length >= selectedCountry.minLength && phoneNumber.length <= selectedCountry.maxLength;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <div className="flex">
          {/* Country Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-3"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium">{country.dialCode}</span>
                    <span className="text-sm text-gray-600">{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder}
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                error || (validationMessage && !isValid) ? 'border-red-500' : ''
              }`}
            />
          </div>
        </div>

        {/* Validation Message */}
        {(validationMessage || error) && (
          <p className="text-sm text-red-600 mt-1">
            {error || validationMessage}
          </p>
        )}

        {/* Success Message */}
        {phoneNumber.length > 0 && isValid && !error && (
          <p className="text-sm text-green-600 mt-1">
            ✓ Valid phone number
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneInputWithCountry;
