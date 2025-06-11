
import React, { useState } from 'react';
import { X, User, Mail, Lock, Key, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { hashPassword } from '../utils/passwordUtils';
import { Tables } from '../integrations/supabase/types';

type AdminUser = Tables<'admins'>;

interface EditAdminModalProps {
  admin: AdminUser;
  onClose: () => void;
  onUpdate: (updatedAdmin: AdminUser) => void;
  currentUserRole?: 'admin' | 'super_admin';
}

const EditAdminModal = ({ admin, onClose, onUpdate, currentUserRole }: EditAdminModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [formData, setFormData] = useState({
    username: admin.username,
    email: admin.email,
    role: admin.role || 'admin',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  // Only super_admin can edit other admins
  const canEdit = currentUserRole === 'super_admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!canEdit) {
      setError(isRTL ? 'ليس لديك صلاحية لتحرير هذا المدير' : 'You do not have permission to edit this admin');
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'info') {
        // Update admin info including role
        const { data, error } = await supabase
          .from('admins')
          .update({
            username: formData.username.trim(),
            email: formData.email.trim(),
            role: formData.role as 'admin' | 'super_admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', admin.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating admin:', error);
          setError(isRTL ? 'حدث خطأ أثناء تحديث البيانات' : 'Error updating admin information');
          return;
        }

        onUpdate(data);
      } else {
        // Update password
        if (!formData.newPassword.trim()) {
          setError(isRTL ? 'كلمة المرور الجديدة مطلوبة' : 'New password is required');
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          setError(isRTL ? 'كلمتا المرور غير متطابقتان' : 'Passwords do not match');
          return;
        }

        if (formData.newPassword.length < 6) {
          setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
          return;
        }

        const hashedPassword = await hashPassword(formData.newPassword);
        
        const { error } = await supabase
          .from('admins')
          .update({
            password_hash: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', admin.id);

        if (error) {
          console.error('Error updating password:', error);
          setError(isRTL ? 'حدث خطأ أثناء تحديث كلمة المرور' : 'Error updating password');
          return;
        }

        // Show success message for password update
        alert(isRTL ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully');
      }

      onClose();
    } catch (error) {
      console.error('Admin update error:', error);
      setError(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isRTL ? 'غير مصرح' : 'Unauthorized'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isRTL ? 'ليس لديك صلاحية لتحرير بيانات المديرين' : 'You do not have permission to edit admin data'}
            </p>
            <Button onClick={onClose} className="w-full">
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRTL ? 'تحرير المدير' : 'Edit Admin'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                {isRTL ? 'معلومات المدير' : 'Admin Info'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key size={16} />
                {isRTL ? 'كلمة المرور' : 'Password'}
              </div>
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'info' ? (
            <>
              {/* Username */}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Role/Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الصلاحيات' : 'Role'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'super_admin' }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                    disabled={loading}
                    required
                  >
                    <option value="admin">{isRTL ? 'مدير' : 'Admin'}</option>
                    <option value="super_admin">{isRTL ? 'القائد' : 'Super Admin'}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={isRTL ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password */}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                isRTL ? 'حفظ' : 'Save'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
