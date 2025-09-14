"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, X, SkipForward } from 'lucide-react';

interface AdSenseVideoProps {
  adSlot: string;
  onAdComplete: (credits: number) => void;
  onAdSkip: () => void;
  onAdClose: () => void;
  creditsReward: number;
  className?: string;
}

export function AdSenseVideo({ 
  adSlot, 
  onAdComplete, 
  onAdSkip, 
  onAdClose,
  creditsReward,
  className = ''
}: AdSenseVideoProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // 模拟广告加载
    const timer = setTimeout(() => {
      setIsAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // 5秒后可以跳过
          if (newTime >= 5) {
            setCanSkip(true);
          }
          
          // 广告结束
          if (newTime >= duration) {
            setIsPlaying(false);
            onAdComplete(creditsReward);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, onAdComplete, creditsReward]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    if (canSkip) {
      onAdSkip();
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <Card className={`adsense-video-container ${className}`}>
      <CardContent className="p-0">
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* AdSense视频广告位 */}
          <div 
            ref={videoRef}
            className="aspect-video relative"
          >
            {!isAdLoaded ? (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>加载广告中...</p>
                </div>
              </div>
            ) : (
              <>
                {/* 这里应该是真实的AdSense视频广告 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-2">AdSense视频广告</h3>
                    <p className="text-sm opacity-80">广告位: {adSlot}</p>
                    <p className="text-xs opacity-60 mt-1">奖励: {creditsReward} 积分</p>
                  </div>
                </div>

                {/* 播放控制覆盖层 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  {!isPlaying ? (
                    <Button 
                      size="lg" 
                      onClick={handlePlay}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      播放广告
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={handlePause}
                    >
                      <Pause className="w-6 h-6 mr-2" />
                      暂停
                    </Button>
                  )}
                </div>

                {/* 进度条和控制栏 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
                  <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>{formatTime(duration - currentTime)}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMute}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      
                      {canSkip && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleSkip}
                          className="text-white hover:bg-white hover:bg-opacity-20"
                        >
                          <SkipForward className="w-4 h-4 mr-1" />
                          跳过
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onAdClose}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
