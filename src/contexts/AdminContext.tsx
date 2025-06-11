
import React, { createContext, useContext, ReactNode } from 'react';
import { AdminContextType, Admin } from '../types/admin';
import { useAdminSession } from '../hooks/useAdminSession';
import { authenticateAdmin, updateAdminPassword, getAdminById } from '../services/adminService';

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
  const { admin, setAdmin, loading, logout } = useAdminSession();

  const login = async (username: string, password: string) => {
    const result = await authenticateAdmin(username, password);
    
    if (result.success) {
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
          }
        }
      }
    }
    
    return result;
  };

  const updatePassword = async (newPassword: string) => {
    if (!admin) {
      return { success: false, error: 'Not authenticated' };
    }

    return updateAdminPassword(admin.id, newPassword);
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
