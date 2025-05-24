
import React, { createContext, useContext, useState, useEffect } from 'react';
import { executeQuery } from '../api/database';
import { queries } from '../config/database';

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
      
      // Query the admin from MySQL database
      const results: any = await executeQuery(queries.getAdminByUsername, [username]);
      
      if (!results || results.length === 0) {
        console.error('Admin not found');
        
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

      const adminData = results[0];
      console.log('Admin found:', { id: adminData.id, username: adminData.username, email: adminData.email });

      // Check password (في التطبيق الحقيقي، يجب استخدام bcrypt)
      const isPasswordValid = adminData.password_hash === password;

      if (isPasswordValid) {
        const loginData = {
          id: adminData.id,
          username: adminData.username,
          email: adminData.email
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
      const result: any = await executeQuery(queries.updateAdminPassword, [newPassword, admin.id]);
      return result.affectedRows > 0;
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
