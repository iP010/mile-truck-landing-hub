
import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminFormFieldsProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (field: string, value: string) => void;
  loading: boolean;
}

const AdminFormFields = ({ formData, onChange, loading }: AdminFormFieldsProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  return (
    <>
      {/* اسم المستخدم */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'اسم المستخدم' : 'Username'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange('username', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'البريد الإلكتروني' : 'Email'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'كلمة المرور' : 'Password'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
            disabled={loading}
            required
            minLength={6}
          />
        </div>
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
            disabled={loading}
            required
          />
        </div>
      </div>
    </>
  );
};

export default AdminFormFields;
