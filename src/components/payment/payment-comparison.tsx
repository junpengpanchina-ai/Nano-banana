"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  DollarSign,
  Clock,
  Users,
  Globe,
  AlertTriangle
} from 'lucide-react';

interface PaymentSolution {
  id: string;
  name: string;
  type: 'direct' | 'aggregator' | 'international';
  features: string[];
  advantages: string[];
  disadvantages: string[];
  fee: string;
  settlement: string;
  setupTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  risk: 'low' | 'medium' | 'high';
  recommended: boolean;
  icon: React.ReactNode;
  color: string;
}

const paymentSolutions: PaymentSolution[] = [
  {
    id: 'alipay',
    name: '支付宝直连',
    type: 'direct',
    features: ['扫码支付', 'H5支付', 'APP支付', '小程序支付'],
    advantages: ['用户基数大', '支付成功率高', '技术成熟'],
    disadvantages: ['费率较高', '审核严格', '需要单独对接'],
    fee: '0.6%',
    settlement: 'T+1',
    setupTime: '2-3周',
    difficulty: 'medium',
    risk: 'low',
    recommended: true,
    icon: <DollarSign className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'wechat',
    name: '微信支付直连',
    type: 'direct',
    features: ['扫码支付', 'H5支付', 'JSAPI支付', '小程序支付'],
    advantages: ['社交属性强', '用户粘性高', '场景丰富'],
    disadvantages: ['需要微信认证', '审核周期长', '开发复杂'],
    fee: '0.6%',
    settlement: 'T+1',
    setupTime: '2-3周',
    difficulty: 'medium',
    risk: 'low',
    recommended: true,
    icon: <Users className="h-6 w-6" />,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'yeepay',
    name: '易宝支付',
    type: 'aggregator',
    features: ['支付宝', '微信支付', '银行卡', '银联'],
    advantages: ['一站式接入', '技术支持完善', '费率合理'],
    disadvantages: ['依赖第三方', '功能受限', '品牌认知度低'],
    fee: '0.6%',
    settlement: 'T+1',
    setupTime: '1-2周',
    difficulty: 'easy',
    risk: 'medium',
    recommended: true,
    icon: <Zap className="h-6 w-6" />,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'pnr',
    name: '汇付天下',
    type: 'aggregator',
    features: ['全渠道支付', '分账功能', '跨境支付'],
    advantages: ['费率优惠', '服务稳定', '功能丰富'],
    disadvantages: ['知名度较低', '客服响应慢', '文档不够完善'],
    fee: '0.5%',
    settlement: 'T+1',
    setupTime: '1-2周',
    difficulty: 'easy',
    risk: 'medium',
    recommended: false,
    icon: <Globe className="h-6 w-6" />,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'international',
    features: ['信用卡', '数字钱包', '银行转账', '加密货币'],
    advantages: ['开发者友好', 'API简单', '全球覆盖'],
    disadvantages: ['费率较高', '主要面向海外', '国内支持有限'],
    fee: '2.9%',
    settlement: 'T+2',
    setupTime: '1周',
    difficulty: 'easy',
    risk: 'low',
    recommended: false,
    icon: <Shield className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'merchant-hang',
    name: '商户挂靠',
    type: 'aggregator',
    features: ['快速接入', '低成本', '灵活配置'],
    advantages: ['接入快速', '成本低', '门槛低'],
    disadvantages: ['法律风险高', '资金安全风险', '账户易被封'],
    fee: '0.3%',
    settlement: 'T+1',
    setupTime: '3-5天',
    difficulty: 'easy',
    risk: 'high',
    recommended: false,
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'from-orange-500 to-red-600'
  }
];

interface PaymentComparisonProps {
  onSelectSolution?: (solution: PaymentSolution) => void;
}

export function PaymentComparison({ onSelectSolution }: PaymentComparisonProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">支付接口方案对比</h2>
        <p className="text-gray-600">选择最适合你项目的支付解决方案</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentSolutions.map((solution) => (
          <Card 
            key={solution.id}
            className={`relative transition-all duration-300 hover:shadow-lg ${
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
                    <Badge variant="outline" className="mt-1 text-xs">
                      {solution.type === 'direct' ? '直连' : 
                       solution.type === 'aggregator' ? '聚合支付' : '国际支付'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 关键指标 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-gray-900">费率</div>
                  <div className="text-blue-600 font-bold">{solution.fee}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-gray-900">结算</div>
                  <div className="text-green-600 font-bold">{solution.settlement}</div>
                </div>
              </div>

              {/* 难度和风险 */}
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(solution.difficulty)}>
                  难度: {solution.difficulty === 'easy' ? '简单' : 
                        solution.difficulty === 'medium' ? '中等' : '困难'}
                </Badge>
                <Badge className={getRiskColor(solution.risk)}>
                  风险: {solution.risk === 'low' ? '低' : 
                        solution.risk === 'medium' ? '中' : '高'}
                </Badge>
              </div>

              {/* 功能特性 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">支持功能</h4>
                <div className="space-y-1">
                  {solution.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 优势 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">优势</h4>
                <div className="space-y-1">
                  {solution.advantages.slice(0, 2).map((advantage, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-3 w-3" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 劣势 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">劣势</h4>
                <div className="space-y-1">
                  {solution.disadvantages.slice(0, 2).map((disadvantage, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <X className="h-3 w-3" />
                      <span>{disadvantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="pt-4">
                <Button
                  onClick={() => onSelectSolution?.(solution)}
                  className={`w-full ${
                    solution.recommended 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                      : 'bg-gray-700 hover:bg-gray-800'
                  } text-white`}
                >
                  {solution.recommended ? '选择此方案' : '了解详情'}
                </Button>
                <div className="text-xs text-gray-500 text-center mt-2">
                  接入时间: {solution.setupTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 推荐方案说明 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" />
            推荐方案说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🥇 首选: 易宝支付</h4>
              <p className="text-sm text-gray-600">
                一站式接入，技术支持完善，适合快速上线
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🥈 备选: 支付宝+微信</h4>
              <p className="text-sm text-gray-600">
                直连方式，费率最优，用户覆盖最广
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">⚠️ 避免: 商户挂靠</h4>
              <p className="text-sm text-gray-600">
                法律风险高，资金安全无法保障
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






