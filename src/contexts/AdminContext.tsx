
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
      
      // Get admin by username with simplified query
      const { data: adminData, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username.trim())
        .single();

      if (fetchError) {
        console.error('Admin fetch error:', fetchError);
        return { success: false, error: 'Invalid username or password' };
      }

      if (!adminData) {
        console.error('Admin not found');
        return { success: false, error: 'Invalid username or password' };
      }

      console.log('Admin found:', { id: adminData.id, username: adminData.username });

      // Handle password verification
      let isPasswordValid = false;
      
      // Check if this is the default admin with plain text password
      if (adminData.username === 'admin' && adminData.password_hash === 'Zz115599') {
        console.log('Default admin with plain text password detected');
        
        if (password === 'Zz115599') {
          // Hash the password and update it
          const hashedPassword = await hashPassword(password);
          
          const { error: updateError } = await supabase
            .from('admins')
            .update({ password_hash: hashedPassword })
            .eq('id', adminData.id);

          if (updateError) {
            console.error('Password update error:', updateError);
            return { success: false, error: 'Failed to update password' };
          }
          
          isPasswordValid = true;
          console.log('Password successfully hashed and updated');
        }
      } else {
        // Verify hashed password
        console.log('Verifying hashed password');
        isPasswordValid = await verifyPassword(password, adminData.password_hash);
      }

      if (!isPasswordValid) {
        console.log('Password verification failed');
        return { success: false, error: 'Invalid username or password' };
      }

      console.log('Password verified successfully');

      // Create session
      const sessionId = await createAdminSession(adminData.id);
      if (!sessionId) {
        console.error('Failed to create session');
        return { success: false, error: 'Failed to create session' };
      }

      // Store session and set admin
      localStorage.setItem('admin_session_id', sessionId);
      
      const adminInfo: Admin = {
        id: adminData.id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role
      };
      
      setAdmin(adminInfo);
      console.log('Login successful');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
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
