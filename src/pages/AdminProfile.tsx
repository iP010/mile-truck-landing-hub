
import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import Header from '../components/Header';

const AdminProfile = () => {
  const { admin, updatePassword } = useAdmin();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await updatePassword(newPassword);
    
    if (success) {
      setMessage(isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(isRTL ? 'حدث خطأ في تغيير كلمة المرور' : 'Error updating password');
    }
    
    setLoading(false);
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
            </div>

            {/* Change Password Form */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
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
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
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
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
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
