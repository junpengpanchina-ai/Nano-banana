"use client";

import { useState, useEffect } from 'react';
import { AdSenseBanner } from './adsense-banner';
import { AdSenseVideo } from './adsense-video';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Play, 
  Image as ImageIcon,
  Settings,
  Eye,
  DollarSign
} from 'lucide-react';

interface AdSenseManagerProps {
  onAdComplete: (credits: number) => void;
  onAdSkip: () => void;
  onAdClose: () => void;
  isAdModalOpen: boolean;
  creditsReward: number;
}

interface AdPlacement {
  id: string;
  name: string;
  type: 'banner' | 'video' | 'interstitial';
  slot: string;
  position: string;
  size: string;
  responsive: boolean;
  enabled: boolean;
  revenue: number;
  impressions: number;
}

export function AdSenseManager({ 
  onAdComplete, 
  onAdSkip, 
  onAdClose, 
  isAdModalOpen,
  creditsReward 
}: AdSenseManagerProps) {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([
    {
      id: '1',
      name: '顶部横幅广告',
      type: 'banner',
      slot: '1234567890',
      position: 'header',
      size: '728x90',
      responsive: true,
      enabled: true,
      revenue: 0,
      impressions: 0
    },
    {
      id: '2',
      name: '侧边栏广告',
      type: 'banner',
      slot: '1234567891',
      position: 'sidebar',
      size: '300x250',
      responsive: true,
      enabled: true,
      revenue: 0,
      impressions: 0
    },
    {
      id: '3',
      name: '内容中广告',
      type: 'banner',
      slot: '1234567892',
      position: 'content',
      size: '336x280',
      responsive: true,
      enabled: true,
      revenue: 0,
      impressions: 0
    },
    {
      id: '4',
      name: '视频广告',
      type: 'video',
      slot: '1234567893',
      position: 'modal',
      size: '640x480',
      responsive: true,
      enabled: true,
      revenue: 0,
      impressions: 0
    },
    {
      id: '5',
      name: '底部横幅广告',
      type: 'banner',
      slot: '1234567894',
      position: 'footer',
      size: '728x90',
      responsive: true,
      enabled: true,
      revenue: 0,
      impressions: 0
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAdSettings, setShowAdSettings] = useState(false);

  // 模拟广告收入数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setAdPlacements(prev => prev.map(ad => ({
        ...ad,
        revenue: ad.revenue + Math.random() * 0.1,
        impressions: ad.impressions + Math.floor(Math.random() * 5)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'interstitial': return <Eye className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const totalRevenue = adPlacements.reduce((sum, ad) => sum + ad.revenue, 0);
  const totalImpressions = adPlacements.reduce((sum, ad) => sum + ad.impressions, 0);

  return (
    <div className="space-y-6">
      {/* 广告收入概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>广告收入概览</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">今日收入</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalImpressions}</p>
              <p className="text-sm text-gray-600">总展示次数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {totalImpressions > 0 ? (totalRevenue / totalImpressions * 1000).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-600">eCPM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 设备选择 */}
      <Card>
        <CardHeader>
          <CardTitle>设备预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <Button
                key={device}
                variant={selectedDevice === device ? 'default' : 'outline'}
                onClick={() => setSelectedDevice(device)}
                className="flex items-center space-x-2"
              >
                {getDeviceIcon(device)}
                <span className="capitalize">{device}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 广告位管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>广告位管理</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdSettings(!showAdSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adPlacements.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAdTypeIcon(ad.type)}
                  <div>
                    <h4 className="font-medium">{ad.name}</h4>
                    <p className="text-sm text-gray-600">
                      {ad.position} • {ad.size} • Slot: {ad.slot}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">${ad.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{ad.impressions} 展示</p>
                  </div>
                  <Badge variant={ad.enabled ? 'default' : 'secondary'}>
                    {ad.enabled ? '启用' : '禁用'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 广告设置面板 */}
      {showAdSettings && (
        <Card>
          <CardHeader>
            <CardTitle>AdSense配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">AdSense集成说明</h4>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>1. 在Google AdSense中创建广告单元</p>
                <p>2. 获取广告单元ID和客户端ID</p>
                <p>3. 在环境变量中配置：</p>
                <code className="block bg-yellow-100 p-2 rounded text-xs">
                  NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
                </code>
                <p>4. 替换广告位ID为真实的AdSense广告位ID</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">客户端ID</label>
                <input 
                  type="text" 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="ca-pub-xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-medium">默认广告位</label>
                <input 
                  type="text" 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="1234567890"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 视频广告模态框 */}
      {isAdModalOpen && (
        <AdSenseVideo
          adSlot="1234567893"
          onAdComplete={onAdComplete}
          onAdSkip={onAdSkip}
          onAdClose={onAdClose}
          creditsReward={creditsReward}
        />
      )}
    </div>
  );
}
