"use client";

import { useState } from 'react';
import { MultiGatewayPayment } from '@/components/payment/multi-gateway-payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Users,
  QrCode,
  Globe,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function MultiPaymentPage() {
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    gateway?: string;
    transactionId?: string;
    error?: string;
  } | null>(null);

  const handlePaymentSuccess = (gateway: string, transactionId: string) => {
    setPaymentResult({
      success: true,
      gateway,
      transactionId
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      error
    });
  };

  const getGatewayInfo = (gateway: string) => {
    const info = {
      stripe: {
        name: 'Stripe',
        icon: <CreditCard className="h-6 w-6" />,
        color: 'from-purple-500 to-purple-600',
        description: '全球领先的支付处理平台'
      },
      paypal: {
        name: 'PayPal',
        icon: <Users className="h-6 w-6" />,
        color: 'from-blue-500 to-blue-600',
        description: '全球知名的在线支付平台'
      },
      alipay: {
        name: '支付宝',
        icon: <QrCode className="h-6 w-6" />,
        color: 'from-blue-400 to-blue-500',
        description: '中国领先的移动支付平台'
      }
    };
    return info[gateway as keyof typeof info] || info.stripe;
  };

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
              <Link href="/global-payment">
                <Button variant="ghost">全球支付方案</Button>
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
            多网关支付系统
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Stripe + PayPal + 支付宝，智能推荐最适合的支付方式
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>支付宝</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 支付成功/失败结果 */}
          {paymentResult && (
            <Card className={`mb-8 ${
              paymentResult.success 
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {paymentResult.success ? (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800">支付成功！</h3>
                        <p className="text-green-600">
                          交易ID: {paymentResult.transactionId}
                        </p>
                        <p className="text-sm text-green-600">
                          使用 {getGatewayInfo(paymentResult.gateway || '').name} 支付成功
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800">支付失败</h3>
                        <p className="text-red-600">{paymentResult.error}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 多网关支付组件 */}
          <MultiGatewayPayment
            amount={29.99}
            currency="$"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />

          {/* 支持的支付网关介绍 */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">支持的支付网关</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stripe */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      全球领先的支付处理平台，支持135+货币，40+国家
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>信用卡/借记卡</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Apple Pay / Google Pay</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>实时汇率转换</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      费率: 2.9% + $0.30
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    PayPal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      全球知名的在线支付平台，覆盖200+国家，4亿+用户
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>PayPal账户支付</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>信用卡支付</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>买家保护政策</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      费率: 2.9% + $0.30
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 支付宝 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    支付宝
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      中国领先的移动支付平台，支持扫码和APP支付
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>扫码支付</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>支付宝APP</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>即时到账</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-3">
                      费率: 0.6%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 智能推荐说明 */}
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                智能支付推荐
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">🌍 地区检测</h4>
                  <p className="text-sm text-gray-600">
                    自动检测用户所在地区，推荐最适合的支付方式
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">💳 支付偏好</h4>
                  <p className="text-sm text-gray-600">
                    根据地区支付习惯，优先显示用户常用的支付方式
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">⚡ 快速支付</h4>
                  <p className="text-sm text-gray-600">
                    一键选择推荐支付方式，简化支付流程
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}









