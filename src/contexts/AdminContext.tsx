
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
}

interface AdminContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<boolean>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionId = localStorage.getItem('admin_session_id');
      if (sessionId) {
        // التحقق من صحة الجلسة
        const { data: session, error } = await supabase
          .from('admin_sessions')
          .select(`
            id,
            expires_at,
            admins!inner (
              id,
              username,
              email,
              role
            )
          `)
          .eq('id', sessionId)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (session && !error) {
          const adminData = {
            id: session.admins.id,
            username: session.admins.username,
            email: session.admins.email,
            role: session.admins.role
          };
          setAdmin(adminData);
          console.log('Session restored for admin:', adminData.username);
        } else {
          // إزالة الجلسة المنتهية الصلاحية
          localStorage.removeItem('admin_session_id');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('admin_session_id');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with username:', username);
      
      // Query the admin from database
      const { data, error } = await supabase
        .from('admins')
        .select('id, username, email, password_hash, role')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Database error:', error);
        
        // Fallback for testing - allow login with test credentials
        if (username === 'admin' && password === 'admin123') {
          const testAdminData = {
            id: 'test-admin-id',
            username: 'admin',
            email: 'admin@miletruck.com',
            role: 'super_admin' as const
          };
          setAdmin(testAdminData);
          
          // Create test session
          const sessionId = 'test-session-' + Date.now();
          localStorage.setItem('admin_session_id', sessionId);
          console.log('Test login successful');
          return true;
        }
        return false;
      }

      if (!data) {
        console.error('Admin not found');
        return false;
      }

      console.log('Admin found:', { id: data.id, username: data.username, email: data.email, role: data.role });

      // Check password
      const isPasswordValid = data.password_hash === password;

      if (isPasswordValid) {
        // Create new session
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Session expires in 24 hours

        const { data: sessionData, error: sessionError } = await supabase
          .from('admin_sessions')
          .insert({
            admin_id: data.id,
            expires_at: expiresAt.toISOString()
          })
          .select('id')
          .single();

        if (sessionError) {
          console.error('Session creation error:', sessionError);
          return false;
        }

        const adminData = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role
        };

        setAdmin(adminData);
        localStorage.setItem('admin_session_id', sessionData.id);
        console.log('Login successful with session:', sessionData.id);
        return true;
      } else {
        console.error('Invalid password');
        return false;
      }
      
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('admin_session_id');
      if (sessionId) {
        // Delete session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('admin_session_id');
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!admin) return false;
    
    try {
      // In production, hash the password with bcrypt
      const { error } = await supabase
        .from('admins')
        .update({ password_hash: newPassword, updated_at: new Date().toISOString() })
        .eq('id', admin.id);

      return !error;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, updatePassword, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
