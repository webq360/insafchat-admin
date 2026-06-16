import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: { email: string } | null;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is already logged in (from localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('admin');
    const token = localStorage.getItem('authToken');
    
    if (stored && token) {
      try {
        const parsedAdmin = JSON.parse(stored);
        setAdmin(parsedAdmin);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('admin');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call backend admin login API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/admin/login`,
        { email, password }
      );

      const { token, admin: adminData } = response.data;
      
      setAdmin(adminData);
      setIsAuthenticated(true);
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('authToken', token);
      
      console.log('✅ Admin logged in successfully');
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, admin, user: admin, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
