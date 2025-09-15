"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { motion } from "framer-motion";
import { AdSenseBanner } from "@/components/adsense/adsense-banner";
import { AdSenseVideo } from "@/components/adsense/adsense-video";
import { ModelViewer } from "@/components/3d-viewer";

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
      id: "adsense",
      title: "AdSense广告系统",
      description: "Google AdSense广告集成",
      icon: DollarSign,
      color: "from-green-500 to-blue-500",
      features: ["横幅广告", "视频广告", "收入统计", "广告管理"]
    },
    {
      id: "viewer",
      title: "3D查看器",
      description: "交互式3D模型查看",
      icon: Box,
      color: "from-blue-500 to-cyan-500",
      features: ["360度旋转", "缩放控制", "光照调节", "全屏模式"]
    },
    {
      id: "gallery",
      title: "作品管理",
      description: "用户作品展示和管理",
      icon: Eye,
      color: "from-orange-500 to-red-500",
      features: ["作品展示", "搜索过滤", "批量操作", "分享下载"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部广告演示 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">顶部横幅广告演示</p>
            <AdSenseBanner
              adSlot="1234567890"
              adFormat="horizontal"
              className="w-full max-w-4xl mx-auto"
              adStyle={{ 
                display: 'block', 
                width: '100%',
                height: '90px',
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Nano Banana
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            功能演示中心
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            完整的AI人物手办生成平台，集成AdSense广告系统，支持多种生成方式和3D查看功能
          </p>
        </motion.div>

        {/* 功能概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => setSelectedDemo(demo.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${demo.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <demo.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{demo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{demo.description}</p>
                  <div className="space-y-1">
                    {demo.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs mr-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 详细功能演示 */}
        <Tabs defaultValue="generation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generation">AI生成</TabsTrigger>
            <TabsTrigger value="adsense">AdSense</TabsTrigger>
            <TabsTrigger value="viewer">3D查看器</TabsTrigger>
            <TabsTrigger value="gallery">作品管理</TabsTrigger>
          </TabsList>

          {/* AI生成功能演示 */}
          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="w-5 h-5" />
                  <span>AI生成功能演示</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">生成界面</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="text-sm font-medium">描述词输入</label>
                        <textarea 
                          className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                          placeholder="一个穿着蓝色连衣裙的可爱女孩，动漫风格，站立姿势"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select className="p-3 border border-gray-300 rounded-md">
                          <option>动漫风格</option>
                          <option>写实风格</option>
                          <option>卡通风格</option>
                        </select>
                        <select className="p-3 border border-gray-300 rounded-md">
                          <option>站立</option>
                          <option>坐姿</option>
                          <option>动作</option>
                        </select>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                        <Wand2 className="w-4 h-4 mr-2" />
                        生成手办 (2积分)
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">生成结果</h4>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center text-gray-500">
                        <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>生成的手办将在这里显示</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AdSense功能演示 */}
          <TabsContent value="adsense" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>广告收入统计</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">$12.45</p>
                        <p className="text-sm text-gray-600">今日收入</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">2,847</p>
                        <p className="text-sm text-gray-600">总展示</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">广告位管理</h5>
                      {[
                        { name: "顶部横幅", status: "启用", revenue: "$3.20" },
                        { name: "侧边栏", status: "启用", revenue: "$2.85" },
                        { name: "内容中", status: "启用", revenue: "$4.10" },
                        { name: "视频广告", status: "启用", revenue: "$2.30" }
                      ].map((ad, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{ad.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{ad.status}</Badge>
                            <span className="text-sm font-medium">{ad.revenue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>视频广告演示</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdSenseVideo
                    adSlot="1234567893"
                    onAdComplete={handleAdComplete}
                    onAdSkip={() => console.log('跳过广告')}
                    onAdClose={() => console.log('关闭广告')}
                    creditsReward={2}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>广告位展示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h5 className="font-medium mb-2">侧边栏广告</h5>
                    <AdSenseBanner
                      adSlot="1234567891"
                      adFormat="rectangle"
                      adStyle={{ 
                        display: 'block', 
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h5 className="font-medium mb-2">内容广告</h5>
                    <AdSenseBanner
                      adSlot="1234567892"
                      adFormat="rectangle"
                      adStyle={{ 
                        display: 'block', 
                        width: '100%',
                        height: '280px',
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h5 className="font-medium mb-2">移动端广告</h5>
                    <AdSenseBanner
                      adSlot="1234567895"
                      adFormat="auto"
                      adStyle={{ 
                        display: 'block', 
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3D查看器演示 */}
          <TabsContent value="viewer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Box className="w-5 h-5" />
                  <span>3D模型查看器</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">交互式3D查看</h4>
                    <ModelViewer 
                      modelUrl="demo-model"
                      className="h-96"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">控制说明</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 鼠标左键拖拽：旋转模型</p>
                      <p>• 鼠标右键拖拽：平移视角</p>
                      <p>• 滚轮：缩放模型</p>
                      <p>• 双击：重置视角</p>
                      <p>• 空格键：自动旋转</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">光照控制</h5>
                      <div className="space-y-2">
                        <label className="text-sm">光照强度</label>
                        <input type="range" min="0" max="2" step="0.1" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm">相机距离</label>
                        <input type="range" min="1" max="10" step="0.5" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 作品管理演示 */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>作品管理功能</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">我的作品 (4个)</h4>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        网格视图
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        列表视图
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "动漫女孩", style: "动漫", likes: 15, downloads: 8 },
                      { name: "写实男性", style: "写实", likes: 23, downloads: 12 },
                      { name: "Q版角色", style: "Q版", likes: 31, downloads: 19 },
                      { name: "动作角色", style: "动漫", likes: 18, downloads: 6 }
                    ].map((item, i) => (
                      <Card key={i} className="group hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">{item.name}</p>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h5 className="font-medium text-sm truncate">{item.name}</h5>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">{item.style}</Badge>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {item.likes}
                              </span>
                              <span className="flex items-center">
                                <Download className="w-3 h-3 mr-1" />
                                {item.downloads}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 快速导航 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>快速导航</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <Wand2 className="w-4 h-4 mr-2" />
                  主页生成
                </Button>
              </Link>
              <Link href="/my-images">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  我的作品
                </Button>
              </Link>
              <Link href="/admin/adsense">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  广告管理
                </Button>
              </Link>
              <Link href="/viewer">
                <Button variant="outline" className="w-full justify-start">
                  <Box className="w-4 h-4 mr-2" />
                  3D查看器
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部广告演示 */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">底部横幅广告演示</p>
            <AdSenseBanner
              adSlot="1234567894"
              adFormat="horizontal"
              className="w-full max-w-4xl mx-auto"
              adStyle={{ 
                display: 'block', 
                width: '100%',
                height: '90px',
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
