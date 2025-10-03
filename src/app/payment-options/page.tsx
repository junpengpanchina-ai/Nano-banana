"use client";

import { useState } from 'react';
import { PaymentComparison } from '@/components/payment/payment-comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Shield,
  Clock,
  Users,
  Globe,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentOptionsPage() {
  const [selectedSolution, setSelectedSolution] = useState<any>(null);

  const handleSelectSolution = (solution: any) => {
    setSelectedSolution(solution);
  };

  const contactInfo = {
    yeepay: {
      name: '易宝支付',
      phone: '400-700-6886',
      email: 'business@yeepay.com',
      website: 'https://www.yeepay.com'
    },
    alipay: {
      name: '支付宝',
      phone: '95188',
      email: 'support@alipay.com',
      website: 'https://open.alipay.com'
    },
    wechat: {
      name: '微信支付',
      phone: '95017',
      email: 'support@wechatpay.com',
      website: 'https://pay.weixin.qq.com'
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
            
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            支付接口方案
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            为你的项目选择最合适的支付解决方案
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>安全可靠</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>快速接入</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>用户覆盖广</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="comparison" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">方案对比</TabsTrigger>
            <TabsTrigger value="recommendations">推荐方案</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison">
            <PaymentComparison onSelectSolution={handleSelectSolution} />
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-8">
              {/* 推荐方案 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 易宝支付 */}
                <Card className="border-2 border-blue-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      推荐方案
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">易宝支付</h3>
                      <p className="text-gray-600">一站式聚合支付</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">支持支付宝、微信、银行卡</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">技术接入简单</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">费率合理 0.6%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">技术支持完善</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      选择此方案
                    </Button>
                  </CardContent>
                </Card>

                {/* 支付宝+微信 */}
                <Card className="border-2 border-green-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      备选方案
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">直连支付</h3>
                      <p className="text-gray-600">支付宝 + 微信支付</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">费率最低 0.6%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">用户覆盖最广</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">官方支持</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">需要分别对接</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                      了解详情
                    </Button>
                  </CardContent>
                </Card>

                {/* 避免方案 */}
                <Card className="border-2 border-red-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      避免方案
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">商户挂靠</h3>
                      <p className="text-gray-600">非合规方式</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">法律风险极高</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">资金安全无保障</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">账户易被封</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">税务风险</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50" disabled>
                      不推荐使用
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* 联系方式 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    联系方式
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(contactInfo).map(([key, info]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{info.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>📞 {info.phone}</div>
                          <div>📧 {info.email}</div>
                          <div>🌐 <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{info.website}</a></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 选择结果 */}
        {selectedSolution && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                已选择方案: {selectedSolution.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">下一步操作:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>1. 联系服务商申请商户资质</li>
                    <li>2. 准备相关证件和材料</li>
                    <li>3. 完成技术对接开发</li>
                    <li>4. 测试支付流程</li>
                    <li>5. 正式上线使用</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">预期时间:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📅 申请审核: 1-2周</div>
                    <div>💻 技术开发: {selectedSolution.setupTime}</div>
                    <div>🧪 测试调试: 3-5天</div>
                    <div>🚀 正式上线: 1天</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}









