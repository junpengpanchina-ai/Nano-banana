"use client";

import { useState, useEffect } from "react";
import { AdSenseManager } from "@/components/adsense/adsense-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  BarChart3, 
  DollarSign, 
  Eye,
  Play,
  Image as ImageIcon
} from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-context";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/i18n-utils";

export default function AdSenseAdminPage() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'settings'>('overview');
  const [mockCredits, setMockCredits] = useState(5);
  const PLACEHOLDER = process.env.NEXT_PUBLIC_ADS_PLACEHOLDER === 'true' || process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true';
  const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';

  // 模拟收益本地持久化
  type SimStats = {
    date: string;
    revenue: number;
    impressions: number;
    ecpm: number;
  };
  const [simStats, setSimStats] = useState<SimStats | null>(null);
  
  function seedSimStats(): SimStats {
    const today = new Date().toISOString().slice(0, 10);
    const impressions = Math.floor(2000 + Math.random() * 6000);
    const ecpm = parseFloat((2 + Math.random() * 3).toFixed(2));
    const revenue = parseFloat(((impressions / 1000) * ecpm).toFixed(2));
    return { date: today, impressions, ecpm, revenue };
  }

  function loadOrInitSimStats(): SimStats {
    try {
      const raw = localStorage.getItem('nb_sim_ads_stats');
      if (raw) {
        const saved: SimStats = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        if (saved.date === today) return saved;
      }
    } catch {}
    const seeded = seedSimStats();
    localStorage.setItem('nb_sim_ads_stats', JSON.stringify(seeded));
    return seeded;
  }

  function refreshSimStats() {
    const next = seedSimStats();
    localStorage.setItem('nb_sim_ads_stats', JSON.stringify(next));
    setSimStats(next);
  }

  // 初始化
  useEffect(() => {
    setSimStats(loadOrInitSimStats());
  }, []);

  const handleAdComplete = (credits: number) => {
    setMockCredits(prev => prev + credits);
  };

  const handleAdSkip = () => {
    console.log('广告跳过');
  };

  const handleAdClose = () => {
    console.log('广告关闭');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('ads.admin.title')}</h1>
          <p className="text-gray-600 mt-2">{t('ads.admin.desc')}</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: t('ads.tabs.overview'), icon: BarChart3 },
              { id: 'ads', label: t('ads.tabs.management'), icon: Eye },
              { id: 'settings', label: t('ads.tabs.settings'), icon: Settings }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center space-x-2"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 占位模式收益模拟 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>占位模式收益模拟</CardTitle>
                  <button
                    className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
                    onClick={refreshSimStats}
                  >
                    重新生成
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-sm text-gray-600">当前模式</p>
                    <p className="text-xl font-semibold">
                      {ADS_ENABLED ? '真实广告' : '占位/本地调试'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">环境变量控制</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-sm text-gray-600">{t('ads.overview.revenue')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(simStats?.revenue ?? 0, locale)}</p>
                    <p className="text-xs text-gray-500 mt-1">依据展示与eCPM随机生成</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-sm text-gray-600">{t('ads.overview.impressions')}</p>
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(simStats?.impressions ?? 0, locale)}</p>
                    <p className="text-xs text-gray-500 mt-1">占位位点近似值</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-sm text-gray-600">{t('ads.overview.ecpm')}</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(simStats?.ecpm ?? 0, locale)}</p>
                    <p className="text-xs text-gray-500 mt-1">$2 - $5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 收入统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('ads.stats.todayRevenue')}</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(12.45, locale)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+12.5% 较昨日</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('ads.stats.totalImpressions')}</p>
                      <p className="text-2xl font-bold text-blue-600">{formatNumber(2847, locale)}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+8.2% 较昨日</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('ads.stats.clickRate')}</p>
                      <p className="text-2xl font-bold text-purple-600">{formatPercent(0.0234, locale)}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+0.5% 较昨日</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('ads.stats.ecpm')}</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(4.37, locale)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+15.3% 较昨日</p>
                </CardContent>
              </Card>
            </div>

            {/* 广告类型统计 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>广告类型收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: '横幅广告', revenue: 8.45, percentage: 68, icon: ImageIcon },
                      { type: '视频广告', revenue: 3.20, percentage: 26, icon: Play },
                      { type: '其他', revenue: 0.80, percentage: 6, icon: Settings }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.revenue}</p>
                          <p className="text-sm text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>设备类型统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { device: '桌面端', impressions: 1856, percentage: 65 },
                      { device: '移动端', impressions: 743, percentage: 26 },
                      { device: '平板端', impressions: 248, percentage: 9 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.device}</span>
                        <div className="text-right">
                          <p className="font-semibold">{item.impressions.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <AdSenseManager
            onAdComplete={handleAdComplete}
            onAdSkip={handleAdSkip}
            onAdClose={handleAdClose}
            isAdModalOpen={false}
            creditsReward={2}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AdSense配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">集成步骤</h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p>1. 访问 <a href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer" className="underline">Google AdSense</a> 创建账户</p>
                    <p>2. 创建广告单元并获取广告位ID</p>
                    <p>3. 在环境变量中配置客户端ID和广告位ID</p>
                    <p>4. 部署应用并等待AdSense审核</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      客户端ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ca-pub-xxxxxxxxxx"
                      defaultValue={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认广告位
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-adsense" className="rounded" defaultChecked />
                  <label htmlFor="enable-adsense" className="text-sm text-gray-700">
                    启用AdSense广告
                  </label>
                </div>

                <Button className="w-full">
                  保存配置
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
