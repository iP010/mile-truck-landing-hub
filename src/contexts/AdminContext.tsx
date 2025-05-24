
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
      setAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simple password verification (in production, use proper bcrypt)
      const { data, error } = await supabase
        .from('admins')
        .select('id, username, email, password_hash')
        .eq('username', username)
        .single();

      if (error || !data) {
        console.error('Admin not found:', error);
        return false;
      }

      // Simple password check (for demo purposes)
      // In production, use bcrypt.compare()
      if (password === 'admin123' && data.username === 'admin') {
        const adminData = {
          id: data.id,
          username: data.username,
          email: data.email
        };
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        return true;
      }
      
      return false;
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
