"use client";

import { GlobalPaymentStrategy } from '@/components/payment/global-payment-strategy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Globe, 
  Star, 
  Zap, 
  Shield, 
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function GlobalPaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Nano Banana</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/payment-options">
                <Button variant="ghost">国内支付</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            全球支付解决方案
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            为全球用户提供便捷、安全的支付体验
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>135+ 货币支持</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>银行级安全</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>全球用户覆盖</span>
            </div>
          </div>
        </div>

        {/* 全球支付挑战 */}
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" />
              全球支付面临的挑战
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">多币种</span>
                </div>
                <p className="text-sm text-gray-600">不同国家使用不同货币，需要实时汇率转换</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">支付偏好</span>
                </div>
                <p className="text-sm text-gray-600">各地区用户习惯不同的支付方式</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">法规合规</span>
                </div>
                <p className="text-sm text-gray-600">各国支付法规差异巨大</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">汇率风险</span>
                </div>
                <p className="text-sm text-gray-600">货币转换带来的成本和风险</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 全球支付策略 */}
        <GlobalPaymentStrategy />

        {/* 成功案例 */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              全球支付成功案例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Shopify</h4>
                <p className="text-sm text-gray-600 mb-3">
                  全球电商平台，使用Stripe处理175个国家的支付
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">Stripe</Badge>
                  <Badge variant="secondary" className="text-xs">175个国家</Badge>
                  <Badge variant="secondary" className="text-xs">多币种</Badge>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Spotify</h4>
                <p className="text-sm text-gray-600 mb-3">
                  音乐流媒体服务，覆盖全球180+个市场
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">本地支付</Badge>
                  <Badge variant="secondary" className="text-xs">订阅模式</Badge>
                  <Badge variant="secondary" className="text-xs">多种货币</Badge>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Airbnb</h4>
                <p className="text-sm text-gray-600 mb-3">
                  住宿预订平台，支持全球220+个国家的本地支付
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">多网关</Badge>
                  <Badge variant="secondary" className="text-xs">本地化</Badge>
                  <Badge variant="secondary" className="text-xs">实时转换</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系我们 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              需要帮助？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">技术咨询</h4>
                <p className="text-gray-600 mb-4">
                  我们的技术团队可以帮助你选择最适合的全球支付解决方案，并提供完整的集成支持。
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  联系技术团队
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">商务合作</h4>
                <p className="text-gray-600 mb-4">
                  如果你需要定制化的全球支付解决方案，我们可以为你推荐合适的服务商。
                </p>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  商务咨询
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









