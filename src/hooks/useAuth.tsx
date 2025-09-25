"use client";
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient, type User as ApiUser } from '@/lib/api';

// Use the User type from the API
type User = ApiUser;

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = () => user?.role === 'admin' || user?.role === 'superadmin';

  // Load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          apiClient.setToken(token);
          const response = await apiClient.getProfile();
          if (response.success && response.data) {
            // Ensure we have the correct user object structure
            const userData = {
              ...response.data,
              id: response.data._id, // Map _id to id for backward compatibility
            };
            setUser(userData);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
            apiClient.removeToken();
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('authToken');
        apiClient.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        const userData = {
          ...response.data.user,
          id: response.data.user._id || response.data.user.id || '',
        };
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        const userData = {
          ...response.data,
          id: response.data._id || response.data.id || '',
        };
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.logout();
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
