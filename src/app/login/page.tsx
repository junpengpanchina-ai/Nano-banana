"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSmartAuth } from '@/components/auth/smart-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Loader2,
  Brain,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

export default function WorkingLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const router = useRouter();
  const { smartLogin, register, user } = useSmartAuth();

  // 登录表单状态
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // 注册表单状态
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 模拟智能分析
  useEffect(() => {
    if (loginData.email && loginData.email.includes('@')) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const riskScore = Math.random() * 100;
        if (riskScore < 30) {
          setRiskLevel('low');
        } else if (riskScore < 70) {
          setRiskLevel('medium');
        } else {
          setRiskLevel('high');
        }
        setIsAnalyzing(false);
      }, 1000);
    }
  }, [loginData.email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 使用 SmartAuth 进行真正的登录
      const result = await smartLogin(loginData.email, loginData.password);
      
      if (result.success) {
        console.log('登录成功');
        // 登录成功后跳转到首页
      router.push('/');
      } else {
        setError(result.error || '登录失败，请使用测试账户：tset123qq@example.com / 123123');
      }
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('密码至少需要6个字符');
      setLoading(false);
      return;
    }

    try {
      // 使用 SmartAuth 进行真正的注册
      const result = await register(registerData.email, registerData.password, registerData.name);
      
      if (result.success) {
        console.log('注册成功');
        // 注册成功后跳转到首页
        router.push('/');
      } else {
        setError(result.error || '注册失败，请重试');
      }
    } catch (err) {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 如果用户已经登录，显示登录状态
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">已登录成功</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">欢迎回来，{user.name}！</p>
                <p className="text-green-600 text-sm">积分：{user.credits}</p>
              </div>
              <Button 
                onClick={() => router.push('/')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                前往首页
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Nano Banana
          </h1>
          <p className="text-gray-600 text-lg">AI驱动的智能认证平台</p>
          <p className="text-sm text-gray-500 mt-1">体验世界级的用户认证系统</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* 智能登录表单 */}
          <div className="order-2 lg:order-1">
            <Card className="relative overflow-hidden">
              {/* AI分析指示器 */}
              {isAnalyzing && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                  <CardTitle className="text-2xl font-bold">
                    {isLogin ? '智能登录' : '创建账户'}
                  </CardTitle>
                </div>
                <p className="text-gray-600">
                  {isLogin ? 'AI为您推荐最佳登录方式' : '注册新账户开始使用'}
                </p>
                
                {/* 风险等级指示器 */}
                {isLogin && (
                  <div className="flex items-center justify-center mt-2">
                    <Badge className={`${getRiskLevelColor(riskLevel)} flex items-center gap-1`}>
                      <Shield className="h-4 w-4" />
                      安全等级: {riskLevel === 'low' ? '低' : riskLevel === 'medium' ? '中' : '高'}
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      智能登录
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      注册
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">邮箱</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="请输入邮箱"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">密码</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请输入密码"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading || isAnalyzing}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            智能登录中...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            智能登录
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">姓名</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="请输入姓名"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">邮箱</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="请输入邮箱"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">密码</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请输入密码（至少6位）"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">确认密码</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="请再次输入密码"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            注册中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            智能注册
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* 错误提示 */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>注册即表示你同意我们的</p>
                  <p>
                    <a href="/terms" className="text-blue-600 hover:underline">服务条款</a>
                    {' '}和{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 智能特性展示 */}
          <div className="order-1 lg:order-2">
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">智能认证特性</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🧠</span>
                    </div>
                    <div>
                      <h4 className="font-medium">AI驱动建议</h4>
                      <p className="text-sm text-gray-600">根据用户行为推荐最佳登录方式</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-medium">实时风险评估</h4>
                      <p className="text-sm text-gray-600">动态监控安全等级，智能调整认证策略</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎤</span>
                    </div>
                    <div>
                      <h4 className="font-medium">语音识别</h4>
                      <p className="text-sm text-gray-600">支持语音登录，提升用户体验</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👆</span>
                    </div>
                    <div>
                      <h4 className="font-medium">生物识别</h4>
                      <p className="text-sm text-gray-600">指纹、面部识别等生物认证</p>
                    </div>
                  </div>
                </div>
                
                {/* 测试账户信息 */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">🧪 测试账户</h4>
                  <div className="text-sm text-yellow-700">
                    <p><strong>邮箱:</strong> tset123qq@example.com</p>
                    <p><strong>密码:</strong> 123123</p>
                    <p className="mt-2 text-xs">使用此账户体验智能认证功能</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
