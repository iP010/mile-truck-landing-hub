import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { hashPassword } from '../utils/passwordUtils';

interface AdminManagementModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminManagementModal = ({ onClose, onSuccess }: AdminManagementModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'admin' | 'super_admin',
    customPermissions: ''
  });
  
  const [selectedRoleType, setSelectedRoleType] = useState<'مدير' | 'مشرف' | 'أخرى'>('مدير');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (roleType: 'مدير' | 'مشرف' | 'أخرى') => {
    setSelectedRoleType(roleType);
    
    // Map Arabic roles to database roles
    if (roleType === 'مدير') {
      setFormData(prev => ({ ...prev, role: 'admin' }));
    } else if (roleType === 'مشرف') {
      setFormData(prev => ({ ...prev, role: 'super_admin' }));
    } else {
      // For "أخرى", keep current role but allow custom permissions
      setFormData(prev => ({ ...prev, role: 'admin' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // التحقق من صحة البيانات
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError(isRTL ? 'جميع الحقول مطلوبة' : 'All fields are required');
      return;
    }
    
    if (selectedRoleType === 'أخرى' && !formData.customPermissions.trim()) {
      setError(isRTL ? 'يرجى تحديد الصلاحيات المخصصة' : 'Please specify custom permissions');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'كلمتا المرور غير متطابقتان' : 'Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      // التحقق من عدم وجود اسم مستخدم مكرر
      const { data: existingUser } = await supabase
        .from('admins')
        .select('id')
        .eq('username', formData.username.trim())
        .single();
        
      if (existingUser) {
        setError(isRTL ? 'اسم المستخدم موجود بالفعل' : 'Username already exists');
        setLoading(false);
        return;
      }
      
      // تشفير كلمة المرور
      const hashedPassword = await hashPassword(formData.password);
      
      // إضافة المدير الجديد
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password_hash: hashedPassword,
          role: formData.role
        });
        
      if (insertError) {
        console.error('Error creating admin:', insertError);
        setError(isRTL ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating admin account');
        return;
      }
      
      onSuccess();
    } catch (error) {
      console.error('Admin creation error:', error);
      setError(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRTL ? 'إضافة مدير جديد' : 'Add New Admin'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* الصلاحيات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'الصلاحيات' : 'Permissions'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedRoleType}
                onChange={(e) => handleRoleChange(e.target.value as 'مدير' | 'مشرف' | 'أخرى')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              >
                <option value="مدير">مدير</option>
                <option value="مشرف">مشرف</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
          </div>

          {/* حقل الصلاحيات المخصصة */}
          {selectedRoleType === 'أخرى' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRTL ? 'تحديد الصلاحيات' : 'Specify Permissions'}
              </label>
              <textarea
                value={formData.customPermissions}
                onChange={(e) => setFormData(prev => ({ ...prev, customPermissions: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={isRTL ? 'اكتب الصلاحيات المطلوبة...' : 'Write the required permissions...'}
                rows={3}
                disabled={loading}
                required={selectedRoleType === 'أخرى'}
              />
            </div>
          )}

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
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                disabled={loading}
                required
              />
            </div>
          </div>

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
                isRTL ? 'إضافة' : 'Add'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminManagementModal;
