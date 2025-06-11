
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export interface AdminContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface PasswordUpdateResult {
  success: boolean;
  error?: string;
}
