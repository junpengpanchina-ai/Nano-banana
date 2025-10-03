"use client";

import { LemonSqueezyPayment } from '@/components/payment/lemon-squeezy-payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Shield, 
  CreditCard, 
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function LemonTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Lemon Squeezy 支付测试</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            测试全球 MoR (Merchant of Record) 支付解决方案
          </p>
        </div>

        {/* 功能特性展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Globe className="h-5 w-5" />
                全球覆盖
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                支持 200+ 国家/地区，自动处理不同地区的税费和合规要求
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                安全可靠
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">
                PCI DSS 合规，256位SSL加密，保护用户支付信息安全
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <CreditCard className="h-5 w-5" />
                支付方式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700">
                支持信用卡、借记卡、PayPal、Apple Pay、Google Pay 等
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 配置状态检查 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              配置状态检查
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Lemon Squeezy 服务已集成</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  已就绪
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">需要配置环境变量</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  待配置
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">需要设置 Webhook 回调</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  待配置
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 支付组件 */}
        <Card>
          <CardHeader>
            <CardTitle>积分购买</CardTitle>
          </CardHeader>
          <CardContent>
            <LemonSqueezyPayment 
              currentCredits={15}
              onPurchaseSuccess={(credits) => {
                console.log('Purchase successful, new credits:', credits);
                alert(`购买成功！获得 ${credits} 积分`);
              }}
            />
          </CardContent>
        </Card>

        {/* 配置说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>配置说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. 环境变量配置</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                  <div>NEXT_PUBLIC_LEMON_CHECKOUT_URL=https://store.lemonsqueezy.com/checkout/buy/your-variant-id</div>
                  <div>NEXT_PUBLIC_LEMON_STORE=your-store-id</div>
                  <div>LEMON_WEBHOOK_SECRET=your-webhook-signing-secret</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Webhook 配置</h4>
                <p>在 Lemon Squeezy Dashboard 中设置 Webhook URL：</p>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                  https://your-domain.com/api/webhooks/lemon
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. 测试流程</h4>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>配置环境变量</li>
                  <li>重启开发服务器</li>
                  <li>点击"立即购买"按钮</li>
                  <li>在弹出窗口中完成支付</li>
                  <li>检查 Webhook 回调是否正常</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
