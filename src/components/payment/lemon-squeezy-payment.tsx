"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles,
  CreditCard,
  Shield,
  ExternalLink,
  Globe,
  DollarSign
} from 'lucide-react';
import { lemonSqueezyService, LemonSqueezyProduct } from '@/lib/lemon-squeezy';

interface LemonSqueezyPaymentProps {
  currentCredits?: number;
  onPurchaseSuccess?: (credits: number) => void;
}

export function LemonSqueezyPayment({ 
  currentCredits = 0, 
  onPurchaseSuccess 
}: LemonSqueezyPaymentProps) {
  const [products, setProducts] = useState<LemonSqueezyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LemonSqueezyProduct | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const status = await lemonSqueezyService.getPaymentStatus();
      setProducts(status.products);
      setIsConfigured(status.isAvailable);
    } catch (error) {
      console.error('Failed to load Lemon Squeezy products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = (product: LemonSqueezyProduct) => {
    setSelectedProduct(product);
    
    // 生成结账链接
    const checkoutUrl = lemonSqueezyService.generateCheckoutUrl(
      product.id,
      'current-user-id', // 这里应该从用户上下文获取
      product.credits
    );

    // 打开新窗口进行支付
    window.open(checkoutUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
  };

  const getProductIcon = (productId: string) => {
    switch (productId) {
      case 'starter':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Star className="h-5 w-5" />;
      case 'enterprise':
        return <Crown className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getProductColor = (productId: string) => {
    switch (productId) {
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'enterprise':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">加载支付选项中...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">支付服务暂未配置</h3>
        <p className="text-gray-600 mb-4">
          Lemon Squeezy 支付服务需要管理员配置后才能使用
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            请联系客服进行人工充值：nano_banana_service
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 当前积分显示 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">当前积分余额：</span>
          <span className="text-lg font-bold text-blue-600">{currentCredits}</span>
        </div>
      </div>

      {/* 全球支付说明 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">🌍 全球支付解决方案</h3>
            <p className="text-sm text-gray-600">支持全球 200+ 国家/地区，自动处理税费和合规</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-500" />
            <span>支持信用卡/借记卡</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-500" />
            <span>自动税费处理</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Check className="h-4 w-4 text-green-500" />
            <span>安全加密支付</span>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-gray-900">选择积分套餐</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                product.id === 'pro' 
                  ? 'ring-4 ring-purple-300 border-purple-300 shadow-lg' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              {product.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    <Sparkles className="h-4 w-4 mr-1" />
                    推荐
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6 text-center space-y-5">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${getProductColor(product.id)} flex items-center justify-center text-white`}>
                  {getProductIcon(product.id)}
                </div>
                
                <div>
                  <h4 className="font-bold text-xl text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.credits} 积分
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    约 ${(product.price / product.credits).toFixed(3)} / 积分
                  </div>
                </div>
                
                <Button 
                  onClick={() => handlePurchase(product)}
                  size="lg"
                  className={`w-full text-lg font-semibold py-3 ${
                    product.id === 'pro' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-lg'
                  } text-white`}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  立即购买
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 支付说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">支付说明：</p>
            <ul className="space-y-1 text-xs">
              <li>• 点击购买后将跳转到安全的支付页面</li>
              <li>• 支持 Visa、Mastercard、American Express 等主流信用卡</li>
              <li>• 支付成功后积分将自动到账</li>
              <li>• 如有问题请联系客服：nano_banana_service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
