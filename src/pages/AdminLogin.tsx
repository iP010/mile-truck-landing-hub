
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { admin, login } = useAdmin();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  // Redirect if already logged in
  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Rate limiting - max 5 attempts
    if (loginAttempts >= 5) {
      setError(isRTL ? 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً' : 'Too many login attempts. Please try again later.');
      return;
    }
    
    // Input validation
    if (!username.trim() || !password.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter both username and password');
      return;
    }

    setLoading(true);
    console.log('Starting login process with username:', username);
    
    try {
      const result = await login(username.trim(), password);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        setLoginAttempts(0);
        // Redirect will happen automatically due to admin state change
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || (isRTL ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password'));
        setLoginAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Login exception:', error);
      setError(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
      setLoginAttempts(prev => prev + 1);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isRTL ? 'تسجيل دخول الأدمن' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRTL ? 'أدخل بيانات الدخول للوصول إلى لوحة التحكم' : 'Enter your credentials to access the admin panel'}
          </p>
          
          {/* Default credentials hint for development */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              {isRTL ? 'بيانات الدخول الافتراضية:' : 'Default credentials:'}
            </p>
            <p className="text-xs text-blue-600">
              {isRTL ? 'اسم المستخدم: admin' : 'Username: admin'}
            </p>
            <p className="text-xs text-blue-600">
              {isRTL ? 'كلمة المرور: Zz115599' : 'Password: Zz115599'}
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
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
                  maxLength={100}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={isRTL ? 'كلمة المرور' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loginAttempts > 0 && loginAttempts < 5 && (
            <div className="text-amber-600 text-xs text-center">
              {isRTL ? `عدد المحاولات المتبقية: ${5 - loginAttempts}` : `Attempts remaining: ${5 - loginAttempts}`}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading || loginAttempts >= 5}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                isRTL ? 'تسجيل الدخول' : 'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
