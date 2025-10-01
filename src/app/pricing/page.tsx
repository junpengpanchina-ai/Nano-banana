"use client";

import { useState } from 'react';
import { PricingPlans } from '@/components/payment/pricing-plans';
import { useSmartAuth } from '@/components/auth/smart-auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Zap, 
  Star, 
  Crown,
  CheckCircle,
  Shield,
  Clock,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const { user } = useSmartAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (plan: any) => {
    setIsProcessing(true);
    
    try {
      // 模拟支付处理
      console.log('处理支付:', plan.name);
      
      // 这里可以集成真实的支付系统（如 Stripe、支付宝等）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟支付成功，更新用户积分
      console.log('支付成功！积分已添加到账户');
      
      // 显示成功消息
      alert(`支付成功！您已获得 ${plan.credits} 个积分`);
      
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
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
              {user ? (
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{user.credits} 积分</span>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline">登录</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            选择你的套餐
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            不再需要看广告，直接付费获得更多积分
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>安全支付</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>即时到账</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>退款保证</span>
            </div>
          </div>
        </div>

        {/* 定价方案 */}
        <PricingPlans 
          onSelectPlan={handleSelectPlan}
          currentCredits={user?.credits || 0}
        />

        {/* 常见问题 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            常见问题
          </h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  支付安全吗？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  我们使用银行级别的加密技术保护您的支付信息，支持支付宝、微信支付等主流支付方式。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  积分什么时候到账？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支付成功后，积分将立即添加到您的账户中，无需等待。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  可以退款吗？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持7-60天退款保证，具体时间根据套餐而定。未使用的积分可以申请退款。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  积分会过期吗？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  积分永久有效，不会过期。您可以随时使用积分生成内容。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 联系支持 */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                需要帮助？
              </h3>
              <p className="text-gray-600 mb-6">
                如果您有任何问题或需要定制方案，请联系我们的客服团队。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  在线客服
                </Button>
                <Button variant="outline">
                  发送邮件
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






