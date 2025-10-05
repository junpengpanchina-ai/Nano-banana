"use client";

import { useState } from 'react';
import { AlipayPayment } from '@/components/payment/alipay-payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function AlipayTestPage() {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentResult(paymentData);
    setError('');
    console.log('支付成功:', paymentData);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentResult(null);
    console.error('支付失败:', errorMessage);
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            支付宝支付测试
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            测试支付宝支付功能，验证支付流程
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800">
              <QrCode className="h-3 w-3 mr-1" />
              支付宝支付
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              安全可靠
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <CreditCard className="h-3 w-3 mr-1" />
              即时到账
            </Badge>
          </div>
        </div>

        {/* 配置说明 */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Info className="h-5 w-5" />
              配置说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-yellow-700">
              <p>
                <strong>注意：</strong> 此页面仅用于测试支付宝支付功能，需要先配置支付宝开放平台参数。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">必需配置：</h4>
                  <ul className="space-y-1">
                    <li>• ALIPAY_APP_ID - 支付宝应用ID</li>
                    <li>• ALIPAY_PRIVATE_KEY - 应用私钥</li>
                    <li>• ALIPAY_PUBLIC_KEY - 支付宝公钥</li>
                    <li>• ALIPAY_GATEWAY_URL - 网关地址</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">配置步骤：</h4>
                  <ol className="space-y-1">
                    <li>1. 注册支付宝开放平台</li>
                    <li>2. 创建应用并获取密钥</li>
                    <li>3. 配置环境变量</li>
                    <li>4. 测试支付功能</li>
                  </ol>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => window.open('https://open.alipay.com', '_blank')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  前往支付宝开放平台
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 支付组件 */}
        <div className="max-w-4xl mx-auto">
          <AlipayPayment
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>

        {/* 支付结果 */}
        {paymentResult && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                支付结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">订单号：</span>
                  <span className="font-mono">{paymentResult.outTradeNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">支付链接：</span>
                  <span className="text-blue-600 truncate max-w-md">
                    {paymentResult.paymentUrl}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">状态：</span>
                  <Badge className="bg-green-100 text-green-800">已创建</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 错误信息 */}
        {error && (
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                错误信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 测试说明 */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Info className="h-5 w-5" />
              测试说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-700">
              <p>
                <strong>测试流程：</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>填写支付金额和订单标题</li>
                <li>点击"创建支付订单"生成支付链接</li>
                <li>点击"前往支付"打开支付宝支付页面</li>
                <li>使用支付宝扫码或登录完成支付</li>
                <li>支付完成后返回查看支付结果</li>
              </ol>
              <p className="pt-2">
                <strong>注意：</strong> 测试环境需要使用支付宝沙箱环境，正式环境需要申请正式应用。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









