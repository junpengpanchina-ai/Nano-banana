"use client";

import { useState } from "react";
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

export default function AdSenseAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'settings'>('overview');
  const [mockCredits, setMockCredits] = useState(5);

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
          <h1 className="text-3xl font-bold text-gray-900">AdSense管理面板</h1>
          <p className="text-gray-600 mt-2">管理Google AdSense广告和收入数据</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: '概览', icon: BarChart3 },
              { id: 'ads', label: '广告管理', icon: Eye },
              { id: 'settings', label: '设置', icon: Settings }
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
            {/* 收入统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">今日收入</p>
                      <p className="text-2xl font-bold text-green-600">$12.45</p>
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
                      <p className="text-sm font-medium text-gray-600">总展示次数</p>
                      <p className="text-2xl font-bold text-blue-600">2,847</p>
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
                      <p className="text-sm font-medium text-gray-600">点击率</p>
                      <p className="text-2xl font-bold text-purple-600">2.34%</p>
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
                      <p className="text-sm font-medium text-gray-600">eCPM</p>
                      <p className="text-2xl font-bold text-orange-600">$4.37</p>
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
