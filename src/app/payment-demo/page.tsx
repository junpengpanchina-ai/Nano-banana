"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MembershipModal } from '@/components/payment/membership-modal';
import { LemonSqueezyPayment } from '@/components/payment/lemon-squeezy-payment';
import { 
  Globe, 
  CreditCard, 
  Zap, 
  Shield, 
  CheckCircle,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

export default function PaymentDemoPage() {
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(15);

  const handlePurchaseSuccess = (plan: any, newCredits: number) => {
    setCurrentCredits(newCredits);
    setIsMembershipModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">全球支付解决方案演示</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            完整的全球支付系统，支持 200+ 国家/地区，自动处理税费和合规要求
          </p>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-green-800 mb-2">全球覆盖</h3>
              <p className="text-sm text-green-700">支持 200+ 国家/地区</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-800 mb-2">安全合规</h3>
              <p className="text-sm text-blue-700">PCI DSS 合规，自动税费处理</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-purple-800 mb-2">多种支付</h3>
              <p className="text-sm text-purple-700">信用卡、数字钱包、银行转账</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-orange-800 mb-2">快速集成</h3>
              <p className="text-sm text-orange-700">5分钟完成配置</p>
            </CardContent>
          </Card>
        </div>

        {/* 支付方式对比 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">支付方式对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">特性</th>
                    <th className="text-center p-4 bg-green-50">
                      <div className="flex items-center justify-center gap-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-green-800">全球支付 (MoR)</span>
                        <Badge className="bg-green-500 text-white">推荐</Badge>
                      </div>
                    </th>
                    <th className="text-center p-4">支付宝</th>
                    <th className="text-center p-4">微信支付</th>
                    <th className="text-center p-4">银行卡</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">覆盖范围</td>
                    <td className="p-4 text-center bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      <span className="text-sm text-green-700">全球 200+ 国家</span>
                    </td>
                    <td className="p-4 text-center">仅中国</td>
                    <td className="p-4 text-center">仅中国</td>
                    <td className="p-4 text-center">有限</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">税费处理</td>
                    <td className="p-4 text-center bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      <span className="text-sm text-green-700">自动处理</span>
                    </td>
                    <td className="p-4 text-center">❌ 手动</td>
                    <td className="p-4 text-center">❌ 手动</td>
                    <td className="p-4 text-center">❌ 手动</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">合规要求</td>
                    <td className="p-4 text-center bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      <span className="text-sm text-green-700">自动合规</span>
                    </td>
                    <td className="p-4 text-center">需要资质</td>
                    <td className="p-4 text-center">需要资质</td>
                    <td className="p-4 text-center">需要资质</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">收款难度</td>
                    <td className="p-4 text-center bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      <span className="text-sm text-green-700">极简</span>
                    </td>
                    <td className="p-4 text-center">复杂</td>
                    <td className="p-4 text-center">复杂</td>
                    <td className="p-4 text-center">复杂</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">手续费</td>
                    <td className="p-4 text-center bg-green-50">
                      <span className="text-sm text-green-700">3.5% + $0.50</span>
                    </td>
                    <td className="p-4 text-center">0.6%</td>
                    <td className="p-4 text-center">0.6%</td>
                    <td className="p-4 text-center">1-3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 支付演示 */}
        <Tabs defaultValue="membership" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="membership">会员弹窗演示</TabsTrigger>
            <TabsTrigger value="lemon">Lemon Squeezy 演示</TabsTrigger>
          </TabsList>
          
          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  会员弹窗支付演示
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    点击下方按钮体验会员弹窗支付流程，包含全球支付选项
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => setIsMembershipModalOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    打开会员弹窗
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lemon" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Lemon Squeezy 全球支付演示
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LemonSqueezyPayment 
                  currentCredits={currentCredits}
                  onPurchaseSuccess={(credits) => {
                    setCurrentCredits(credits);
                    alert(`购买成功！获得 ${credits} 积分`);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 技术架构 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">技术架构</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">用户端</h3>
                <p className="text-sm text-gray-600">
                  用户选择套餐，点击支付按钮，跳转到安全的支付页面
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Lemon Squeezy</h3>
                <p className="text-sm text-gray-600">
                  处理全球支付，自动计算税费，确保合规
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Payoneer</h3>
                <p className="text-sm text-gray-600">
                  接收美元，提现到国内银行卡，无需海外账户
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速开始 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  5分钟快速配置
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. 注册 Lemon Squeezy 账户</li>
                  <li>2. 创建商店和产品</li>
                  <li>3. 获取 Hosted Checkout 链接</li>
                  <li>4. 配置环境变量</li>
                  <li>5. 设置 Webhook 回调</li>
                </ol>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => window.open('https://www.lemonsqueezy.com/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  立即注册 Lemon Squeezy
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  自动化脚本
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  使用我们的自动化脚本快速配置所有环境变量
                </p>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                  node setup-lemon-squeezy.js
                </div>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => window.open('/LEMON_SQUEEZY_SETUP_GUIDE.md', '_blank')}
                >
                  查看详细指南
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 会员弹窗 */}
      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        currentCredits={currentCredits}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
