"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Gift,
  Clock,
  CheckCircle
} from "lucide-react";

interface AdSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onAdComplete: (credits: number) => void;
  adType: 'video' | 'banner' | 'interstitial';
  creditsReward: number;
}

interface Ad {
  id: string;
  title: string;
  description: string;
  duration: number; // 秒
  thumbnail: string;
  videoUrl?: string;
  bannerUrl?: string;
  credits: number;
  advertiser: string;
}

const mockAds: Ad[] = [
  {
    id: "1",
    title: "最新手机游戏 - 王者荣耀",
    description: "5V5公平竞技手游，立即下载体验！",
    duration: 30,
    thumbnail: "https://picsum.photos/400/225?random=1",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    credits: 2,
    advertiser: "腾讯游戏"
  },
  {
    id: "2", 
    title: "购物节大促销",
    description: "全场商品5折起，限时抢购！",
    duration: 20,
    thumbnail: "https://picsum.photos/400/225?random=2",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    credits: 1,
    advertiser: "电商平台"
  },
  {
    id: "3",
    title: "学习新技能",
    description: "在线编程课程，从零开始学编程",
    duration: 25,
    thumbnail: "https://picsum.photos/400/225?random=3", 
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    credits: 3,
    advertiser: "在线教育"
  }
];

export function AdSystem({ isOpen, onClose, onAdComplete, adType, creditsReward }: AdSystemProps) {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // 随机选择一个广告
      const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];
      setCurrentAd(randomAd);
      setTimeLeft(randomAd.duration);
      setProgress(0);
      setIsCompleted(false);
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const newProgress = ((currentAd?.duration || 0) - newTime) / (currentAd?.duration || 1) * 100;
          setProgress(newProgress);
          
          if (newTime <= 0) {
            setIsPlaying(false);
            setIsCompleted(true);
            onAdComplete(currentAd?.credits || 0);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, currentAd, onAdComplete]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSkip = () => {
    if (timeLeft > 5) { // 至少观看5秒才能跳过
      setIsPlaying(false);
      setIsCompleted(true);
      onAdComplete(Math.floor((currentAd?.credits || 0) * 0.5)); // 给一半积分
    }
  };

  const handleClose = () => {
    if (isCompleted || timeLeft <= 0) {
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentAd) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-yellow-500" />
              <span>观看广告获取积分</span>
            </span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              +{currentAd.credits} 积分
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 广告内容 */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              {adType === 'video' ? (
                <div className="relative w-full h-full">
                  <img 
                    src={currentAd.thumbnail} 
                    alt={currentAd.title}
                    className="w-full h-full object-cover"
                  />
                  {!isCompleted && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                  )}
                  
                  {/* 进度条 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <Progress value={progress} className="w-full mb-2" />
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>{formatTime(timeLeft)}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:bg-white hover:bg-opacity-20"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        {timeLeft > 5 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleSkip}
                            className="text-white hover:bg-white hover:bg-opacity-20"
                          >
                            跳过
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <img 
                    src={currentAd.bannerUrl || currentAd.thumbnail} 
                    alt={currentAd.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 广告信息 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{currentAd.title}</h3>
            <p className="text-gray-600">{currentAd.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>广告商: {currentAd.advertiser}</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {currentAd.duration}秒
              </span>
            </div>
          </div>

          {/* 完成状态 */}
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">广告观看完成！</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                恭喜获得 {currentAd.credits} 积分，现在可以生成手办了！
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-2">
            {isCompleted ? (
              <Button onClick={handleClose}>
                继续生成
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
