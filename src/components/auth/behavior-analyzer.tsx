"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mouse, 
  Keyboard, 
  Clock, 
  Shield, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface BehaviorData {
  typingPattern: {
    speed: number;
    rhythm: number[];
    pausePatterns: number[];
  };
  mousePattern: {
    clickSpeed: number;
    movementPattern: number[];
    scrollBehavior: number;
  };
  timingPattern: {
    sessionDuration: number;
    loginTimes: number[];
    pageViews: number;
  };
  riskScore: number;
  confidence: number;
}

interface BehaviorAnalyzerProps {
  onAnalysisComplete?: (data: BehaviorData) => void;
  isActive?: boolean;
}

export function BehaviorAnalyzer({ onAnalysisComplete, isActive = true }: BehaviorAnalyzerProps) {
  const [behaviorData, setBehaviorData] = useState<BehaviorData>({
    typingPattern: {
      speed: 0,
      rhythm: [],
      pausePatterns: []
    },
    mousePattern: {
      clickSpeed: 0,
      movementPattern: [],
      scrollBehavior: 0
    },
    timingPattern: {
      sessionDuration: 0,
      loginTimes: [],
      pageViews: 0
    },
    riskScore: 0,
    confidence: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 引用和状态
  const startTime = useRef<number>(Date.now());
  const keystrokes = useRef<number[]>([]);
  const mouseEvents = useRef<number[]>([]);
  const scrollEvents = useRef<number[]>([]);
  const lastKeystroke = useRef<number>(0);
  const sessionStartTime = useRef<number>(Date.now());

  // 键盘事件监听
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      const timeSinceLastKeystroke = now - lastKeystroke.current;
      
      keystrokes.current.push(timeSinceLastKeystroke);
      lastKeystroke.current = now;
      
      // 保持最近100个击键记录
      if (keystrokes.current.length > 100) {
        keystrokes.current.shift();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  // 鼠标事件监听
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseEvents.current.push(Date.now());
      
      // 保持最近50个鼠标事件
      if (mouseEvents.current.length > 50) {
        mouseEvents.current.shift();
      }
    };

    const handleScroll = (event: Event) => {
      scrollEvents.current.push(Date.now());
      
      // 保持最近20个滚动事件
      if (scrollEvents.current.length > 20) {
        scrollEvents.current.shift();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive]);

  // 分析行为数据
  const analyzeBehavior = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const currentTime = Date.now();
      const sessionDuration = currentTime - sessionStartTime.current;
      
      // 计算打字模式
      const typingSpeed = keystrokes.current.length > 0 
        ? keystrokes.current.reduce((a, b) => a + b, 0) / keystrokes.current.length 
        : 0;
      
      const rhythm = keystrokes.current.slice(-10); // 最近10个击键间隔
      const pausePatterns = keystrokes.current.filter(t => t > 1000); // 超过1秒的暂停
      
      // 计算鼠标模式
      const clickSpeed = mouseEvents.current.length > 0 
        ? mouseEvents.current.length / (sessionDuration / 1000) 
        : 0;
      
      const movementPattern = mouseEvents.current.slice(-20); // 最近20个鼠标事件
      const scrollBehavior = scrollEvents.current.length;
      
      // 计算风险分数 (0-100)
      let riskScore = 0;
      
      // 基于打字速度的风险评估
      if (typingSpeed < 100) riskScore += 20; // 打字很慢
      if (typingSpeed > 1000) riskScore += 15; // 打字很快
      
      // 基于暂停模式的风险评估
      if (pausePatterns.length > 5) riskScore += 10; // 太多暂停
      
      // 基于鼠标行为的风险评估
      if (clickSpeed < 0.1) riskScore += 15; // 鼠标活动很少
      if (clickSpeed > 2) riskScore += 10; // 鼠标活动过于频繁
      
      // 基于会话时长的风险评估
      if (sessionDuration < 5000) riskScore += 25; // 会话太短
      
      // 随机因素 (模拟真实环境)
      riskScore += Math.random() * 10;
      
      riskScore = Math.min(100, Math.max(0, riskScore));
      
      // 计算置信度
      const confidence = Math.min(95, 60 + (keystrokes.current.length * 0.5) + (mouseEvents.current.length * 0.3));
      
      const newBehaviorData: BehaviorData = {
        typingPattern: {
          speed: Math.round(typingSpeed),
          rhythm: rhythm.slice(-5),
          pausePatterns: [...pausePatterns]
        },
        mousePattern: {
          clickSpeed: Math.round(clickSpeed * 100) / 100,
          movementPattern: movementPattern.slice(-5),
          scrollBehavior
        },
        timingPattern: {
          sessionDuration: Math.round(sessionDuration / 1000),
          loginTimes: [currentTime],
          pageViews: 1
        },
        riskScore: Math.round(riskScore),
        confidence: Math.round(confidence)
      };
      
      setBehaviorData(newBehaviorData);
      setIsAnalyzing(false);
      onAnalysisComplete?.(newBehaviorData);
    }, 2000);
  };

  // 定期分析
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(analyzeBehavior, 10000); // 每10秒分析一次
    return () => clearInterval(interval);
  }, [isActive]);

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: '低', color: 'bg-green-100 text-green-800', icon: Shield };
    if (score < 70) return { level: '中', color: 'bg-yellow-100 text-yellow-800', icon: Activity };
    return { level: '高', color: 'bg-red-100 text-red-800', icon: TrendingUp };
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence < 50) return '低';
    if (confidence < 80) return '中';
    return '高';
  };

  const riskInfo = getRiskLevel(behaviorData.riskScore);
  const RiskIcon = riskInfo.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">行为分析</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${riskInfo.color} flex items-center gap-1`}>
              <RiskIcon className="h-3 w-3" />
              风险: {riskInfo.level}
            </Badge>
            <Badge variant="outline">
              置信度: {getConfidenceLevel(behaviorData.confidence)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 风险分数 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">风险分数</span>
            <span className="text-sm text-gray-600">{behaviorData.riskScore}/100</span>
          </div>
          <Progress 
            value={behaviorData.riskScore} 
            className="h-2"
            style={{
              background: `linear-gradient(to right, 
                ${behaviorData.riskScore < 30 ? '#10b981' : 
                  behaviorData.riskScore < 70 ? '#f59e0b' : '#ef4444'} 
                ${behaviorData.riskScore}%, 
                #f3f4f6 ${behaviorData.riskScore}%)`
            }}
          />
        </div>

        {/* 分析状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${isAnalyzing ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-sm">
              {isAnalyzing ? '正在分析...' : '分析完成'}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showDetails ? '隐藏详情' : '查看详情'}
          </button>
        </div>

        {/* 详细数据 */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t">
            {/* 打字模式 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">打字模式</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">速度:</span>
                  <span className="ml-1 font-medium">{behaviorData.typingPattern.speed}ms</span>
                </div>
                <div>
                  <span className="text-gray-600">暂停:</span>
                  <span className="ml-1 font-medium">{behaviorData.typingPattern.pausePatterns}</span>
                </div>
                <div>
                  <span className="text-gray-600">击键:</span>
                  <span className="ml-1 font-medium">{keystrokes.current.length}</span>
                </div>
              </div>
            </div>

            {/* 鼠标模式 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mouse className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">鼠标模式</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">活动:</span>
                  <span className="ml-1 font-medium">{behaviorData.mousePattern.clickSpeed}/s</span>
                </div>
                <div>
                  <span className="text-gray-600">滚动:</span>
                  <span className="ml-1 font-medium">{behaviorData.mousePattern.scrollBehavior}</span>
                </div>
                <div>
                  <span className="text-gray-600">事件:</span>
                  <span className="ml-1 font-medium">{mouseEvents.current.length}</span>
                </div>
              </div>
            </div>

            {/* 时间模式 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">时间模式</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">会话时长:</span>
                  <span className="ml-1 font-medium">{behaviorData.timingPattern.sessionDuration}s</span>
                </div>
                <div>
                  <span className="text-gray-600">页面浏览:</span>
                  <span className="ml-1 font-medium">{behaviorData.timingPattern.pageViews}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 建议 */}
        {behaviorData.riskScore > 50 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              💡 检测到异常行为模式，建议使用额外的安全验证
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
