import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Permission } from '../sharedTypes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          await refreshAuth();
        } catch (error) {
          console.error('Failed to refresh auth:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const { user: userData, token: newToken, refreshToken: newRefreshToken } = data.data;

      setUser(userData);
      setToken(newToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role?: UserRole) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const { user: userData, token: newToken, refreshToken: newRefreshToken } = data.data;

      setUser(userData);
      setToken(newToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const refreshAuth = async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
      }

      const { user: userData, token: newToken, refreshToken: newRefreshToken } = data.data;

      setUser(userData);
      setToken(newToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAuth,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 