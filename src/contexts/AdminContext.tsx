
import React, { createContext, useContext, ReactNode } from 'react';
import { AdminContextType } from '../types/admin';
import { useAdminSession } from '../hooks/useAdminSession';
import { authenticateAdmin, updateAdminPassword, getAdminById } from '../services/adminService';

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === null) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { admin, setAdmin, loading, logout } = useAdminSession();

  const login = async (username: string, password: string) => {
    try {
      console.log('AdminProvider: Starting login process');
      const result = await authenticateAdmin(username, password);
      
      if (result.success) {
        console.log('AdminProvider: Login successful, fetching admin data');
        // Re-fetch admin data after successful login
        const sessionId = localStorage.getItem('admin_session_id');
        if (sessionId) {
          // Get admin data from session
          const { validateAdminSession } = await import('../utils/sessionUtils');
          const validation = await validateAdminSession(sessionId);
          if (validation.isValid && validation.adminId) {
            const adminData = await getAdminById(validation.adminId);
            if (adminData) {
              setAdmin(adminData);
              console.log('AdminProvider: Admin data set successfully');
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('AdminProvider: Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!admin) {
      return { success: false, error: 'Not authenticated' };
    }

    return updateAdminPassword(admin.id, newPassword);
  };

  const contextValue: AdminContextType = {
    admin,
    login,
    logout,
    updatePassword,
    loading
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
