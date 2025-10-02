"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Star, 
  Zap, 
  Shield, 
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CreditCard
} from 'lucide-react';

interface GlobalPaymentSolution {
  id: string;
  name: string;
  rating: number;
  globalCoverage: string;
  supportedCurrencies: number;
  supportedCountries: number;
  supportedMethods: string[];
  fees: {
    domestic: string;
    international: string;
    currencyConversion: string;
  };
  advantages: string[];
  disadvantages: string[];
  setupTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recommended: boolean;
  icon: React.ReactNode;
  color: string;
}

interface RegionalPayment {
  region: string;
  primaryMethods: string[];
  localGateways: string[];
  userPreference: string;
  marketShare: string;
}

const globalSolutions: GlobalPaymentSolution[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    rating: 5,
    globalCoverage: '135+ 货币, 40+ 国家',
    supportedCurrencies: 135,
    supportedCountries: 40,
    supportedMethods: ['信用卡', '数字钱包', '银行转账', '先买后付', '加密货币'],
    fees: {
      domestic: '2.9% + $0.30 (美国)',
      international: '+1.5% 国际卡费',
      currencyConversion: '1% 货币转换费'
    },
    advantages: [
      '统一API支持全球',
      '开发者友好',
      '实时汇率转换',
      '强大风控系统',
      '无月费设置费'
    ],
    disadvantages: [
      '部分国家不支持',
      '新商户审核严格',
      '客服响应较慢'
    ],
    setupTime: '1-2周',
    difficulty: 'easy',
    recommended: true,
    icon: <CreditCard className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    rating: 4,
    globalCoverage: '200+ 国家, 4亿+ 用户',
    supportedCurrencies: 25,
    supportedCountries: 200,
    supportedMethods: ['PayPal账户', '信用卡', 'PayPal Credit'],
    fees: {
      domestic: '2.9% + $0.30',
      international: '4.4% + 固定费用',
      currencyConversion: '2.5% 货币转换费'
    },
    advantages: [
      '全球知名度高',
      '用户信任度高',
      '买家保护政策',
      '快速集成',
      '多币种钱包'
    ],
    disadvantages: [
      '国际费率较高',
      '功能相对简单',
      '部分国家限制'
    ],
    setupTime: '3-5天',
    difficulty: 'easy',
    recommended: true,
    icon: <Users className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'adyen',
    name: 'Adyen',
    rating: 4,
    globalCoverage: '200+ 支付方式',
    supportedCurrencies: 150,
    supportedCountries: 200,
    supportedMethods: ['全渠道支付', '本地支付', '数字钱包', '银行转账'],
    fees: {
      domestic: '定制化费率',
      international: '0.1-0.3% + 处理费',
      currencyConversion: '0.5% 货币转换费'
    },
    advantages: [
      '企业级解决方案',
      '全球本地化',
      '统一平台管理',
      '高级风控系统',
      '专业客服支持'
    ],
    disadvantages: [
      '门槛较高',
      '费用不透明',
      '集成复杂',
      '主要面向大企业'
    ],
    setupTime: '1-3个月',
    difficulty: 'hard',
    recommended: false,
    icon: <Shield className="h-6 w-6" />,
    color: 'from-green-500 to-green-600'
  }
];

const regionalPayments: RegionalPayment[] = [
  {
    region: '北美',
    primaryMethods: ['信用卡 (Visa, MasterCard)', 'PayPal', 'Apple Pay', 'Google Pay'],
    localGateways: ['Stripe', 'PayPal', 'Square'],
    userPreference: '信用卡支付为主',
    marketShare: '85% 信用卡使用率'
  },
  {
    region: '欧洲',
    primaryMethods: ['SEPA银行转账', '信用卡', 'iDEAL', 'Sofort'],
    localGateways: ['Adyen', 'Stripe', 'Worldpay'],
    userPreference: '银行转账和信用卡',
    marketShare: '60% 银行转账, 35% 信用卡'
  },
  {
    region: '亚太',
    primaryMethods: ['支付宝', '微信支付', '信用卡', '本地数字钱包'],
    localGateways: ['Stripe', '本地支付网关', 'Adyen'],
    userPreference: '移动支付为主',
    marketShare: '70% 移动支付'
  },
  {
    region: '拉美',
    primaryMethods: ['分期付款', '本地数字钱包', '银行转账'],
    localGateways: ['Stripe', '本地合作伙伴'],
    userPreference: '分期付款',
    marketShare: '50% 分期付款'
  }
];

export function GlobalPaymentStrategy() {
  const [selectedStrategy, setSelectedStrategy] = useState<'quick' | 'comprehensive' | 'enterprise'>('quick');

  const strategies = {
    quick: {
      name: '快速启动方案',
      description: '适合MVP和早期阶段，快速覆盖主要市场',
      solutions: ['stripe', 'paypal'],
      timeline: '2-3周',
      cost: '低',
      coverage: '80%'
    },
    comprehensive: {
      name: '全面覆盖方案',
      description: '适合成长期业务，覆盖更多地区和支付方式',
      solutions: ['stripe', 'paypal', 'regional'],
      timeline: '2-3个月',
      cost: '中等',
      coverage: '95%'
    },
    enterprise: {
      name: '企业级方案',
      description: '适合大型企业，完整的全球支付解决方案',
      solutions: ['adyen', 'stripe', 'custom'],
      timeline: '3-6个月',
      cost: '高',
      coverage: '99%'
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">全球支付策略</h2>
        <p className="text-gray-600">为全球用户选择最合适的支付解决方案</p>
      </div>

      {/* 策略选择 */}
      <Tabs value={selectedStrategy} onValueChange={(value: any) => setSelectedStrategy(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">快速启动</TabsTrigger>
          <TabsTrigger value="comprehensive">全面覆盖</TabsTrigger>
          <TabsTrigger value="enterprise">企业级</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStrategy} className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{strategies[selectedStrategy].name}</h3>
                  <p className="text-gray-600">{strategies[selectedStrategy].description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">实施时间</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{strategies[selectedStrategy].timeline}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">成本</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">{strategies[selectedStrategy].cost}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold">全球覆盖</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">{strategies[selectedStrategy].coverage}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold">适用阶段</span>
                  </div>
                  <div className="text-sm font-bold text-orange-600">
                    {selectedStrategy === 'quick' ? 'MVP/早期' : 
                     selectedStrategy === 'comprehensive' ? '成长期' : '成熟期'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 全球支付解决方案对比 */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">全球支付解决方案</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {globalSolutions.map((solution) => (
            <Card 
              key={solution.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                solution.recommended ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              {solution.recommended && (
                <div className="absolute -top-2 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    推荐
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center text-white`}>
                      {solution.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{solution.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < solution.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 覆盖范围 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm">全球覆盖</span>
                  </div>
                  <div className="text-xs text-gray-600">{solution.globalCoverage}</div>
                </div>

                {/* 费率信息 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">费率结构</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>国内: {solution.fees.domestic}</div>
                    <div>国际: {solution.fees.international}</div>
                    <div>转换: {solution.fees.currencyConversion}</div>
                  </div>
                </div>

                {/* 优势 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">主要优势</h4>
                  <div className="space-y-1">
                    {solution.advantages.slice(0, 3).map((advantage, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 劣势 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">主要劣势</h4>
                  <div className="space-y-1">
                    {solution.disadvantages.slice(0, 2).map((disadvantage, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{disadvantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <Button
                  className={`w-full ${
                    solution.recommended 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-800'
                  } text-white`}
                >
                  {solution.recommended ? '选择此方案' : '了解详情'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 地区支付偏好 */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">各地区支付偏好</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regionalPayments.map((region, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{region.region}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">主要支付方式</h4>
                  <div className="flex flex-wrap gap-1">
                    {region.primaryMethods.map((method, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">推荐网关</h4>
                  <div className="flex flex-wrap gap-1">
                    {region.localGateways.map((gateway, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {gateway}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-800">
                    <div className="font-semibold mb-1">用户偏好: {region.userPreference}</div>
                    <div>市场份额: {region.marketShare}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 实施建议 */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            实施建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🥇 首选方案</h4>
              <p className="text-sm text-gray-600">
                Stripe + PayPal 组合，快速覆盖全球80%用户，开发成本低
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🥈 优化方案</h4>
              <p className="text-sm text-gray-600">
                根据用户数据分析，添加地区特定的本地支付方式
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🥉 企业方案</h4>
              <p className="text-sm text-gray-600">
                业务成熟后考虑Adyen等企业级解决方案，优化费率和功能
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}








