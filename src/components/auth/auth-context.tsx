"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseAuthService } from '@/lib/supabase-auth';

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 从Supabase加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await SupabaseAuthService.getCurrentUser();
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const result = await SupabaseAuthService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        // 登录成功后导航到首页
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return { success: true };
      } else {
        return { success: false, error: result.error || '登录失败' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const result = await SupabaseAuthService.register(email, password, name);
      
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error || '注册失败' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SupabaseAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userCredits');
      localStorage.removeItem('apiKey'); // 清除API密钥
    }
  };

  const updateCredits = async (credits: number) => {
    if (user) {
      try {
        const result = await SupabaseAuthService.updateUserCredits(user.id, credits);
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Update credits error:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
