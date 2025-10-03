"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Users, 
  QrCode, 
  Smartphone,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign
} from 'lucide-react';
import { 
  PAYMENT_GATEWAYS, 
  getAvailableGateways, 
  getRecommendedPaymentMethods,
  detectUserRegion,
  getGatewayFees,
  type PaymentGateway,
  type PaymentMethod
} from '@/lib/payment-gateways';

interface MultiGatewayPaymentProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (gateway: string, transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

export function MultiGatewayPayment({ 
  amount, 
  currency, 
  onPaymentSuccess, 
  onPaymentError 
}: MultiGatewayPaymentProps) {
  const [userRegion, setUserRegion] = useState<string>('US');
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [recommendedMethods, setRecommendedMethods] = useState<PaymentMethod[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 检测用户地区
    const region = detectUserRegion();
    setUserRegion(region);
    
    // 获取可用网关
    const gateways = getAvailableGateways(region);
    setAvailableGateways(gateways);
    
    // 获取推荐支付方式
    const methods = getRecommendedPaymentMethods(region);
    setRecommendedMethods(methods);
    
    // 自动选择第一个推荐方式
    if (gateways.length > 0) {
      setSelectedGateway(gateways[0].id);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    }
  }, []);

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      case 'QrCode': return <QrCode className="h-5 w-5" />;
      case 'Smartphone': return <Smartphone className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getGatewayIcon = (gateway: PaymentGateway) => {
    switch (gateway.type) {
      case 'stripe': return <CreditCard className="h-6 w-6" />;
      case 'paypal': return <Users className="h-6 w-6" />;
      case 'alipay': return <QrCode className="h-6 w-6" />;
      default: return <Globe className="h-6 w-6" />;
    }
  };

  const handlePayment = async () => {
    if (!selectedGateway || !selectedMethod) {
      onPaymentError('请选择支付方式');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟支付成功
      const transactionId = `${selectedGateway}_${Date.now()}`;
      onPaymentSuccess(selectedGateway, transactionId);
      
    } catch (error) {
      onPaymentError('支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const getGatewayColor = (gateway: PaymentGateway) => {
    switch (gateway.type) {
      case 'stripe': return 'from-purple-500 to-purple-600';
      case 'paypal': return 'from-blue-500 to-blue-600';
      case 'alipay': return 'from-blue-400 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRegionFlag = (region: string) => {
    const flags = {
      'US': '🇺🇸',
      'CN': '🇨🇳',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'JP': '🇯🇵',
      'SG': '🇸🇬'
    };
    return flags[region as keyof typeof flags] || '🌍';
  };

  return (
    <div className="space-y-6">
      {/* 用户地区显示 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRegionFlag(userRegion)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">检测到您的地区</h3>
              <p className="text-sm text-gray-600">为您推荐最适合的支付方式</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white">
            {userRegion}
          </Badge>
        </div>
      </div>

      {/* 支付金额 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">支付金额</h3>
              <p className="text-sm text-gray-600">选择支付方式完成购买</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {currency} {amount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">包含所有费用</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 推荐支付方式 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          推荐支付方式
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedMethods.slice(0, 4).map((method) => (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMethod === method.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => {
                setSelectedMethod(method.id);
                // 找到对应的网关
                const gateway = availableGateways.find(g => 
                  g.supportedMethods.some(m => m.id === method.id)
                );
                if (gateway) {
                  setSelectedGateway(gateway.id);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                    {getMethodIcon(method.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 其他支付网关 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-500" />
          其他支付方式
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableGateways.map((gateway) => (
            <Card 
              key={gateway.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGateway === gateway.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => setSelectedGateway(gateway.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGatewayColor(gateway)} flex items-center justify-center text-white`}>
                    {getGatewayIcon(gateway)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{gateway.name}</h4>
                    <p className="text-xs text-gray-600">{gateway.supportedCurrencies.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>费率:</strong> {getGatewayFees(gateway.id).domestic}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gateway.supportedMethods.slice(0, 2).map((method) => (
                      <Badge key={method.id} variant="outline" className="text-xs">
                        {method.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 支付按钮 */}
      <div className="space-y-4">
        {selectedGateway && selectedMethod && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-800">已选择支付方式</span>
            </div>
            <p className="text-sm text-green-700">
              使用 {availableGateways.find(g => g.id === selectedGateway)?.name} 进行支付
            </p>
          </div>
        )}
        
        <Button
          onClick={handlePayment}
          disabled={!selectedGateway || !selectedMethod || isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-5 w-5" />
              立即支付 {currency} {amount.toFixed(2)}
            </>
          )}
        </Button>
        
        <div className="text-center text-xs text-gray-500">
          支付过程安全加密，支持退款保证
        </div>
      </div>
    </div>
  );
}









