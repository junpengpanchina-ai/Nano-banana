"use client";

import { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

export function AdSenseBanner({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  className = '',
  responsive = true,
  fullWidthResponsive = true
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // 检查是否已经加载了AdSense脚本
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        // 如果已经加载，直接推送广告
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } else {
        // 加载AdSense脚本
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
          // 脚本加载完成后推送广告
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        };
      }
    } catch (error) {
      console.error('AdSense加载失败:', error);
    }
  }, [adSlot]);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
