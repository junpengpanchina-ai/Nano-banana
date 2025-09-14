"use client";

import { AdSenseBanner } from './adsense-banner';

// 顶部横幅广告
export function HeaderAd() {
  return (
    <div className="w-full py-2">
      <AdSenseBanner
        adSlot="1234567890"
        adFormat="horizontal"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

// 侧边栏广告
export function SidebarAd() {
  return (
    <div className="w-full">
      <AdSenseBanner
        adSlot="1234567891"
        adFormat="rectangle"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

// 内容中广告
export function ContentAd() {
  return (
    <div className="w-full my-4">
      <AdSenseBanner
        adSlot="1234567892"
        adFormat="rectangle"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

// 底部横幅广告
export function FooterAd() {
  return (
    <div className="w-full py-2">
      <AdSenseBanner
        adSlot="1234567894"
        adFormat="horizontal"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

// 移动端广告
export function MobileAd() {
  return (
    <div className="w-full md:hidden">
      <AdSenseBanner
        adSlot="1234567895"
        adFormat="auto"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}

// 桌面端广告
export function DesktopAd() {
  return (
    <div className="hidden md:block w-full">
      <AdSenseBanner
        adSlot="1234567896"
        adFormat="rectangle"
        className="w-full"
        responsive={true}
        adStyle={{ display: 'block', width: '100%' }}
      />
    </div>
  );
}
