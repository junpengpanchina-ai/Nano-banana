"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Image as ImageIcon, 
  Box, 
  Eye, 
  Settings, 
  BarChart3,
  Play,
  Download,
  Share2,
  Heart,
  Gift,
  Zap,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  DollarSign,
  Users,
  Clock
} from "lucide-react";

export default function IndexPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [mockCredits, setMockCredits] = useState(5);

  const handleAdComplete = (credits: number) => {
    setMockCredits(prev => prev + credits);
  };

  const demos = [
    {
      id: "generation",
      title: "AI生成功能",
      description: "文字描述生成3D手办模型",
      icon: Wand2,
      color: "from-purple-500 to-pink-500",
      features: ["文字描述输入", "多种风格选择", "实时生成预览", "3D模型查看"]
    },
    {
      id: "image-upload",
      title: "图片上传",
      description: "上传参考图片生成手办",
      icon: ImageIcon,
      color: "from-blue-500 to-cyan-500",
      features: ["图片上传", "智能识别", "风格转换", "3D重建"]
    },
    {
      id: "3d-model",
      title: "3D模型",
      description: "直接上传3D模型进行编辑",
      icon: Box,
      color: "from-green-500 to-emerald-500",
      features: ["3D模型上传", "实时编辑", "材质调整", "动画预览"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Nano Banana</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/create">
                <Button variant="ghost">开始创建</Button>
              </Link>
              <Link href="/prompts">
                <Button variant="ghost">提示词库</Button>
              </Link>
              <Button variant="outline">登录</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              AI人物手办生成平台
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              从概念到3D模型
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              使用最先进的AI技术，快速生成个性化3D手办设计。支持文字描述、图片上传和3D模型编辑。
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Wand2 className="w-5 h-5 mr-2" />
                开始创建
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Play className="w-5 h-5 mr-2" />
              观看演示
            </Button>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">功能演示</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demos.map((demo) => {
              const IconComponent = demo.icon;
              return (
                <Card 
                  key={demo.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDemo === demo.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedDemo(selectedDemo === demo.id ? null : demo.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${demo.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{demo.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{demo.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {demo.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择 Nano Banana？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">快速生成</h3>
                <p className="text-gray-600">30秒内完成从文字到3D模型的转换，让创意快速实现。</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI驱动</h3>
                <p className="text-gray-600">基于最先进的AI技术，生成质量高，细节丰富。</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">一键下载</h3>
                <p className="text-gray-600">支持多种格式导出，可直接用于3D打印或进一步编辑。</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">平台数据</h2>
            <p className="text-purple-100">已有数万用户选择我们的平台</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-purple-100">生成模型</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-purple-100">用户满意度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">技术支持</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-black font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">Nano Banana</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                AI驱动的人物手办生成平台，让创意从概念到实物的完整解决方案。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li><Link href="/create" className="text-gray-400 hover:text-white transition-colors">开始创建</Link></li>
                <li><Link href="/prompts" className="text-gray-400 hover:text-white transition-colors">提示词库</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">定价方案</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API文档</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">支持</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">隐私政策</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">服务条款</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Nano Banana. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}