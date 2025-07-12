
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  email: string;
  sessionId?: string;
}

interface AdminContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        
        // Verify session is still valid if sessionId exists
        if (parsedAdmin.sessionId) {
          verifySession(parsedAdmin.sessionId);
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const verifySession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('admin_id, expires_at')
        .eq('id', sessionId)
        .single();

      if (error || !data || new Date(data.expires_at) < new Date()) {
        // Session expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Session verification error:', error);
      logout();
    }
  };

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
        
        // Fallback for testing - allow login with test credentials
        if (username === 'admin' && password === 'admin123') {
          // Create a real session for the test admin
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

          const { data: sessionData, error: sessionError } = await supabase
            .from('admin_sessions')
            .insert({
              admin_id: 'test-admin-id',
              expires_at: expiresAt.toISOString()
            })
            .select('id')
            .single();

          if (sessionError) {
            console.error('Test session creation error:', sessionError);
            return false;
          }

          const testAdminData = {
            id: 'test-admin-id',
            username: 'admin',
            email: 'admin@miletruck.com',
            sessionId: sessionData.id
          };
          setAdmin(testAdminData);
          localStorage.setItem('admin', JSON.stringify(testAdminData));
          console.log('Test login successful with session:', sessionData.id);
          return true;
        }
        return false;
      }

      if (!data) {
        console.error('Admin not found');
        return false;
      }

      console.log('Admin found:', { id: data.id, username: data.username, email: data.email });

      // Check password
      const isPasswordValid = data.password_hash === password;

      if (isPasswordValid) {
        // Create a session in the database
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

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
          sessionId: sessionData.id
        };

        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
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
    if (admin?.sessionId) {
      // Remove session from database
      try {
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('id', admin.sessionId);
      } catch (error) {
        console.error('Error removing session:', error);
      }
    }
    
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
