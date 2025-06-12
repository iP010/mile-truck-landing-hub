
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { hashPassword } from '../utils/passwordUtils';
import AdminFormFields from './admin/AdminFormFields';
import RoleSelector from './admin/RoleSelector';

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
    role: 'supervisor' as 'admin' | 'super_admin' | 'supervisor',
    customPermissions: ''
  });
  
  const [selectedRoleType, setSelectedRoleType] = useState<'مدير' | 'مشرف' | 'قائد' | 'أخرى'>('مشرف');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (roleType: 'مدير' | 'مشرف' | 'قائد' | 'أخرى') => {
    setSelectedRoleType(roleType);
    
    // Map Arabic roles to database roles
    if (roleType === 'مشرف') {
      setFormData(prev => ({ ...prev, role: 'supervisor' }));
    } else if (roleType === 'مدير') {
      setFormData(prev => ({ ...prev, role: 'admin' }));
    } else if (roleType === 'قائد') {
      setFormData(prev => ({ ...prev, role: 'super_admin' }));
    } else if (roleType === 'أخرى') {
      // For "أخرى", use supervisor role with custom permissions text
      setFormData(prev => ({ ...prev, role: 'supervisor' }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomPermissionsChange = (permissions: string) => {
    setFormData(prev => ({ ...prev, customPermissions: permissions }));
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
      // Note: For "أخرى" type, we store it as supervisor role with custom permissions in a comment or description
      // Since we don't have a permissions field in the database, we'll treat it as supervisor with the understanding
      // that the custom permissions text is for display/documentation purposes only
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password_hash: hashedPassword,
          role: formData.role // This will be 'supervisor' for both مشرف and أخرى
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
          <AdminFormFields
            formData={formData}
            onChange={handleFieldChange}
            loading={loading}
          />

          <RoleSelector
            selectedRoleType={selectedRoleType}
            customPermissions={formData.customPermissions}
            onRoleChange={handleRoleChange}
            onCustomPermissionsChange={handleCustomPermissionsChange}
            loading={loading}
          />

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
