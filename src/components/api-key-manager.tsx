"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface ApiKeyManagerProps {
  onApiKeyChange?: (apiKey: string | null) => void;
}

export function ApiKeyManager({ onApiKeyChange }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage加载API密钥
  useEffect(() => {
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange?.(savedKey);
    }
  }, [onApiKeyChange]);

  // 生成新的API密钥
  const generateApiKey = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': 'demo-admin-key-12345'
        },
        body: JSON.stringify({
          userId: `user_${Date.now()}`,
          maxRequests: 100
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成API密钥失败');
      }

      const data = await response.json();
      setApiKey(data.apiKey);
      localStorage.setItem('apiKey', data.apiKey);
      onApiKeyChange?.(data.apiKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  // 复制API密钥
  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 清除API密钥
  const clearApiKey = () => {
    setApiKey(null);
    localStorage.removeItem('apiKey');
    onApiKeyChange?.(null);
  };

  // 显示/隐藏API密钥
  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>API密钥管理</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKey ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Check className="w-3 h-3 mr-1" />
                已配置
              </Badge>
              <span className="text-sm text-gray-600">API密钥已就绪</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">你的API密钥</label>
              <div className="flex items-center space-x-2">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleShowKey}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyApiKey}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateApiKey}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                重新生成
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearApiKey}
              >
                清除密钥
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">需要API密钥才能使用生成功能</span>
            </div>
            
            <Button
              onClick={generateApiKey}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              获取API密钥
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• API密钥用于身份验证和频率限制</p>
          <p>• 每个密钥每小时最多100次请求</p>
          <p>• 请妥善保管你的API密钥</p>
        </div>
      </CardContent>
    </Card>
  );
}
