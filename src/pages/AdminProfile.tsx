
import React, { useState } from 'react';
import { User, Mail, Lock, Save, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import { validatePasswordStrength } from '../utils/passwordUtils';

const AdminProfile = () => {
  const { admin, updatePassword } = useAdmin();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordValidation(validatePasswordStrength(password));
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!passwordValidation.isValid) {
      setError(isRTL ? 'كلمة المرور لا تلبي متطلبات الأمان' : 'Password does not meet security requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    
    if (result.success) {
      setMessage(isRTL ? 'تم تغيير كلمة المرور بنجاح. تم إنهاء جميع الجلسات الأخرى.' : 'Password updated successfully. All other sessions have been terminated.');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordValidation({ isValid: false, errors: [] });
    } else {
      setError(result.error || (isRTL ? 'حدث خطأ في تغيير كلمة المرور' : 'Error updating password'));
    }
    
    setLoading(false);
  };

  const getRoleText = (role: string) => {
    if (role === 'super_admin') {
      return isRTL ? 'مدير عام' : 'Super Admin';
    }
    return isRTL ? 'مدير' : 'Admin';
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isRTL ? 'معلومات الأدمن' : 'Admin Profile'}
            </h1>

            {/* Admin Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isRTL ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <p className="text-gray-900">{admin.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <p className="text-gray-900">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-500" />
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {isRTL ? 'الصلاحية' : 'Role'}
                    </label>
                    <p className="text-gray-900">{getRoleText(admin.role)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                    {getRoleText(admin.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      maxLength={100}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600">
                        {isRTL ? 'متطلبات كلمة المرور:' : 'Password requirements:'}
                      </div>
                      {passwordValidation.errors.map((errorMsg, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {errorMsg}
                        </div>
                      ))}
                      {passwordValidation.isValid && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {isRTL ? 'كلمة مرور قوية' : 'Strong password'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      maxLength={100}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {message && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isRTL ? 'حفظ كلمة المرور' : 'Save Password'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
