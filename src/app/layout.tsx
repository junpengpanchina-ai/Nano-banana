import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { I18nProvider } from "@/components/i18n/i18n-context";
import { Footer } from "@/components/layout/footer";
import { HeaderAd, FooterAd } from "@/components/adsense/ad-placements";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nano Banana - AI人物手办生成平台",
  description: "使用AI技术快速生成个性化人物手办设计，从概念到3D模型一键完成",
  keywords: "AI, 手办, 3D模型, 人物生成, 个性化定制",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  return (
    <html lang="zh-CN">
      <head>
        {/* Google AdSense脚本（仅生产/开启时加载） */}
        {ADS_ENABLED && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxx'}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* 顶部广告 */}
            {ADS_ENABLED && <HeaderAd />}
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            {/* 底部广告 */}
            {ADS_ENABLED && <FooterAd />}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}