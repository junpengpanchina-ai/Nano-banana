"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseAuthService } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';

export interface SmartUser {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar?: string;
  createdAt: string;
  preferences?: UserPreferences;
  behaviorProfile?: BehaviorProfile;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  loginMethod: 'email' | 'voice' | 'biometric';
  rememberDevice: boolean;
  autoLogin: boolean;
  notifications: boolean;
}

export interface BehaviorProfile {
  loginTimes: number[];
  deviceFingerprint: string;
  typingPattern: TypingPattern;
  mousePattern: MousePattern;
  riskScore: number;
  trustedDevices: string[];
}

export interface TypingPattern {
  averageSpeed: number;
  rhythm: number[];
  pausePatterns: number[];
}

export interface MousePattern {
  clickSpeed: number;
  movementPattern: number[];
  scrollBehavior: number;
}

export interface SmartAuthContextType {
  user: SmartUser | null;
  loading: boolean;
  isAnalyzing: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  suggestedLoginMethod: 'email' | 'voice' | 'biometric';
  
  // 智能认证方法
  smartLogin: (email: string, password: string) => Promise<AuthResult>;
  voiceLogin: (audioData: Blob) => Promise<AuthResult>;
  biometricLogin: () => Promise<AuthResult>;
  
  // 用户体验增强
  getLoginSuggestions: (email: string) => Promise<LoginSuggestion[]>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  analyzeBehavior: () => void;
  
  // 传统方法
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

interface AuthResult {
  success: boolean;
  user?: SmartUser | null;
  error?: string;
  requiresAdditionalAuth?: boolean;
  suggestedNextStep?: string;
}

export interface LoginSuggestion {
  type: 'email' | 'voice' | 'biometric';
  confidence: number;
  reason: string;
  icon: string;
}

const SmartAuthContext = createContext<SmartAuthContextType | undefined>(undefined);

export function useSmartAuth() {
  const context = useContext(SmartAuthContext);
  if (context === undefined) {
    throw new Error('useSmartAuth must be used within a SmartAuthProvider');
  }
  return context;
}

interface SmartAuthProviderProps {
  children: ReactNode;
}

export function SmartAuthProvider({ children }: SmartAuthProviderProps) {
  const [user, setUser] = useState<SmartUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [suggestedLoginMethod, setSuggestedLoginMethod] = useState<'email' | 'voice' | 'biometric'>('email');

  // 智能行为分析
  const analyzeBehavior = () => {
    setIsAnalyzing(true);
    
    // 模拟行为分析
    setTimeout(() => {
      const riskScore = Math.random() * 100;
      if (riskScore < 30) {
        setRiskLevel('low');
        setSuggestedLoginMethod('email');
      } else if (riskScore < 70) {
        setRiskLevel('medium');
        setSuggestedLoginMethod('voice');
      } else {
        setRiskLevel('high');
        setSuggestedLoginMethod('biometric');
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  // 获取登录建议
  const getLoginSuggestions = async (email: string): Promise<LoginSuggestion[]> => {
    // 基于用户历史和当前环境提供智能建议
    const suggestions: LoginSuggestion[] = [
      {
        type: 'email',
        confidence: 0.9,
        reason: '这是您最常用的登录方式',
        icon: '📧'
      }
    ];

    // 检查是否支持语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      suggestions.push({
        type: 'voice',
        confidence: 0.7,
        reason: '您的设备支持语音登录',
        icon: '🎤'
      });
    }

    // 检查是否支持生物识别
    if ('credentials' in navigator && 'create' in navigator.credentials) {
      suggestions.push({
        type: 'biometric',
        confidence: 0.8,
        reason: '您的设备支持生物识别',
        icon: '👆'
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  // 智能登录
  const smartLogin = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      analyzeBehavior();
      
      const result = await SupabaseAuthService.login(email, password);
      
      if (result.success && result.user) {
        // 转换为智能用户格式
        const smartUser: SmartUser = {
          ...result.user,
          preferences: {
            theme: 'auto',
            language: navigator.language,
              loginMethod: 'email' as const,
            rememberDevice: true,
            autoLogin: false,
            notifications: true
          },
          behaviorProfile: {
            loginTimes: [Date.now()],
            deviceFingerprint: generateDeviceFingerprint(),
            typingPattern: {
              averageSpeed: 0,
              rhythm: [],
              pausePatterns: []
            },
            mousePattern: {
              clickSpeed: 0,
              movementPattern: [],
              scrollBehavior: 0
            },
            riskScore: 0,
            trustedDevices: []
          }
        };
        
        setUser(smartUser);
        return { success: true, user: smartUser };
      } else {
        return { 
          success: false, 
          error: result.error || '登录失败',
          suggestedNextStep: '请检查邮箱和密码，或尝试其他登录方式'
        };
      }
    } catch (error) {
      console.error('Smart login error:', error);
      return { 
        success: false, 
        error: '网络错误，请稍后重试',
        suggestedNextStep: '请检查网络连接'
      };
    } finally {
      setLoading(false);
    }
  };

  // 语音登录
  const voiceLogin = async (audioData: Blob): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // 这里应该调用语音识别API
      // 模拟语音识别结果
      const mockEmail = 'tset123qq@example.com';
      const mockPassword = '123123';
      
      const result = await SupabaseAuthService.login(mockEmail, mockPassword);
      
      if (result.success && result.user) {
        const smartUser: SmartUser = {
          ...result.user,
          preferences: {
            theme: 'auto',
            language: navigator.language,
              loginMethod: 'voice' as const,
            rememberDevice: true,
            autoLogin: false,
            notifications: true
          },
          behaviorProfile: {
            loginTimes: [Date.now()],
            deviceFingerprint: generateDeviceFingerprint(),
            typingPattern: {
              averageSpeed: 0,
              rhythm: [],
              pausePatterns: []
            },
            mousePattern: {
              clickSpeed: 0,
              movementPattern: [],
              scrollBehavior: 0
            },
            riskScore: 0,
            trustedDevices: []
          }
        };
        
        setUser(smartUser);
        return { success: true, user: smartUser };
      } else {
        return { 
          success: false, 
          error: '语音识别失败',
          suggestedNextStep: '请尝试重新说话或使用其他登录方式'
        };
      }
    } catch (error) {
      console.error('Voice login error:', error);
      return { 
        success: false, 
        error: '语音登录失败',
        suggestedNextStep: '请尝试其他登录方式'
      };
    } finally {
      setLoading(false);
    }
  };

  // 生物识别登录
  const biometricLogin = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      if ('credentials' in navigator && 'get' in navigator.credentials) {
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: 'required'
          }
        });
        
        if (credential) {
          // 模拟生物识别成功
          const mockEmail = 'tset123qq@example.com';
          const result = await SupabaseAuthService.login(mockEmail, '123123');
          
          if (result.success && result.user) {
            const smartUser: SmartUser = {
              ...result.user,
              preferences: {
                theme: 'auto' as const,
                language: navigator.language,
                loginMethod: 'biometric' as const,
                rememberDevice: true,
                autoLogin: true,
                notifications: true
              },
              behaviorProfile: {
                loginTimes: [Date.now()],
                deviceFingerprint: generateDeviceFingerprint(),
                typingPattern: {
                  averageSpeed: 0,
                  rhythm: [],
                  pausePatterns: []
                },
                mousePattern: {
                  clickSpeed: 0,
                  movementPattern: [],
                  scrollBehavior: 0
                },
                riskScore: 0,
                trustedDevices: []
              }
            };
            
            setUser(smartUser);
            return { success: true, user: smartUser };
          }
        }
      }
      
      return { 
        success: false, 
        error: '生物识别不可用',
        suggestedNextStep: '请使用邮箱密码登录'
      };
    } catch (error) {
      console.error('Biometric login error:', error);
      return { 
        success: false, 
        error: '生物识别失败',
        suggestedNextStep: '请使用其他登录方式'
      };
    } finally {
      setLoading(false);
    }
  };

  // 更新用户偏好
  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (user) {
      const updatedUser: SmartUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences } as UserPreferences
      };
      setUser(updatedUser);
      
      // 保存到本地存储
      localStorage.setItem('userPreferences', JSON.stringify(updatedUser.preferences));
    }
  };

  // 生成设备指纹
  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  };

  // 传统注册方法
  const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const result = await SupabaseAuthService.register(email, password, name);
      
      if (result.success && result.user) {
        const smartUser: SmartUser = {
          ...result.user,
          preferences: {
            theme: 'auto',
            language: navigator.language,
              loginMethod: 'email' as const,
            rememberDevice: true,
            autoLogin: false,
            notifications: true
          },
          behaviorProfile: {
            loginTimes: [Date.now()],
            deviceFingerprint: generateDeviceFingerprint(),
            typingPattern: {
              averageSpeed: 0,
              rhythm: [],
              pausePatterns: []
            },
            mousePattern: {
              clickSpeed: 0,
              movementPattern: [],
              scrollBehavior: 0
            },
            riskScore: 0,
            trustedDevices: []
          }
        };
        
        setUser(smartUser);
        return { success: true, user: smartUser };
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

  // 登出
  const logout = async () => {
    try {
      await SupabaseAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('userCredits');
      localStorage.removeItem('apiKey');
    }
  };

  // 更新积分
  const updateCredits = async (credits: number) => {
    if (user) {
      try {
        const result = await SupabaseAuthService.updateUserCredits(user.id, credits);
        if (result.success && result.user) {
          setUser({ ...user, credits: result.user.credits });
        }
      } catch (error) {
        console.error('Update credits error:', error);
      }
    }
  };

  // 从Supabase加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        
        // 简化初始化，避免在未登录时调用API
        // 只在用户明确登录后才加载用户数据
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const value: SmartAuthContextType = {
    user,
    loading,
    isAnalyzing,
    riskLevel,
    suggestedLoginMethod,
    smartLogin,
    voiceLogin,
    biometricLogin,
    getLoginSuggestions,
    updateUserPreferences,
    analyzeBehavior,
    register,
    logout,
    updateCredits,
  };

  return (
    <SmartAuthContext.Provider value={value}>
      {children}
    </SmartAuthContext.Provider>
  );
}
