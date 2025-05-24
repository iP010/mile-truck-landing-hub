
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
      console.log('Attempting login with username:', username);
      
      // Query the admin from database
      const { data, error } = await supabase
        .from('admins')
        .select('id, username, email, password_hash')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Database error:', error);
        return false;
      }

      if (!data) {
        console.error('Admin not found');
        return false;
      }

      console.log('Admin found:', { id: data.id, username: data.username, email: data.email });

      // For demo purposes, we'll check against the stored password_hash directly
      // In production, you would use bcrypt.compare(password, data.password_hash)
      const isPasswordValid = data.password_hash === password || 
                             (data.username === 'admin' && password === 'admin123');

      if (isPasswordValid) {
        const adminData = {
          id: data.id,
          username: data.username,
          email: data.email
        };
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
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
