
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/passwordUtils';
import { createAdminSession, validateAdminSession, cleanupAllSessions, extendSession } from '../utils/sessionUtils';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
}

interface AdminContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
    
    // Set up session extension interval (every 5 minutes)
    const interval = setInterval(() => {
      if (admin) {
        const sessionId = localStorage.getItem('admin_session_id');
        if (sessionId) {
          extendSession(sessionId);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [admin]);

  const checkExistingSession = async () => {
    try {
      const sessionId = localStorage.getItem('admin_session_id');
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const validation = await validateAdminSession(sessionId);
      if (!validation.isValid || !validation.adminId) {
        localStorage.removeItem('admin_session_id');
        setLoading(false);
        return;
      }

      // Get admin data
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('id, username, email, role')
        .eq('id', validation.adminId)
        .single();

      if (adminData && !error) {
        setAdmin({
          id: adminData.id,
          username: adminData.username,
          email: adminData.email,
          role: adminData.role || 'admin'
        });
        console.log('Session restored for admin:', adminData.username);
      } else {
        localStorage.removeItem('admin_session_id');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('admin_session_id');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      console.log('Attempting login with username:', username);
      
      // Input validation
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }

      if (username.length < 3) {
        return { success: false, error: 'Invalid username format' };
      }

      // Query the admin from database
      const { data, error } = await supabase
        .from('admins')
        .select('id, username, email, password_hash, role')
        .eq('username', username)
        .single();

      if (error || !data) {
        console.error('Admin not found or database error:', error);
        return { success: false, error: 'Invalid username or password' };
      }

      console.log('Admin found:', { id: data.id, username: data.username, email: data.email, role: data.role });

      // Verify password using bcrypt
      const isPasswordValid = await verifyPassword(password, data.password_hash);

      if (!isPasswordValid) {
        console.error('Invalid password');
        return { success: false, error: 'Invalid username or password' };
      }

      // Create new secure session
      const sessionId = await createAdminSession(data.id);
      if (!sessionId) {
        return { success: false, error: 'Failed to create session' };
      }

      const adminData = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role || 'admin'
      };

      setAdmin(adminData);
      localStorage.setItem('admin_session_id', sessionId);
      console.log('Login successful with session:', sessionId);
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('admin_session_id');
      if (sessionId && admin) {
        // Delete specific session from database
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

  const updatePassword = async (newPassword: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!admin) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      // Validate password strength
      const validation = validatePasswordStrength(newPassword);
      if (!validation.isValid) {
        return { 
          success: false, 
          error: validation.errors.join('. ') 
        };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      const { error } = await supabase
        .from('admins')
        .update({ 
          password_hash: hashedPassword, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', admin.id);

      if (error) {
        console.error('Password update error:', error);
        return { success: false, error: 'Failed to update password' };
      }

      // Clean up all sessions for this admin except current one
      const currentSessionId = localStorage.getItem('admin_session_id');
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('admin_id', admin.id)
        .neq('id', currentSessionId || '');

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'An error occurred while updating password' };
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
