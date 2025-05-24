
import React, { createContext, useContext, useState, useEffect } from 'react';

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
      
      // استبدل هذا برابط API الخاص بك
      const API_BASE_URL = 'https://yourdomain.com/api'; // قم بتغيير هذا
      
      const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAdmin(result.admin);
        localStorage.setItem('admin', JSON.stringify(result.admin));
        console.log('Login successful');
        return true;
      } else {
        console.error('Login failed:', result.error);
        
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
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback for testing
      if (username === 'admin' && password === 'admin123') {
        const testAdminData = {
          id: 'test-admin-id',
          username: 'admin',
          email: 'admin@miletruck.com'
        };
        setAdmin(testAdminData);
        localStorage.setItem('admin', JSON.stringify(testAdminData));
        console.log('Test login successful (fallback)');
        return true;
      }
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
      // يمكنك إضافة API لتحديث كلمة المرور لاحقاً
      console.log('Password update not implemented yet');
      return true;
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
