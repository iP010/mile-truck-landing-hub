
import { useState, useEffect } from 'react';
import { validateAdminSession, cleanupAllSessions } from '../utils/sessionUtils';
import { getAdminById } from '../services/adminService';
import { Admin } from '../types/admin';

export const useAdminSession = () => {
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

  const logout = () => {
    const sessionId = localStorage.getItem('admin_session_id');
    if (sessionId && admin) {
      // Clean up session in background
      cleanupAllSessions(admin.id).catch(console.error);
    }
    
    localStorage.removeItem('admin_session_id');
    setAdmin(null);
  };

  return {
    admin,
    setAdmin,
    loading,
    logout,
    checkExistingSession
  };
};
