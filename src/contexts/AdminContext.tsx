
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { hashPassword, verifyPassword } from '../utils/passwordUtils';
import { createAdminSession, validateAdminSession, cleanupAllSessions } from '../utils/sessionUtils';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
}

interface AdminContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionId = localStorage.getItem('admin_session_id');
      if (sessionId) {
        const validation = await validateAdminSession(sessionId);
        if (validation.isValid && validation.adminId) {
          const adminData = await getAdminById(validation.adminId);
          if (adminData) {
            setAdmin(adminData);
          } else {
            localStorage.removeItem('admin_session_id');
          }
        } else {
          localStorage.removeItem('admin_session_id');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('admin_session_id');
    } finally {
      setLoading(false);
    }
  };

  const getAdminById = async (adminId: string): Promise<Admin | null> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, username, email, role')
        .eq('id', adminId)
        .single();

      if (error || !data) {
        console.error('Admin fetch error:', error);
        return null;
      }

      return data as Admin;
    } catch (error) {
      console.error('Admin fetch error:', error);
      return null;
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting login for username:', username);
      
      // استعلام مبسط للحصول على بيانات المدير
      const { data: adminData, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();

      console.log('Query result:', { adminData, fetchError });

      if (fetchError) {
        console.error('Database query error:', fetchError);
        return { success: false, error: 'Database connection error' };
      }

      if (!adminData) {
        console.log('No admin found with username:', username);
        return { success: false, error: 'Invalid username or password' };
      }

      console.log('Admin found successfully:', { 
        id: adminData.id, 
        username: adminData.username,
        passwordType: adminData.password_hash === 'Zz115599' ? 'plain' : 'hashed'
      });

      // التحقق من كلمة المرور
      let isPasswordValid = false;
      
      if (adminData.password_hash === 'Zz115599') {
        // كلمة مرور افتراضية غير مشفرة
        console.log('Checking against default plain password');
        if (password === 'Zz115599') {
          isPasswordValid = true;
          console.log('Plain password matched, will update to hashed');
          
          // تشفير كلمة المرور وتحديثها
          try {
            const hashedPassword = await hashPassword(password);
            const { error: updateError } = await supabase
              .from('admins')
              .update({ password_hash: hashedPassword })
              .eq('id', adminData.id);

            if (updateError) {
              console.error('Failed to update password hash:', updateError);
              // لا نفشل التسجيل، لكن نسجل الخطأ
            } else {
              console.log('Password successfully hashed and updated');
            }
          } catch (hashError) {
            console.error('Password hashing error:', hashError);
            // لا نفشل التسجيل، لكن نسجل الخطأ
          }
        }
      } else {
        // كلمة مرور مشفرة
        console.log('Verifying hashed password');
        try {
          isPasswordValid = await verifyPassword(password, adminData.password_hash);
          console.log('Password verification result:', isPasswordValid);
        } catch (verifyError) {
          console.error('Password verification error:', verifyError);
          return { success: false, error: 'Password verification failed' };
        }
      }

      if (!isPasswordValid) {
        console.log('Password verification failed');
        return { success: false, error: 'Invalid username or password' };
      }

      console.log('Password verified successfully, creating session');

      // إنشاء جلسة
      const sessionId = await createAdminSession(adminData.id);
      if (!sessionId) {
        console.error('Failed to create session');
        return { success: false, error: 'Failed to create session' };
      }

      // حفظ الجلسة وتعيين المدير
      localStorage.setItem('admin_session_id', sessionId);
      
      const adminInfo: Admin = {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role
      };
      
      setAdmin(adminInfo);
      console.log('Login successful, admin set');
      
      return { success: true };
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    const sessionId = localStorage.getItem('admin_session_id');
    if (sessionId && admin) {
      // Clean up session in background
      cleanupAllSessions(admin.id).catch(console.error);
    }
    
    localStorage.removeItem('admin_session_id');
    setAdmin(null);
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!admin) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const hashedPassword = await hashPassword(newPassword);
      
      const { error } = await supabase
        .from('admins')
        .update({ password_hash: hashedPassword })
        .eq('id', admin.id);

      if (error) {
        console.error('Password update error:', error);
        return { success: false, error: 'Failed to update password' };
      }

      // Clean up all sessions for this admin (force re-login)
      await cleanupAllSessions(admin.id);
      
      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password' };
    }
  };

  return (
    <AdminContext.Provider value={{
      admin,
      login,
      logout,
      updatePassword,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};
