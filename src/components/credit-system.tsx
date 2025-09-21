"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Play, 
  Clock, 
  Zap, 
  Star,
  Crown,
  Sparkles
} from "lucide-react";
import { AdSystem } from "./ad-system";
import { useI18n } from "@/components/i18n/i18n-context";
import { formatNumber, formatRelativeTime } from "@/lib/i18n-utils";

interface CreditSystemProps {
  credits: number;
  onCreditsChange: (credits: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function CreditSystem({ credits, onCreditsChange, onGenerate, isGenerating }: CreditSystemProps) {
  const { t, locale } = useI18n();
  const [showAdModal, setShowAdModal] = useState(false);
  const [dailyAdsWatched, setDailyAdsWatched] = useState(0);
  const [maxDailyAds] = useState(10);
  const [nextFreeCredit, setNextFreeCredit] = useState(0);

  // 模拟每日免费积分倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      setNextFreeCredit(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWatchAd = () => {
    if (dailyAdsWatched < maxDailyAds) {
      setShowAdModal(true);
    }
  };

  const handleAdComplete = (earnedCredits: number) => {
    onCreditsChange(credits + earnedCredits);
    setDailyAdsWatched(prev => prev + 1);
    setShowAdModal(false);
  };

  const handleGenerate = () => {
    if (credits >= 2) {
      onGenerate();
    } else {
      // 积分不足，提示观看广告
      setShowAdModal(true);
    }
  };

  const getCreditStatus = () => {
    if (credits >= 10) return { color: "bg-green-500", text: t('credits.status.sufficient') };
    if (credits >= 5) return { color: "bg-yellow-500", text: t('credits.status.moderate') };
    if (credits >= 2) return { color: "bg-orange-500", text: t('credits.status.low') };
    return { color: "bg-red-500", text: t('credits.status.exhausted') };
  };

  const status = getCreditStatus();

  return (
    <div className="space-y-4">
      {/* 积分状态卡片 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('credits.myCredits')}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{formatNumber(credits, locale)}</span>
                  <Badge className={`${status.color} text-white`}>
                    {status.text}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('credits.todayWatched')}</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(dailyAdsWatched, locale)}/{formatNumber(maxDailyAds, locale)} {t('credits.ads')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 获取积分方式 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            <span>{t('credits.getCredits')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 观看广告 */}
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{t('credits.watchAds')}</h4>
                  <p className="text-xs text-gray-600 truncate">{t('credits.watchAdsDesc')}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Button 
                  onClick={handleWatchAd}
                  size="sm"
                  disabled={dailyAdsWatched >= maxDailyAds}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {dailyAdsWatched >= maxDailyAds ? t('credits.reachedLimit') : t('credits.watch')}
                </Button>
                <p className="text-[11px] text-gray-500 mt-1">剩 {maxDailyAds - dailyAdsWatched} 次</p>
              </div>
            </div>

            {/* 每日免费积分 */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{t('credits.dailyFree')}</h4>
                  <p className="text-xs text-gray-600 truncate">{t('credits.dailyFreeDesc')}</p>
                </div>
              </div>
              <Button 
                size="sm"
                disabled={nextFreeCredit > 0}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {nextFreeCredit > 0 ? `待 ${Math.floor(nextFreeCredit / 3600)} 小时` : t('credits.claim')}
              </Button>
            </div>

            {/* 邀请好友 */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 md:col-span-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{t('credits.inviteFriends')}</h4>
                  <p className="text-xs text-gray-600 truncate">{t('credits.inviteReward')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                {t('credits.invite')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成按钮 */}
      <div className="text-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || credits < 2}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('btn.generating')}</span>
            </div>
          ) : credits < 2 ? (
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>{t('credits.watchAdsToGet')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>生成手办 (消耗2积分)</span>
            </div>
          )}
        </Button>
        
        {credits < 2 && (
          <p className="text-sm text-gray-600 mt-2">
            {t('credits.insufficientCredits')}
          </p>
        )}
      </div>

      {/* 广告系统 */}
      <AdSystem
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdComplete={handleAdComplete}
        adType="video"
        creditsReward={2}
      />
    </div>
  );
}
