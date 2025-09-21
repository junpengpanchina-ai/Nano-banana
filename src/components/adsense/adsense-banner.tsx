"use client";

import { useEffect, useRef, useState } from 'react';

interface AdSenseBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

export function AdSenseBanner({ 
  slot, 
  format = 'auto', 
  adStyle = { display: 'block' },
  className = '',
  responsive = true,
  fullWidthResponsive = true
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adBlocked, setAdBlocked] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // 检查广告拦截器
    const checkAdBlock = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.cssText = 'position:absolute;left:-10000px;top:-1000px;';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdBlocked(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    const loadAd = () => {
      try {
        // 检查AdSense是否可用
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setAdLoaded(true);
        } else {
          // 等待脚本加载
          const checkAdSense = () => {
            if ((window as any).adsbygoogle) {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              setAdLoaded(true);
            } else {
              setTimeout(checkAdSense, 100);
            }
          };
          checkAdSense();
        }
      } catch (error) {
        console.warn('AdSense加载失败，可能是广告拦截器:', error);
        setAdBlocked(true);
      }
    };

    // 检查广告拦截器
    checkAdBlock();
    
    // 延迟加载广告
    const timer = setTimeout(loadAd, 500);
    return () => clearTimeout(timer);
  }, [slot]);

  // 如果广告被拦截，显示占位符
  if (adBlocked || !process.env.NEXT_PUBLIC_ADSENSE_ENABLED) {
    return (
      <div className={`adsense-placeholder ${className}`} style={adStyle}>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
          <div className="text-sm">
            {adBlocked ? '广告被拦截器阻止' : '广告已禁用'}
          </div>
          <div className="text-xs mt-1">
            开发环境或广告拦截器
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxx'}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
      {!adLoaded && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center text-xs text-gray-400">
          加载广告中...
        </div>
      )}
    </div>
  );
}
