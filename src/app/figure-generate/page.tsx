"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  Image as ImageIcon,
  Settings
} from 'lucide-react';

interface FigureGenerationLog {
  id: string;
  timestamp: string;
  prompt: string;
  imageUrl?: string;
  status: 'success' | 'error' | 'pending';
  duration?: string;
  creditsUsed: number;
  creditsRemaining: number;
  error?: string;
}

export default function FigureGeneratePage() {
  const { user, updateCredits } = useSmartAuth();
  const { openMembershipModal } = useMembership();
  
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<FigureGenerationLog[]>([]);
  const [currentLog, setCurrentLog] = useState<FigureGenerationLog | null>(null);
  
  const credits = user?.credits || 0;

  // 手办生成提示词模板
  const generateFigurePrompt = (description: string) => {
    return `Use the nano-banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork. Character description: ${description}`;
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateFigure = async () => {
    if (!description.trim()) {
      alert('请输入角色描述');
      return;
    }

    const logId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    
    const newLog: FigureGenerationLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      prompt: description,
      status: 'pending',
      creditsUsed: 3, // 手办生成消耗3积分
      creditsRemaining: credits - 3
    };

    setCurrentLog(newLog);
    setLogs(prev => [newLog, ...prev]);
    setIsGenerating(true);
    setProgress(0);

    try {
      console.log(`🚀 [${logId}] 开始生成手办`);
      console.log(`📝 [${logId}] 角色描述: "${description}"`);

      // 生成手办专用提示词
      const figurePrompt = generateFigurePrompt(description);
      console.log(`🎯 [${logId}] 手办提示词: "${figurePrompt}"`);

      // 创建FormData
      const formData = new FormData();
      formData.append('prompt', figurePrompt);
      formData.append('service', 'grsai');
      formData.append('options', JSON.stringify({
        style: 'realistic',
        pose: 'standing',
        figureType: 'commercialized',
        scale: '1/7',
        environment: 'desk'
      }));

      // 如果有上传的图片文件，也添加到FormData
      if (imageFile) {
        formData.append('file', imageFile);
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
      console.log(`✅ [${logId}] 手办生成成功:`, result);

      // 更新用户积分
      updateCredits(credits - 3);

      // 更新日志
      const updatedLog: FigureGenerationLog = {
        ...newLog,
        status: 'success',
        duration,
        imageUrl: result.result_url || result.url
      };

      setCurrentLog(updatedLog);
      setLogs(prev => prev.map(log => log.id === logId ? updatedLog : log));

      console.log(`📊 [${logId}] 手办生成历史:`, {
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
      
      console.error(`❌ [${logId}] 手办生成失败:`, error);
      
      const updatedLog: FigureGenerationLog = {
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
            🎭 手办生成器
          </h1>
          <p className="text-lg text-gray-600">
            基于您的描述生成1/7比例商业化手办模型
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 手办生成控制面板 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>手办生成器</span>
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
                  手办生成消耗 3 积分
                </div>
              </div>

              {/* 充值按钮 */}
              {credits < 3 && (
                <Button
                  onClick={openMembershipModal}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  立即充值
                </Button>
              )}

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

              {/* 角色描述输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">角色描述 *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述您想要制作手办的角色，例如：可爱的动漫女孩，粉色头发，穿着校服..."
                  className="min-h-[120px]"
                />
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerateFigure}
                disabled={isGenerating || !description.trim() || credits < 3}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>生成中...</span>
                  </div>
                ) : credits < 3 ? (
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4" />
                    <span>积分不足，请充值</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>生成手办 (消耗3积分)</span>
                  </div>
                )}
              </Button>

              {/* 进度条 */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>手办生成进度</span>
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
                        <div className="font-medium">角色描述:</div>
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
                            查看手办
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
            <CardTitle>📖 手办生成说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎭 手办生成功能</h4>
                <p>基于您的描述生成1/7比例商业化手办模型，包含完整的展示环境</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📝 提示词模板</h4>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                  Use the nano-banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork.
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎨 生成内容</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>1/7比例手办模型</li>
                  <li>透明亚克力底座</li>
                  <li>电脑桌面环境</li>
                  <li>ZBrush建模过程展示</li>
                  <li>BANDAI风格包装盒</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">💡 提示</h4>
                <p className="text-yellow-800">每次生成消耗3积分，可以上传参考图片来获得更准确的手办效果。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
