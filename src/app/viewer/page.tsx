"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ModelViewer } from "@/components/3d-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  RotateCcw,
  Maximize2,
  Settings
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ViewerContent() {
  const searchParams = useSearchParams();
  const modelUrl = searchParams.get('model');
  const imageUrl = searchParams.get('image');
  const name = searchParams.get('name') || '未命名模型';
  const description = searchParams.get('description') || '';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likes, setLikes] = useState(0);

  const handleDownload = () => {
    // 实现下载功能
    console.log('下载模型');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* 顶部导航 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/my-images">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{name}</h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button size="sm" variant="outline" onClick={handleLike}>
              <Heart className="w-4 h-4 mr-2" />
              {likes}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D查看器 */}
          <div className="lg:col-span-2">
            <ModelViewer 
              modelUrl={modelUrl || undefined} 
              className={isFullscreen ? 'h-screen' : 'h-[600px]'}
            />
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-4">
            {/* 2D预览 */}
            {imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">2D预览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 模型信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">模型信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">名称</label>
                  <p className="text-sm">{name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">描述</label>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">格式</label>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">OBJ</Badge>
                    <Badge variant="outline" className="text-xs">STL</Badge>
                    <Badge variant="outline" className="text-xs">GLTF</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">文件大小</label>
                  <p className="text-sm">2.3 MB</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">创建时间</label>
                  <p className="text-sm">{new Date().toLocaleDateString('zh-CN')}</p>
                </div>
              </CardContent>
            </Card>

            {/* 操作指南 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  操作指南
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-600">
                <p>• 鼠标左键拖拽：旋转模型</p>
                <p>• 鼠标右键拖拽：平移视角</p>
                <p>• 滚轮：缩放模型</p>
                <p>• 双击：重置视角</p>
                <p>• 空格键：自动旋转</p>
              </CardContent>
            </Card>

            {/* 下载选项 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">下载选项</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载OBJ格式
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载STL格式
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载GLTF格式
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
