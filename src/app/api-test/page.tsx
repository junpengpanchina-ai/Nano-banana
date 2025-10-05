"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSmartAuth } from '@/components/auth/smart-auth-context';
import { useMembership } from '@/components/payment/membership-provider';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Eye,
  Copy,
  Download,
  RefreshCw,
  Crown,
  Gift,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface GenerationLog {
  id: string;
  timestamp: string;
  prompt: string;
  status: 'success' | 'error' | 'pending';
  duration?: string;
  creditsUsed: number;
  creditsRemaining: number;
  error?: string;
  imageUrl?: string;
}

export default function CreditTestPage() {
  const { user, updateCredits } = useSmartAuth();
  const { openMembershipModal } = useMembership();
  
  const [prompt, setPrompt] = useState("anime figure, cute girl, standing pose");
  const [style, setStyle] = useState("anime");
  const [pose, setPose] = useState("standing");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [currentLog, setCurrentLog] = useState<GenerationLog | null>(null);
  
  const credits = user?.credits || 0;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('🖼️ 图片选择:', file);
    if (file) {
      setImageFile(file);
      console.log('✅ 图片文件已设置:', file.name, file.size, file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        console.log('✅ 图片预览已设置');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入描述词');
      return;
    }

    // 测试页面不需要积分限制
    // if (credits < 2) {
    //   alert('积分不足，请先充值');
    //   openMembershipModal();
    //   return;
    // }

    const logId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    
    const newLog: GenerationLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      prompt,
      status: 'pending',
      creditsUsed: 2,
      creditsRemaining: credits - 2
    };

    setCurrentLog(newLog);
    setLogs(prev => [newLog, ...prev]);
    setIsGenerating(true);
    setProgress(0);

    try {
      console.log(`🚀 [${logId}] 开始生成手办`);
      console.log(`📝 [${logId}] 提示词: "${prompt}", 风格: ${style}, 姿势: ${pose}`);
      console.log(`💰 [${logId}] 消耗积分: 2, 剩余积分: ${credits - 2}`);

      // 创建FormData
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('service', 'grsai');
      formData.append('options', JSON.stringify({
        style: style,
        pose: pose
      }));

      // 如果有上传的图片文件，也添加到FormData
      if (imageFile) {
        formData.append('file', imageFile);
        console.log(`📎 [${logId}] 已添加图片文件到FormData:`, imageFile.name, imageFile.size, imageFile.type);
      } else {
        console.log(`📎 [${logId}] 没有图片文件，仅使用文本生成`);
      }

      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log(`📡 [${logId}] 发送请求到 /api/generate/image`);

      // 调用API
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id || 'demo-key'}`,
          // 注意：使用FormData时不要设置Content-Type，让浏览器自动设置
        },
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const endTime = Date.now();
      const duration = `${endTime - startTime}ms`;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `生成失败: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ [${logId}] 生成成功:`, result);

      // 测试页面不更新积分
      // updateCredits(credits - 2);

      // 更新日志
      const updatedLog: GenerationLog = {
        ...newLog,
        status: 'success',
        duration,
        imageUrl: result.result_url || result.url
      };

      setCurrentLog(updatedLog);
      setLogs(prev => prev.map(log => log.id === logId ? updatedLog : log));

      console.log(`📊 [${logId}] 生成历史:`, {
        timestamp: updatedLog.timestamp,
        prompt: updatedLog.prompt,
        creditsUsed: updatedLog.creditsUsed,
        creditsRemaining: updatedLog.creditsRemaining,
        duration: updatedLog.duration,
        success: true,
        imageUrl: updatedLog.imageUrl
      });

    } catch (error) {
      const endTime = Date.now();
      const duration = `${endTime - startTime}ms`;
      
      console.error(`❌ [${logId}] 生成失败:`, error);
      
      const updatedLog: GenerationLog = {
        ...newLog,
        status: 'error',
        duration,
        error: error instanceof Error ? error.message : '未知错误'
      };

      setCurrentLog(updatedLog);
      setLogs(prev => prev.map(log => log.id === logId ? updatedLog : log));
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const clearLogs = () => {
    setLogs([]);
    setCurrentLog(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎮 积分消费测试页面
          </h1>
          <p className="text-lg text-gray-600">
            测试积分消费和手办生成功能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 积分和生成控制面板 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>积分消费测试</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 积分显示 */}
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">当前积分</span>
                  </div>
                  <span className="text-2xl font-bold">{credits}</span>
                </div>
                <div className="mt-2 text-sm opacity-90">
                  测试模式：不消耗积分
                </div>
              </div>

              {/* 测试模式提示 */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">测试模式</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  此页面用于测试，不消耗积分，可无限次生成
                </p>
              </div>

              {/* 提示词输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">描述词</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要的手办形象..."
                  className="min-h-[100px]"
                />
              </div>

              {/* 图片上传 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">参考图片（可选）</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img src={imagePreview} alt="预览" className="w-32 h-32 object-cover mx-auto rounded" />
                        <p className="text-sm text-gray-600">点击更换图片</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">点击上传参考图片</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* 风格和姿势选择 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">风格</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择风格" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anime">动漫风格</SelectItem>
                      <SelectItem value="realistic">写实风格</SelectItem>
                      <SelectItem value="cartoon">卡通风格</SelectItem>
                      <SelectItem value="chibi">Q版风格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">姿势</label>
                  <Select value={pose} onValueChange={setPose}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择姿势" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standing">站立</SelectItem>
                      <SelectItem value="sitting">坐姿</SelectItem>
                      <SelectItem value="action">动作</SelectItem>
                      <SelectItem value="cute">可爱姿势</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>生成中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>生成手办 (测试模式)</span>
                  </div>
                )}
              </Button>

              {/* 进度条 */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API调用进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* 当前状态 */}
              {currentLog && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">当前生成状态</span>
                    {getStatusIcon(currentLog.status)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">消耗积分:</span>
                      <span className="text-blue-600">{currentLog.creditsUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">剩余积分:</span>
                      <span className="text-blue-600">{currentLog.creditsRemaining}</span>
                    </div>
                    {currentLog.duration && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">耗时:</span>
                        <span className="text-blue-600">{currentLog.duration}</span>
                      </div>
                    )}
                    {currentLog.error && (
                      <div className="text-red-600 text-xs mt-2">
                        错误: {currentLog.error}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 生成历史 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>生成历史</span>
                </CardTitle>
                <Button
                  onClick={clearLogs}
                  variant="outline"
                  size="sm"
                  disabled={logs.length === 0}
                >
                  清空历史
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无生成记录
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          <Badge className={getStatusColor(log.status)}>
                            {log.status === 'success' ? '成功' : 
                             log.status === 'error' ? '失败' : '进行中'}
                          </Badge>
                          <span className="text-sm font-medium">消耗 {log.creditsUsed} 积分</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="font-medium">描述词:</div>
                        <div className="truncate">{log.prompt}</div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>剩余积分: {log.creditsRemaining}</span>
                        {log.duration && <span>耗时: {log.duration}</span>}
                      </div>
                      
                      {log.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                          错误: {log.error}
                        </div>
                      )}
                      
                      {log.imageUrl && (
                        <div className="mt-2 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(log.imageUrl, '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            查看图片
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(log.imageUrl!)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            复制链接
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📖 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. 测试模式</h4>
                <p>此页面为测试模式，不消耗积分，可无限次生成手办进行测试</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. 输入描述词</h4>
                <p>描述你想要的手办形象，比如"可爱的动漫女孩，粉色头发"</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. 选择风格和姿势</h4>
                <p>选择动漫风格、写实风格等，以及站立、坐姿等姿势</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. 开始生成</h4>
                <p>点击"生成手办"按钮，系统会生成手办图片（测试模式不消耗积分）</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">5. 查看结果</h4>
                <p>在生成历史中查看每次生成的详细信息和结果图片</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">💡 提示</h4>
                <p className="text-yellow-800">这个页面是测试模式，不消耗积分，可以无限次测试手办生成功能。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
