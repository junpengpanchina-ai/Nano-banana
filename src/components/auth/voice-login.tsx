"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  XCircle,
  Loader2,
  Settings,
  Headphones
} from 'lucide-react';

interface VoiceLoginProps {
  onLoginSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

interface VoiceAnalysis {
  confidence: number;
  text: string;
  language: string;
  emotion: string;
  isUserVoice: boolean;
}

export function VoiceLogin({ onLoginSuccess, onError }: VoiceLoginProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        startAudioVisualization();
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          maxConfidence = Math.max(maxConfidence, confidence);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        setConfidence(Math.round(maxConfidence * 100));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`语音识别错误: ${event.error}`);
        setIsListening(false);
        stopAudioVisualization();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopAudioVisualization();
        
        if (transcript) {
          processVoiceLogin();
        }
      };
    }
  }, [transcript]);

  // 音频可视化
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current || !isListening) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        setVolume(Math.round(average));
        
        // 更新音频波形
        const levels = Array.from(dataArray).slice(0, 20);
        setAudioLevel(levels);
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // 开始/停止录音
  const toggleRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      stopAudioVisualization();
    } else {
      setTranscript('');
      setError(null);
      recognitionRef.current?.start();
    }
  };

  // 处理语音登录
  const processVoiceLogin = async () => {
    setIsProcessing(true);
    
    try {
      // 模拟语音分析
      const mockAnalysis: VoiceAnalysis = {
        confidence: confidence,
        text: transcript,
        language: 'zh-CN',
        emotion: getEmotionFromText(transcript),
        isUserVoice: Math.random() > 0.2 // 80% 概率认为是用户声音
      };
      
      setAnalysis(mockAnalysis);
      
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (mockAnalysis.isUserVoice && mockAnalysis.confidence > 70) {
        // 模拟成功的登录
        const mockResult = {
          success: true,
          user: {
            id: 'voice-user-123',
            email: 'tset123qq@example.com',
            name: '语音用户',
            credits: 10
          }
        };
        
        onLoginSuccess?.(mockResult);
      } else {
        throw new Error('语音验证失败，请重试');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '语音登录失败';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 从文本分析情绪
  const getEmotionFromText = (text: string): string => {
    const positiveWords = ['好', '是', '对', '可以', '确认', '登录', '进入'];
    const negativeWords = ['不', '错', '错误', '失败', '取消'];
    
    const hasPositive = positiveWords.some(word => text.includes(word));
    const hasNegative = negativeWords.some(word => text.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  };

  // 获取情绪颜色
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 获取情绪图标
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mic className="h-6 w-6 text-blue-500" />
          语音登录
        </CardTitle>
        <p className="text-sm text-gray-600">
          说出您的登录信息进行身份验证
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 音频可视化 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
            }`}>
              {isListening ? (
                <MicOff className="h-8 w-8 text-red-500" />
              ) : (
                <Mic className="h-8 w-8 text-blue-500" />
              )}
            </div>
          </div>

          {/* 音量指示器 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">音量</span>
              <div className="flex items-center gap-2">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="text-sm">{volume}%</span>
              </div>
            </div>
            <Progress value={volume} className="h-2" />
          </div>

          {/* 音频波形 */}
          {isListening && audioLevel.length > 0 && (
            <div className="flex items-center justify-center gap-1 h-8">
              {audioLevel.map((level, index) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-sm transition-all duration-100"
                  style={{
                    width: '3px',
                    height: `${Math.max(4, (level / 255) * 32)}px`,
                    opacity: level > 50 ? 1 : 0.5
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-3">
          <Button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
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
            variant="outline"
            onClick={() => setIsMuted(!isMuted)}
            className="px-3"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* 识别结果 */}
        {transcript && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">识别结果</span>
                <Badge variant="outline">置信度: {confidence}%</Badge>
              </div>
              <p className="text-sm text-gray-700">{transcript}</p>
            </div>

            {/* 语音分析结果 */}
            {analysis && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">语音分析:</span>
                  <Badge className={`${getEmotionColor(analysis.emotion)} flex items-center gap-1`}>
                    <span>{getEmotionIcon(analysis.emotion)}</span>
                    {analysis.emotion}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600">语言:</span>
                    <span className="ml-1 font-medium">{analysis.language}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">验证:</span>
                    <span className="ml-1 font-medium">
                      {analysis.isUserVoice ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          通过
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          失败
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 处理状态 */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-blue-700">正在处理语音数据...</span>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* 使用提示 */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-2">
            <Headphones className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">使用提示:</p>
              <ul className="space-y-1 text-xs">
                <li>• 请清晰地说出您的邮箱地址</li>
                <li>• 确保在安静的环境中进行录音</li>
                <li>• 距离麦克风20-30厘米效果最佳</li>
                <li>• 支持中文和英文语音识别</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
