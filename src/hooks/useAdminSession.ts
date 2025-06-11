
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
      console.log('Checking existing session:', sessionId);
      
      if (sessionId) {
        const validation = await validateAdminSession(sessionId);
        console.log('Session validation result:', validation);
        
        if (validation.isValid && validation.adminId) {
          const adminData = await getAdminById(validation.adminId);
          console.log('Admin data retrieved:', adminData);
          
          if (adminData) {
            setAdmin(adminData);
            console.log('Admin session restored successfully');
          } else {
            console.log('Admin data not found, removing session');
            localStorage.removeItem('admin_session_id');
          }
        } else {
          console.log('Session invalid, removing from storage');
          localStorage.removeItem('admin_session_id');
        }
      } else {
        console.log('No existing session found');
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
      // تنظيف الجلسة في الخلفية
      cleanupAllSessions(admin.id).catch(console.error);
    }
    
    localStorage.removeItem('admin_session_id');
    setAdmin(null);
    console.log('User logged out successfully');
  };

  return {
    admin,
    setAdmin,
    loading,
    logout,
    checkExistingSession
  };
};
