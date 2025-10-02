"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: '入门版',
    price: 9.9,
    credits: 50,
    description: '适合个人用户和小型项目',
    features: [
      '50 个生成积分',
      '基础 AI 模型',
      '标准生成速度',
      '邮件支持',
      '7天退款保证'
    ],
    icon: <Zap className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pro',
    name: '专业版',
    price: 29.9,
    credits: 200,
    description: '适合专业设计师和创作者',
    features: [
      '200 个生成积分',
      '高级 AI 模型',
      '快速生成速度',
      '优先队列',
      '高级编辑功能',
      '优先支持',
      '30天退款保证'
    ],
    popular: true,
    icon: <Star className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 99.9,
    credits: 1000,
    description: '适合团队和企业用户',
    features: [
      '1000 个生成积分',
      '所有 AI 模型',
      '极速生成',
      '团队协作',
      'API 访问',
      '自定义模型',
      '专属客服',
      '60天退款保证'
    ],
    icon: <Crown className="h-6 w-6" />,
    color: 'from-orange-500 to-red-600'
  }
];

interface PricingPlansProps {
  onSelectPlan?: (plan: PricingPlan) => void;
  currentCredits?: number;
}

export function PricingPlans({ onSelectPlan, currentCredits = 0 }: PricingPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan.id);
    setIsProcessing(true);
    
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 调用支付处理函数
      if (onSelectPlan) {
        onSelectPlan(plan);
      }
      
      console.log('选择套餐:', plan.name);
    } catch (error) {
      console.error('支付处理失败:', error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          选择适合你的套餐
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          不再需要看广告，直接付费获得更多积分
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>安全支付 • 随时取消 • 退款保证</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-105'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 inline mr-1" />
                最受欢迎
              </div>
            )}
            
            <CardHeader className={`text-center pb-4 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  ¥{plan.price}
                </div>
                <div className="text-gray-600">
                  {plan.credits} 个积分
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  约 ¥{(plan.price / plan.credits).toFixed(2)} / 积分
                </div>
              </div>

              <ul className="space-y-3 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={isProcessing}
                className={`w-full py-3 text-lg font-semibold ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900'
                } text-white`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <>
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    立即购买
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            当前积分余额
          </h3>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
            <Zap className="h-6 w-6" />
            <span>{currentCredits} 积分</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            购买套餐后积分将立即到账
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>支持支付宝、微信支付、银行卡等多种支付方式</p>
        <p className="mt-1">所有支付均通过安全加密处理，保护您的隐私</p>
      </div>
    </div>
  );
}








