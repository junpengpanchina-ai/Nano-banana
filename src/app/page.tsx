"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Wand2, 
  Download, 
  Share2, 
  Heart, 
  Eye,
  Settings,
  Zap,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { ModelViewer } from "@/components/3d-viewer";
import { CreditSystem } from "@/components/credit-system";
import { ContentAd, SidebarAd } from "@/components/adsense/ad-placements";

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [pose, setPose] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(5);

  const handleGenerate = async () => {
    if (!description.trim() || credits < 2) return;
    
    setGenerating(true);
    setProgress(0);
    
    // 模拟生成过程
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setResult({
            url: "/api/placeholder/400/400",
            name: "生成的手办模型"
          });
          setCredits(prev => prev - 2);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCreditsChange = (newCredits: number) => {
    setCredits(newCredits);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Nano Banana
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI人物手办生成
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Google最先进的AI图像生成和编辑模型，为快速、对话式创意工作流程而设计。
            从文字描述到3D手办模型，一键完成个性化创作。
          </p>
        </div>

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">观看广告免费生成</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-purple-800 font-medium">每日最多10个广告</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* 内容中广告 */}
      <ContentAd />

      {/* Main Generation Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">文字描述</TabsTrigger>
            <TabsTrigger value="image">图片上传</TabsTrigger>
            <TabsTrigger value="model">3D模型</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Parameter Settings */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>参数设置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">描述词 *</label>
                    <Textarea
                      placeholder="描述你想要生成的人物手办，例如：一个穿着蓝色连衣裙的可爱女孩，动漫风格，站立姿势"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">风格</label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择风格" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anime">动漫风格</SelectItem>
                          <SelectItem value="realistic">写实风格</SelectItem>
                          <SelectItem value="cartoon">卡通风格</SelectItem>
                          <SelectItem value="chibi">Q版风格</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">姿势</label>
                      <Select value={pose} onValueChange={setPose}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择姿势" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standing">站立</SelectItem>
                          <SelectItem value="sitting">坐姿</SelectItem>
                          <SelectItem value="action">动作</SelectItem>
                          <SelectItem value="cute">可爱姿势</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">水印</label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">添加水印</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 积分系统 */}
              <div className="lg:col-span-1">
                <CreditSystem
                  credits={credits}
                  onCreditsChange={handleCreditsChange}
                  onGenerate={handleGenerate}
                  isGenerating={generating}
                />
              </div>

              {/* 侧边栏广告 */}
              <div className="lg:col-span-1">
                <SidebarAd />
              </div>

              {/* Output Result */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>输出结果</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4">
                      {/* 2D预览 */}
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={result.url} 
                          alt="Generated Figure" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 3D查看器 */}
                      <ModelViewer modelUrl={result.url} />
                      
                      {/* 操作按钮 */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          下载2D
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          下载3D
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          分享
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4 mr-2" />
                          收藏
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>生成的手办将在这里显示</p>
                        <p className="text-sm mt-2">支持2D预览和3D模型查看</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>图片上传生成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">上传图片或拖拽到此处</p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    选择文件
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3D模型上传</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">上传3D模型文件 (OBJ, FBX, GLTF)</p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    选择文件
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8">为什么选择 Nano Banana？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-gray-600">基于Google最先进的AI技术，生成质量高，细节丰富。</p>
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
      </motion.div>
    </div>
  );
}