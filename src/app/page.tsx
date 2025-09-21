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
import { ModelViewer } from "@/components/3d-viewer";
import { CreditSystem } from "@/components/credit-system";
import { useI18n } from "@/components/i18n/i18n-context";
import { ApiKeyManager } from "@/components/api-key-manager";

export default function HomePage() {
  const { t } = useI18n();
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [pose, setPose] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{url: string, name: string} | null>(null);
  const [credits, setCredits] = useState(5);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim() || credits < 2) return;
    
    setGenerating(true);
    setProgress(0);
    
    try {
      // 检查API密钥
      if (!apiKey) {
        alert('请先获取API密钥');
        setGenerating(false);
        return;
      }

      // 创建FormData
      const formData = new FormData();
      formData.append('prompt', description);
      formData.append('service', 'grsai'); // 默认使用grsai服务
      formData.append('options', JSON.stringify({
        style: style || 'anime',
        pose: pose || 'standing'
      }));

      // 如果有上传的图片文件，也添加到FormData
      if (imageFile) {
        formData.append('file', imageFile);
      }

      // 调用受保护的API
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '生成失败');
      }

      const result = await response.json();
      
      // 模拟进度条
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGenerating(false);
            setResult({
              url: result.url,
              name: result.name || "生成的手办模型"
            });
            setCredits(prev => prev - 2);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      console.error('生成失败:', error);
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setGenerating(false);
      setProgress(0);
    }
  };

  const handleCreditsChange = (newCredits: number) => {
    setCredits(newCredits);
  };

  const handleImageSelect = async (file: File) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    // 调用后端API
    setGenerating(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("options", JSON.stringify({ style, pose }));
      const res = await fetch("/api/generate/image", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) {
        setResult({ url: data.thumbnailUrl || data.url, name: data.name });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleBrowse = () => {
    const input = document.getElementById("image-input-hidden") as HTMLInputElement | null;
    input?.click();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">{t("hero.title")}</h1>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t("hero.subtitle")}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{t("hero.desc")}</p>
        </div>

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">{t("banner.left")}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-purple-800 font-medium">{t("banner.right")}</span>
            </span>
          </div>
        </div>
      </div>


      {/* Main Generation Interface */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">{t("tabs.text")}</TabsTrigger>
            <TabsTrigger value="image">{t("tabs.image")}</TabsTrigger>
            <TabsTrigger value="model">{t("tabs.model")}</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Parameter Settings */}
              <Card className="lg:col-span-4 xl:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>{t("params.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("params.descLabel", "描述词 *")}</label>
                    <Textarea
                      placeholder={t("params.desc.placeholder")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("params.style")}</label>
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
                      <label className="text-sm font-medium">{t("params.pose")}</label>
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
                    <label className="text-sm font-medium">{t("watermark.label")}</label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">{t("watermark.add")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API密钥管理 */}
              <div className="lg:col-span-3 xl:col-span-3">
                <ApiKeyManager onApiKeyChange={setApiKey} />
              </div>

              {/* 积分系统 */}
              <div className="lg:col-span-3 xl:col-span-3">
                <CreditSystem
                  credits={credits}
                  onCreditsChange={handleCreditsChange}
                  onGenerate={handleGenerate}
                  isGenerating={generating}
                />
              </div>


              {/* Output Result */}
              <Card className="lg:col-span-5 xl:col-span-5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>{t("result.title")}</span>
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
                          {t("btn.download2d")}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          {t("btn.download3d")}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          {t("btn.share")}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4 mr-2" />
                          {t("btn.favorite")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t("result.empty")}</p>
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
                <input
                  id="image-input-hidden"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(file);
                  }}
                />
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleDrop}
                  onClick={handleBrowse}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img src={imagePreview} alt="preview" className="max-h-80 mx-auto rounded-lg" />
                      <div className="text-sm text-gray-600">{imageFile?.name}</div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">上传图片或拖拽到此处</p>
                      <Button variant="outline" onClick={handleBrowse}>
                        <Upload className="w-4 h-4 mr-2" />
                        选择文件
                      </Button>
                    </>
                  )}
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
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}