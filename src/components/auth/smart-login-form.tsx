"use client";

import { useState, useEffect, useRef } from 'react';
import { useSmartAuth, LoginSuggestion } from './smart-auth-context';
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
  Mic,
  MicOff,
  Smartphone,
  Zap,
  Shield,
  Brain,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface SmartLoginFormProps {
  onSuccess?: () => void;
}

export function SmartLoginForm({ onSuccess }: SmartLoginFormProps) {
  const { 
    smartLogin, 
    voiceLogin, 
    biometricLogin, 
    getLoginSuggestions, 
    isAnalyzing, 
    riskLevel,
    register 
  } = useSmartAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LoginSuggestion[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'voice' | 'biometric'>('email');
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [smartTips, setSmartTips] = useState<string[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognitionRef.current = new (window as any).SpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setVoiceText(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // 获取智能建议
  useEffect(() => {
    if (loginData.email && loginData.email.includes('@')) {
      getLoginSuggestions(loginData.email).then(setSuggestions);
    }
  }, [loginData.email, getLoginSuggestions]);

  // 生成智能提示
  useEffect(() => {
    const tips = [];
    
    if (loginData.email && !loginData.email.includes('@')) {
      tips.push('💡 请输入完整的邮箱地址');
    }
    
    if (loginData.password && loginData.password.length < 6) {
      tips.push('💡 密码长度至少6位');
    }
    
    if (suggestions.length > 0) {
      tips.push(`✨ 检测到 ${suggestions.length} 种可用的登录方式`);
    }
    
    if (isAnalyzing) {
      tips.push('🧠 AI正在分析您的登录行为...');
    }
    
    setSmartTips(tips);
  }, [loginData, suggestions, isAnalyzing]);

  const handleSmartLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await smartLogin(loginData.email, loginData.password);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || '登录失败');
      if (result.suggestedNextStep) {
        setSmartTips(prev => [...prev, `💡 ${result.suggestedNextStep}`]);
      }
    }
    
    setLoading(false);
  };

  const handleVoiceLogin = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceText('');
    recognitionRef.current?.start();
  };

  const handleVoiceSubmit = async () => {
    if (!voiceText.trim()) {
      setError('请先进行语音输入');
      return;
    }

    setLoading(true);
    setError(null);

    // 模拟音频数据
    const audioBlob = new Blob(['voice_data'], { type: 'audio/wav' });
    const result = await voiceLogin(audioBlob);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || '语音登录失败');
      if (result.suggestedNextStep) {
        setSmartTips(prev => [...prev, `💡 ${result.suggestedNextStep}`]);
      }
    }
    
    setLoading(false);
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    setError(null);

    const result = await biometricLogin();
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || '生物识别失败');
      if (result.suggestedNextStep) {
        setSmartTips(prev => [...prev, `💡 ${result.suggestedNextStep}`]);
      }
    }
    
    setLoading(false);
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

    const result = await register(registerData.email, registerData.password, registerData.name);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || '注册失败');
    }
    
    setLoading(false);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
                {getRiskLevelIcon(riskLevel)}
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
              {/* 登录方式选择 */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={selectedMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMethod('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    邮箱登录
                  </Button>
                  <Button
                    variant={selectedMethod === 'voice' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMethod('voice')}
                    className="flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    语音登录
                  </Button>
                  <Button
                    variant={selectedMethod === 'biometric' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMethod('biometric')}
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    生物识别
                  </Button>
                </div>

                {/* 智能建议 */}
                {suggestions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">AI推荐:</p>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => setSelectedMethod(suggestion.type)}
                      >
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{suggestion.reason}</p>
                          <p className="text-xs text-gray-600">置信度: {Math.round(suggestion.confidence * 100)}%</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-blue-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 邮箱登录表单 */}
              {selectedMethod === 'email' && (
                <form onSubmit={handleSmartLogin} className="space-y-4">
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
              )}

              {/* 语音登录 */}
              {selectedMethod === 'voice' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
                    }`}>
                      <Mic className={`h-8 w-8 ${isListening ? 'text-red-500' : 'text-blue-500'}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {isListening ? '正在听取您的语音...' : '点击麦克风开始语音登录'}
                    </p>
                    
                    {voiceText && (
                      <div className="p-3 bg-gray-50 rounded-lg mb-4">
                        <p className="text-sm font-medium">识别结果:</p>
                        <p className="text-sm text-gray-700">{voiceText}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleVoiceLogin}
                      className="flex-1"
                      variant={isListening ? "destructive" : "default"}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          停止录音
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          开始录音
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleVoiceSubmit}
                      disabled={!voiceText || loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      确认登录
                    </Button>
                  </div>
                </div>
              )}

              {/* 生物识别登录 */}
              {selectedMethod === 'biometric' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Smartphone className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      使用您的生物识别信息登录
                    </p>
                    <p className="text-xs text-gray-500">
                      支持指纹、面部识别等
                    </p>
                  </div>

                  <Button
                    onClick={handleBiometricLogin}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        验证中...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        生物识别登录
                      </>
                    )}
                  </Button>
                </div>
              )}
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

          {/* 智能提示 */}
          {smartTips.length > 0 && (
            <div className="mt-4 space-y-2">
              {smartTips.map((tip, index) => (
                <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-600">{tip}</p>
                </div>
              ))}
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
  );
}
