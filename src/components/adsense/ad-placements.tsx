"use client";

"use client";

import { AdSenseBanner } from './adsense-banner';
import { useEffect, useState } from 'react';

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
const PLACEHOLDER = process.env.NEXT_PUBLIC_ADS_PLACEHOLDER === 'true' || !ADS_ENABLED;

function Placeholder({ height = 90, kind = 'banner' }: { height?: number; kind?: 'banner' | 'rectangle' | 'auto' }) {
  // 为避免SSR/CSR不一致，这里在客户端挂载后再生成随机数
  const [stats, setStats] = useState<{ impressions: number; ecpm: string; revenue: string } | null>(null);
  useEffect(() => {
    const impressions = Math.floor(200 + Math.random() * 800);
    const ecpm = 2 + Math.random() * 3; // $2-$5
    const revenue = (impressions / 1000) * ecpm;
    setStats({ impressions, ecpm: ecpm.toFixed(2), revenue: revenue.toFixed(2) });
  }, []);

  return (
    <div
      className="relative w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center"
      style={{ height }}
    >
      <span className="text-sm">广告占位（{kind}）</span>
      <div className="absolute top-1 right-1 text-[11px] px-2 py-0.5 rounded bg-gray-800 text-white opacity-80">
        {stats ? (
          <>{stats.impressions} 展示 · ${stats.revenue} · eCPM ${stats.ecpm}</>
        ) : (
          <>— 展示 · $— · eCPM —</>
        )}
      </div>
    </div>
  );
}

// 顶部横幅广告
export function HeaderAd() {
  return (
    <div className="w-full py-2">
      {PLACEHOLDER ? (
        <Placeholder height={90} kind="banner" />
      ) : (
        <AdSenseBanner
          slot="1234567890"
          format="horizontal"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}

// 侧边栏广告
export function SidebarAd() {
  return (
    <div className="w-full">
      {PLACEHOLDER ? (
        <Placeholder height={250} kind="rectangle" />
      ) : (
        <AdSenseBanner
          slot="1234567891"
          format="rectangle"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}

// 内容中广告
export function ContentAd() {
  return (
    <div className="w-full my-4">
      {PLACEHOLDER ? (
        <Placeholder height={280} kind="rectangle" />
      ) : (
        <AdSenseBanner
          slot="1234567892"
          format="rectangle"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}

// 底部横幅广告
export function FooterAd() {
  return (
    <div className="w-full py-2">
      {PLACEHOLDER ? (
        <Placeholder height={90} kind="banner" />
      ) : (
        <AdSenseBanner
          slot="1234567894"
          format="horizontal"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}

// 移动端广告
export function MobileAd() {
  return (
    <div className="w-full md:hidden">
      {PLACEHOLDER ? (
        <Placeholder height={60} kind="auto" />
      ) : (
        <AdSenseBanner
          slot="1234567895"
          format="auto"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}

// 桌面端广告
export function DesktopAd() {
  return (
    <div className="hidden md:block w-full">
      {PLACEHOLDER ? (
        <Placeholder height={250} kind="rectangle" />
      ) : (
        <AdSenseBanner
          slot="1234567896"
          format="rectangle"
          className="w-full"
          responsive={true}
          adStyle={{ display: 'block', width: '100%' }}
        />
      )}
    </div>
  );
}
