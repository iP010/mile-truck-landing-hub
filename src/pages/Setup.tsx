
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, User, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { hashPassword, validatePasswordStrength } from '../utils/passwordUtils';
import { useLanguage } from '../contexts/LanguageContext';

const Setup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasAdmins, setHasAdmins] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      console.log('Checking for existing admins...');
      
      // استخدام استعلام مباشر بدون قيود RLS
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .limit(1);

      console.log('Admin check result:', { data, error });

      if (error) {
        console.error('Error checking for admins:', error);
        // لا نعرض خطأ للمستخدم هنا، فقط نفترض عدم وجود مديرين
        setHasAdmins(false);
      } else {
        const adminExists = data && data.length > 0;
        console.log('Admin exists:', adminExists);
        setHasAdmins(adminExists);
      }
    } catch (error) {
      console.error('Exception checking for admins:', error);
      // لا نعرض خطأ للمستخدم، فقط نفترض عدم وجود مديرين
      setHasAdmins(false);
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');

    // التحقق من قوة كلمة المرور عند تغيير حقل كلمة المرور
    if (field === 'password') {
      const validation = validatePasswordStrength(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Starting admin creation process...');

    // التحقق من صحة البيانات
    if (!formData.username.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    // التحقق من قوة كلمة المرور
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setError(isRTL ? 'كلمة المرور لا تتوافق مع الشروط المطلوبة' : 'Password does not meet requirements');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating new admin with simple approach...');

      // تشفير كلمة المرور
      console.log('Hashing password...');
      const hashedPassword = await hashPassword(formData.password);
      console.log('Password hashed successfully');

      // إنشاء المدير الجديد مباشرة
      console.log('Inserting admin into database...');
      const { data, error } = await supabase
        .from('admins')
        .insert({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password_hash: hashedPassword,
          role: 'super_admin'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Admin creation error:', error);
        if (error.code === '23505') {
          setError(isRTL ? 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل' : 'Username or email already exists');
        } else {
          setError(isRTL ? 'فشل في إنشاء حساب المدير: ' + error.message : 'Failed to create admin account: ' + error.message);
        }
      } else {
        console.log('Admin created successfully:', data);
        setSuccess(isRTL ? 'تم إنشاء حساب المدير بنجاح! سيتم التوجه لصفحة تسجيل الدخول...' : 'Admin account created successfully! Redirecting to login...');
        
        // التوجه لصفحة تسجيل الدخول بعد 2 ثانية
        setTimeout(() => {
          window.location.href = '/admin-login';
        }, 2000);
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError(isRTL ? 'حدث خطأ غير متوقع: ' + (error as Error).message : 'An unexpected error occurred: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // إذا كان التحقق جارياً
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isRTL ? 'جاري التحقق من حالة النظام...' : 'Checking system status...'}
          </p>
        </div>
      </div>
    );
  }

  // إذا كان يوجد مديرين بالفعل، التوجه لصفحة تسجيل الدخول
  if (hasAdmins) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isRTL ? 'إعداد النظام' : 'System Setup'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRTL ? 'قم بإنشاء حساب المدير الأول للنظام' : 'Create the first admin account for the system'}
          </p>
          
          {/* ملاحظة مهمة */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              {isRTL ? 'ملاحظة: يوجد حساب مدير افتراضي بالفعل يمكنك استخدامه:' : 'Note: There is already a default admin account you can use:'}
            </p>
            <p className="text-xs text-blue-600">
              {isRTL ? 'اسم المستخدم: admin | كلمة المرور: Zz115599' : 'Username: admin | Password: Zz115599'}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {isRTL ? 'أو يمكنك إنشاء حساب جديد باستخدام النموذج أدناه' : 'Or create a new account using the form below'}
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* اسم المستخدم */}
            <div>
              <label htmlFor="username" className="sr-only">
                {isRTL ? 'اسم المستخدم' : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  maxLength={50}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={isRTL ? 'اسم المستخدم' : 'Username'}
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="sr-only">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* كلمة المرور */}
            <div>
              <label htmlFor="password" className="sr-only">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={isRTL ? 'كلمة المرور' : 'Password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* شروط كلمة المرور */}
          {passwordErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-sm text-amber-800 font-medium mb-2">
                {isRTL ? 'متطلبات كلمة المرور:' : 'Password requirements:'}
              </p>
              <ul className="text-xs text-amber-700 space-y-1">
                {passwordErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                isRTL ? 'إنشاء حساب المدير' : 'Create Admin Account'
              )}
            </Button>
            
            {/* رابط للذهاب لصفحة تسجيل الدخول */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => window.location.href = '/admin-login'}
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                {isRTL ? 'استخدام الحساب الافتراضي بدلاً من ذلك' : 'Use default account instead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setup;
