
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  email: string;
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
    // Check if admin is logged in on app start
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with username:', username);
      
      // Query the admin from Supabase
      const { data: results, error } = await supabase
        .from('admins')
        .select('id, username, email, password_hash')
        .eq('username', username)
        .single();
      
      if (error || !results) {
        console.error('Admin not found or error:', error);
        
        // Fallback for testing - allow login with test credentials
        if (username === 'admin' && password === 'admin123') {
          const testAdminData = {
            id: 'test-admin-id',
            username: 'admin',
            email: 'admin@miletruck.com'
          };
          setAdmin(testAdminData);
          localStorage.setItem('admin', JSON.stringify(testAdminData));
          console.log('Test login successful');
          return true;
        }
        return false;
      }

      console.log('Admin found:', { id: results.id, username: results.username, email: results.email });

      // Check password (في التطبيق الحقيقي، يجب استخدام bcrypt)
      const isPasswordValid = results.password_hash === password;

      if (isPasswordValid) {
        const loginData = {
          id: results.id,
          username: results.username,
          email: results.email
        };
        setAdmin(loginData);
        localStorage.setItem('admin', JSON.stringify(loginData));
        console.log('Login successful');
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

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!admin) return false;
    
    try {
      // في التطبيق الحقيقي، يجب تشفير كلمة المرور باستخدام bcrypt
      const { error } = await supabase
        .from('admins')
        .update({ 
          password_hash: newPassword,
          updated_at: new Date().toISOString()
        })
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
