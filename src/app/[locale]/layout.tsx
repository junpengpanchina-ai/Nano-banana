import type { Metadata } from "next";
import "../globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Script from "next/script";
import { I18nProvider } from "@/components/i18n/i18n-context";

export const metadata: Metadata = {
  title: "Nano Banana - AI人物手办生成平台",
  description: "使用AI技术快速生成个性化人物手办设计，从概念到3D模型一键完成",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const { locale } = params;
  return (
    <html lang={locale}>
      <head>
        {ADS_ENABLED && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxx'}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <I18nProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}



