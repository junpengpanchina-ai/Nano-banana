"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles,
  CreditCard,
  Shield,
  Clock,
  Gift,
  X,
  ShoppingCart,
  CreditCard as Alipay,
  Smartphone as Wechat,
  Banknote,
  Globe,
  ExternalLink
} from 'lucide-react';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  savings?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits?: number;
  onPurchaseSuccess?: (plan: MembershipPlan, credits: number) => void;
}

// 支付服务检查
const checkPaymentServiceAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/payment/status');
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data.isAvailable;
    }
    
    return false;
  } catch (error) {
    console.error('检查支付服务状态失败:', error);
    return false;
  }
};

// 创建支付订单
const createPaymentOrder = async (orderData: {
  plan: MembershipPlan;
  paymentMethod: PaymentMethod;
  userId: string;
  amount: number;
  credits: number;
}): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // 这里应该调用真实的支付API创建订单
    // 目前返回失败，因为支付服务未开通
    return {
      success: false,
      error: '支付服务暂未开通，请联系客服进行人工充值。客服微信：nano_banana_service'
    };
  } catch (error) {
    console.error('创建支付订单失败:', error);
    return {
      success: false,
      error: '创建订单失败，请重试'
    };
  }
};

// 验证支付结果
const verifyPayment = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // 这里应该验证真实的支付结果
    // 目前返回失败，因为支付服务未开通
    return {
      success: false,
      error: '支付验证失败，请联系客服'
    };
  } catch (error) {
    console.error('验证支付结果失败:', error);
    return {
      success: false,
      error: '支付验证失败，请重试'
    };
  }
};

const membershipPlans: MembershipPlan[] = [
  {
    id: 'starter',
    name: '入门版',
    price: 9.9,
    credits: 50,
    description: '适合个人用户',
    features: [
      '50 个生成积分',
      '基础 AI 模型',
      '标准生成速度',
      '邮件支持',
      '7天退款保证'
    ],
    icon: <Zap className="h-5 w-5" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pro',
    name: '专业版',
    price: 29.9,
    credits: 200,
    description: '适合创作者',
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
    icon: <Star className="h-5 w-5" />,
    color: 'from-purple-500 to-purple-600',
    savings: '省 ¥20'
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 99.9,
    credits: 1000,
    description: '适合团队',
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
    icon: <Crown className="h-5 w-5" />,
    color: 'from-orange-500 to-red-600',
    savings: '省 ¥100'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'global',
    name: '全球支付',
    icon: <Globe className="h-6 w-6" />,
    color: 'from-green-500 to-blue-600',
    description: '支持全球200+国家/地区'
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: <Alipay className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600',
    description: '安全快捷的支付方式'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: <Wechat className="h-6 w-6" />,
    color: 'from-green-500 to-green-600',
    description: '微信生态内支付'
  },
  {
    id: 'bank',
    name: '银行卡',
    icon: <Banknote className="h-6 w-6" />,
    color: 'from-gray-500 to-gray-600',
    description: '支持各大银行卡'
  }
];

export function MembershipModal({ 
  isOpen, 
  onClose, 
  currentCredits = 0,
  onPurchaseSuccess 
}: MembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handleSelectPayment = async (payment: PaymentMethod) => {
    if (!selectedPlan) return;
    
    setSelectedPayment(payment);
    
    // 如果是全球支付，直接跳转到 Lemon Squeezy
    if (payment.id === 'global') {
      try {
        // 动态导入 Lemon Squeezy 服务
        const { lemonSqueezyService } = await import('@/lib/lemon-squeezy');
        
        // 检查是否已配置
        const status = await lemonSqueezyService.getPaymentStatus();
        if (!status.isAvailable) {
          // 如果服务不可用，显示一个友好的提示
          alert('全球支付服务正在配置中，请稍后再试或选择其他支付方式');
          return;
        }
        
        // 生成结账链接
        const checkoutUrl = lemonSqueezyService.generateCheckoutUrl(
          selectedPlan.id,
          'current-user-id', // 这里应该从用户上下文获取
          selectedPlan.credits
        );
        
        // 打开新窗口进行支付
        window.open(checkoutUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // 关闭弹窗
        handleClose();
        
      } catch (error) {
        console.error('全球支付失败:', error);
        const errorMessage = error instanceof Error ? error.message : '全球支付服务暂不可用';
        alert(`支付失败: ${errorMessage}`);
      }
      return;
    }
    
    // 其他支付方式的原有逻辑
    setStep('processing');
    setIsProcessing(true);
    
    try {
      // 检查支付服务是否可用
      const isPaymentServiceAvailable = await checkPaymentServiceAvailability();
      
      if (!isPaymentServiceAvailable) {
        throw new Error('支付服务暂未开通，请联系客服进行人工充值。客服微信：nano_banana_service');
      }
      
      // 创建支付订单
      const orderResult = await createPaymentOrder({
        plan: selectedPlan,
        paymentMethod: payment,
        userId: 'current-user-id', // 这里应该从用户上下文获取
        amount: selectedPlan.price,
        credits: selectedPlan.credits
      });
      
      if (!orderResult.success) {
        throw new Error(orderResult.error || '创建订单失败');
      }
      
      // 模拟支付处理（实际应该调用真实支付API）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证支付结果
      const paymentResult = await verifyPayment(orderResult.orderId || '');
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || '支付验证失败');
      }
      
      // 支付成功，更新用户积分
      setStep('success');
      
      if (onPurchaseSuccess) {
        onPurchaseSuccess(selectedPlan, currentCredits + selectedPlan.credits);
      }
      
    } catch (error) {
      console.error('支付失败:', error);
      setStep('payment');
      
      // 显示具体的错误信息
      const errorMessage = error instanceof Error ? error.message : '支付失败，请重试';
      alert(`支付失败: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('plan');
    setSelectedPlan(null);
    setSelectedPayment(null);
    setIsProcessing(false);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white border-2 border-purple-200 shadow-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span>充值购买会员</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 当前积分显示 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">当前积分余额：</span>
              <span className="text-lg font-bold text-blue-600">{currentCredits}</span>
            </div>
          </div>

          {step === 'plan' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900">选择会员套餐</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {membershipPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                      plan.popular 
                        ? 'ring-4 ring-purple-300 border-purple-300 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                          <Sparkles className="h-4 w-4 mr-1" />
                          最受欢迎
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-6 text-center space-y-5">
                      <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                        {plan.icon}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-xl text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        {plan.savings && (
                          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 text-xs font-semibold">
                            {plan.savings}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-gray-900">
                          ¥{plan.price}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {plan.credits} 积分
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          约 ¥{(plan.price / plan.credits).toFixed(2)} / 积分
                        </div>
                      </div>
                      
                      <ul className="text-sm text-gray-700 space-y-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-purple-600 font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            +{plan.features.length - 3} 更多功能
                          </li>
                        )}
                      </ul>
                      
                      <Button 
                        size="lg"
                        className={`w-full text-lg font-semibold py-3 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg' 
                            : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-lg'
                        } text-white`}
                      >
                        选择此套餐
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 'payment' && selectedPlan && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">选择支付方式</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep('plan')}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  ← 返回选择套餐
                </Button>
              </div>
              
              {/* 支付服务提示 */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">支付服务暂未开通</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      支付功能正在开发中，请联系客服进行人工充值。客服微信：nano_banana_service
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedPlan.name}</h4>
                    <p className="text-gray-600">{selectedPlan.credits} 积分</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">¥{selectedPlan.price}</div>
                    <div className="text-sm text-gray-500">一次性支付</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                      method.id === 'global' 
                        ? 'ring-4 ring-green-300 border-green-300 shadow-lg bg-gradient-to-br from-green-50 to-blue-50' 
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => handleSelectPayment(method)}
                  >
                    {method.id === 'global' && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                          <Globe className="h-3 w-3 mr-1" />
                          推荐
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white shadow-lg`}>
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        {method.id === 'global' && (
                          <div className="mt-2 text-xs text-green-700 bg-green-100 rounded-full px-3 py-1 inline-block">
                            🌍 支持全球200+国家/地区
                          </div>
                        )}
                      </div>
                      
                      {method.id === 'global' ? (
                        <Button 
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPayment(method);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          立即购买
                        </Button>
                      ) : (
                        <Button 
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 复制客服微信到剪贴板
                            navigator.clipboard.writeText('nano_banana_service');
                            alert('客服微信已复制到剪贴板：nano_banana_service');
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg"
                        >
                          联系客服充值
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                <Clock className="h-10 w-10 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">正在处理支付...</h3>
                <p className="text-gray-600 text-lg">请稍候，正在验证您的支付信息</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">安全处理中，请勿关闭页面</p>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && selectedPlan && (
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Check className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600 mb-4">🎉 支付成功！</h3>
                <p className="text-gray-600 text-lg mb-6">
                  您已成功购买 <span className="font-semibold text-purple-600">{selectedPlan.name}</span>，获得 <span className="font-semibold text-blue-600">{selectedPlan.credits}</span> 个积分
                </p>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-3">
                    <Gift className="h-6 w-6 text-green-600" />
                    <span className="text-green-800 font-bold text-xl">
                      新积分余额：{currentCredits + selectedPlan.credits}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleSuccess} 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold px-8 py-3 shadow-lg"
              >
                🚀 开始使用
              </Button>
            </div>
          )}

          {/* 安全提示 */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>所有支付均通过安全加密处理，保护您的隐私</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
