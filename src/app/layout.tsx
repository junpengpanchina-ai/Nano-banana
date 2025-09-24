import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { I18nProvider } from "@/components/i18n/i18n-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { Footer } from "@/components/layout/footer";


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
  return (
    <html lang="zh-CN">
      <head></head>
      <body>
        <I18nProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}