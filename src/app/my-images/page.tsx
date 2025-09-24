"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Heart, 
  Eye,
  Trash2,
  Calendar,
  Tag,
  Grid3X3,
  List,
  ZoomIn
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/components/i18n/i18n-context";
import { formatDate } from "@/lib/i18n-utils";
import { supabase } from "@/lib/supabase";
import { SupabaseAuthService } from "@/lib/supabase-auth";

interface GeneratedImage {
  id: string;
  url: string;
  name: string;
  description: string;
  style: string;
  pose: string;
  createdAt: string;
  credits: number;
  likes: number;
  downloads: number;
  tags: string[];
}

export default function MyImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStyle, setFilterStyle] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载当前用户的 generations
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const userRes = await SupabaseAuthService.getCurrentUser();
        if (!userRes.success || !userRes.user) {
          setImages([]);
          setFilteredImages([]);
          setIsLoading(false);
          return;
        }
        const userId = userRes.user.id;
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;

        const mapped: GeneratedImage[] = (data || []).map((g: any) => ({
          id: g.id,
          url: g.result_url || "",
          name: g.style ? `${g.style}` : (g.prompt?.slice(0, 24) || '生成作品'),
          description: g.prompt || '',
          style: g.style || '',
          pose: g.pose || '',
          createdAt: g.created_at,
          credits: 0,
          likes: 0,
          downloads: 0,
          tags: [g.style, g.pose].filter(Boolean),
        }));
        setImages(mapped);
        setFilteredImages(mapped);
      } catch (e) {
        console.error('Load generations error:', e);
        setImages([]);
        setFilteredImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let filtered = images;

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStyle !== "all") {
      filtered = filtered.filter(img => img.style === filterStyle);
    }

    setFilteredImages(filtered);
  }, [images, searchTerm, filterStyle]);

  const handleDownload = (image: GeneratedImage) => {
    // 模拟下载
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.name}.jpg`;
    link.click();
  };

  const handleShare = (image: GeneratedImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.name,
        text: image.description,
        url: window.location.href
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const handleLike = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, likes: img.likes + 1 }
        : img
    ));
  };

  const handleDelete = (imageId: string) => {
    if (confirm('确定要删除这个作品吗？')) {
      setImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const { locale } = useI18n();
  
  const formatImageDate = (dateString: string) => {
    return formatDate(dateString, locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的作品</h1>
          <p className="text-gray-600 mt-2">管理和查看你生成的所有手办作品</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            共 {filteredImages.length} 个作品
          </Badge>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索作品名称、描述或标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStyle} onValueChange={setFilterStyle}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部风格</SelectItem>
                  <SelectItem value="anime">动漫风格</SelectItem>
                  <SelectItem value="realistic">写实风格</SelectItem>
                  <SelectItem value="cartoon">卡通风格</SelectItem>
                  <SelectItem value="chibi">Q版风格</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 作品展示 */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无作品</h3>
            <p className="text-gray-600 mb-4">开始创建你的第一个AI手办作品吧！</p>
            <Button asChild>
              <a href="/">开始创建</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {viewMode === "grid" ? (
                <Card className="group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedImage(image)}
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(image)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleShare(image)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm truncate">{image.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{image.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {image.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{image.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatImageDate(image.createdAt)}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleLike(image.id)}
                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-3 h-3" />
                            <span>{image.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{image.downloads}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 relative flex-shrink-0">
                        <Image
                          src={image.url}
                          alt={image.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{image.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {image.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedImage(image)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(image)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(image.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                          <span>{formatImageDate(image.createdAt)}</span>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLike(image.id)}
                              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                              <span>{image.likes}</span>
                            </button>
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{image.downloads}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* 图片查看模态框 */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>创建时间: {formatImageDate(selectedImage.createdAt)}</span>
                    <span>消耗积分: {selectedImage.credits}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(selectedImage)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedImage)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      分享
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleLike(selectedImage.id)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {selectedImage.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
