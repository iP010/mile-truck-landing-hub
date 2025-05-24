
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
}

const countries: Country[] = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', minLength: 9, maxLength: 9 },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', minLength: 8, maxLength: 8 },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', minLength: 8, maxLength: 8 },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', minLength: 8, maxLength: 8 },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', minLength: 8, maxLength: 8 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', minLength: 9, maxLength: 9 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', minLength: 10, maxLength: 11 },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', minLength: 8, maxLength: 8 },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963', minLength: 9, maxLength: 9 },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964', minLength: 10, maxLength: 10 },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967', minLength: 9, maxLength: 9 },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970', minLength: 9, maxLength: 9 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', minLength: 9, maxLength: 9 },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', minLength: 9, maxLength: 9 },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216', minLength: 8, maxLength: 8 },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218', minLength: 9, maxLength: 10 },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249', minLength: 9, maxLength: 9 },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252', minLength: 8, maxLength: 9 },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', minLength: 8, maxLength: 8 },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269', minLength: 7, maxLength: 7 },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222', minLength: 8, maxLength: 8 },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  error
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    // Update the full phone number
    const fullNumber = country.dialCode + phoneNumber.replace(/^(\+\d+)?/, '');
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove any non-digit characters except + at the beginning
    const cleanedValue = inputValue.replace(/[^\d]/g, '');
    
    // Validate length according to selected country
    if (cleanedValue.length <= selectedCountry.maxLength) {
      setPhoneNumber(cleanedValue);
      const fullNumber = selectedCountry.dialCode + cleanedValue;
      onChange(fullNumber);
    }
  };

  const isValidLength = phoneNumber.length >= selectedCountry.minLength && phoneNumber.length <= selectedCountry.maxLength;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex">
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 w-64 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium">{country.dialCode}</span>
                  <span className="text-sm text-gray-600 truncate">{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder || `Enter ${selectedCountry.minLength}-${selectedCountry.maxLength} digits`}
          className={`flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            error || (phoneNumber && !isValidLength) ? 'border-red-500' : ''
          }`}
          required={required}
        />
      </div>
      
      {/* Validation Message */}
      {phoneNumber && !isValidLength && (
        <p className="text-sm text-red-600">
          Phone number should be {selectedCountry.minLength}-{selectedCountry.maxLength} digits for {selectedCountry.name}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;
