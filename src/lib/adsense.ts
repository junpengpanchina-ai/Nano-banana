// AdSense配置和工具函数

export const ADSENSE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxx',
  enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
  adSlots: {
    header: process.env.NEXT_PUBLIC_HEADER_AD_SLOT || '1234567890',
    sidebar: process.env.NEXT_PUBLIC_SIDEBAR_AD_SLOT || '1234567891',
    content: process.env.NEXT_PUBLIC_CONTENT_AD_SLOT || '1234567892',
    video: process.env.NEXT_PUBLIC_VIDEO_AD_SLOT || '1234567893',
    footer: process.env.NEXT_PUBLIC_FOOTER_AD_SLOT || '1234567894',
    mobile: process.env.NEXT_PUBLIC_MOBILE_AD_SLOT || '1234567895',
    desktop: process.env.NEXT_PUBLIC_DESKTOP_AD_SLOT || '1234567896',
  }
};

// 广告位配置
export const AD_PLACEMENTS = {
  header: {
    slot: ADSENSE_CONFIG.adSlots.header,
    format: 'horizontal' as const,
    size: '728x90',
    responsive: true,
  },
  sidebar: {
    slot: ADSENSE_CONFIG.adSlots.sidebar,
    format: 'rectangle' as const,
    size: '300x250',
    responsive: true,
  },
  content: {
    slot: ADSENSE_CONFIG.adSlots.content,
    format: 'rectangle' as const,
    size: '336x280',
    responsive: true,
  },
  video: {
    slot: ADSENSE_CONFIG.adSlots.video,
    format: 'auto' as const,
    size: '640x480',
    responsive: true,
  },
  footer: {
    slot: ADSENSE_CONFIG.adSlots.footer,
    format: 'horizontal' as const,
    size: '728x90',
    responsive: true,
  },
  mobile: {
    slot: ADSENSE_CONFIG.adSlots.mobile,
    format: 'auto' as const,
    size: '320x50',
    responsive: true,
  },
  desktop: {
    slot: ADSENSE_CONFIG.adSlots.desktop,
    format: 'rectangle' as const,
    size: '300x250',
    responsive: true,
  },
};

// 检查AdSense是否可用
export function isAdSenseEnabled(): boolean {
  return ADSENSE_CONFIG.enabled && !!ADSENSE_CONFIG.clientId;
}

// 获取广告位配置
export function getAdPlacement(placement: keyof typeof AD_PLACEMENTS) {
  return AD_PLACEMENTS[placement];
}

// 生成AdSense脚本URL
export function getAdSenseScriptUrl(): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
}

// 推送广告到AdSense
export function pushAdToAdSense(): void {
  if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }
}

// 广告收入统计（模拟数据）
export interface AdRevenue {
  date: string;
  revenue: number;
  impressions: number;
  clicks: number;
  ctr: number;
  ecpm: number;
}

export function getMockAdRevenue(): AdRevenue[] {
  const data: AdRevenue[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseRevenue = Math.random() * 20 + 5;
    const baseImpressions = Math.floor(Math.random() * 1000) + 500;
    const clicks = Math.floor(baseImpressions * (Math.random() * 0.03 + 0.01));
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: parseFloat(baseRevenue.toFixed(2)),
      impressions: baseImpressions,
      clicks: clicks,
      ctr: parseFloat((clicks / baseImpressions * 100).toFixed(2)),
      ecpm: parseFloat((baseRevenue / baseImpressions * 1000).toFixed(2)),
    });
  }
  
  return data;
}

// 广告位性能统计
export interface AdPlacementStats {
  placement: string;
  revenue: number;
  impressions: number;
  clicks: number;
  ctr: number;
  ecpm: number;
  enabled: boolean;
}

export function getAdPlacementStats(): AdPlacementStats[] {
  return Object.entries(AD_PLACEMENTS).map(([key, config]) => ({
    placement: key,
    revenue: Math.random() * 10,
    impressions: Math.floor(Math.random() * 500) + 100,
    clicks: Math.floor(Math.random() * 20) + 5,
    ctr: Math.random() * 3 + 1,
    ecpm: Math.random() * 5 + 2,
    enabled: true,
  }));
}
