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
import { useI18n } from "@/components/i18n/i18n-context";
import { useAuth } from "@/components/auth/auth-context";
import { formatNumber, formatRelativeTime } from "@/lib/i18n-utils";

interface CreditSystemProps {
  credits: number;
  onCreditsChange: (credits: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function CreditSystem({ credits, onCreditsChange, onGenerate, isGenerating }: CreditSystemProps) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [nextFreeCredit, setNextFreeCredit] = useState(0);

  // 模拟每日免费积分倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      setNextFreeCredit(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  const handleGenerate = () => {
    if (credits >= 2) {
      onGenerate();
    } else {
      // 积分不足，提示等待每日免费积分
      alert('积分不足，请等待每日免费积分或稍后再试');
    }
  };

  // 领取每日免费积分
  const handleClaimDailyFree = () => {
    if (nextFreeCredit > 0) {
      alert('请等待冷却时间结束');
      return;
    }
    
    // 添加5个积分
    onCreditsChange(credits + 5);
    
    // 设置24小时冷却时间
    setNextFreeCredit(24 * 3600); // 24小时 = 86400秒
    
    alert('成功领取5个免费积分！');
  };

  // 邀请好友
  const handleInviteFriends = () => {
    // 生成邀请链接
    const inviteCode = `INVITE_${Date.now()}`;
    const inviteLink = `${window.location.origin}?ref=${inviteCode}`;
    
    // 复制邀请链接到剪贴板
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert(`邀请链接已复制到剪贴板：\n${inviteLink}\n\n好友注册成功后，你将获得10积分奖励！`);
    }).catch(() => {
      alert(`邀请链接：\n${inviteLink}\n\n请手动复制此链接发送给好友，好友注册成功后，你将获得10积分奖励！`);
    });
  };

  const getCreditStatus = () => {
    if (credits >= 10) return { color: "bg-green-500", text: t('credits.status.sufficient') };
    if (credits >= 5) return { color: "bg-yellow-500", text: t('credits.status.moderate') };
    if (credits >= 2) return { color: "bg-orange-500", text: t('credits.status.low') };
    return { color: "bg-red-500", text: t('credits.status.exhausted') };
  };

  const status = getCreditStatus();

  // 如果用户未登录，显示登录提示
  if (!user) {
    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">需要登录</h3>
              <p className="text-sm text-gray-600 mb-4">
                登录后即可使用积分系统，获取免费积分和更多功能
              </p>
              <a 
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                立即登录
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                onClick={handleClaimDailyFree}
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleInviteFriends}
                className="border-purple-300 text-purple-700"
              >
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

    </div>
  );
}
