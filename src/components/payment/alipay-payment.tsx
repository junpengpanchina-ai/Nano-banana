"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';

interface AlipayPaymentProps {
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
}

export function AlipayPayment({ onPaymentSuccess, onPaymentError }: AlipayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    subject: '',
    description: '',
  });

  // 创建支付订单
  const handleCreatePayment = async () => {
    if (!formData.amount || !formData.subject) {
      setError('请填写支付金额和订单标题');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('支付金额必须大于0');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/alipay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outTradeNo: `ALIPAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          totalAmount: amount,
          subject: formData.subject,
          body: formData.description || formData.subject,
          returnUrl: `${window.location.origin}/payment/success`,
          notifyUrl: `${window.location.origin}/api/payment/alipay/callback`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentData(result.data);
        onPaymentSuccess?.(result.data);
      } else {
        setError(result.error || '创建支付订单失败');
        onPaymentError?.(result.error || '创建支付订单失败');
      }
    } catch (error) {
      const errorMessage = '网络错误，请重试';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 查询支付结果
  const handleQueryPayment = async () => {
    if (!paymentData?.outTradeNo) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/payment/alipay?outTradeNo=${paymentData.outTradeNo}`);
      const result = await response.json();

      if (result.success) {
        setPaymentData(prev => ({ ...prev, ...result.data }));
        onPaymentSuccess?.(result.data);
      } else {
        setError(result.error || '查询支付结果失败');
        onPaymentError?.(result.error || '查询支付结果失败');
      }
    } catch (error) {
      const errorMessage = '网络错误，请重试';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 复制支付链接
  const handleCopyPaymentUrl = () => {
    if (paymentData?.paymentUrl) {
      navigator.clipboard.writeText(paymentData.paymentUrl);
      alert('支付链接已复制到剪贴板');
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      amount: '',
      subject: '',
      description: '',
    });
    setPaymentData(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* 支付表单 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            支付宝支付
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">支付金额 (元)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="请输入支付金额"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="subject">订单标题</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="请输入订单标题"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">订单描述 (可选)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入订单描述"
              disabled={isLoading}
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleCreatePayment}
              disabled={isLoading || !formData.amount || !formData.subject}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  创建支付订单
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  创建支付订单
                </>
              )}
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isLoading}
            >
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 支付结果 */}
      {paymentData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              支付订单信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>商户订单号</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                  <span className="text-sm font-mono">{paymentData.outTradeNo}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentData.outTradeNo);
                      alert('订单号已复制到剪贴板');
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>支付状态</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600">
                    待支付
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleQueryPayment}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>支付链接</Label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                <span className="text-sm text-blue-600 truncate flex-1">
                  {paymentData.paymentUrl}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyPaymentUrl}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => window.open(paymentData.paymentUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                前往支付
              </Button>
              
              <Button
                onClick={handleQueryPayment}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                查询结果
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 支付说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">支付说明</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 点击"创建支付订单"后，系统会生成支付宝支付链接</li>
            <li>• 点击"前往支付"在新窗口中打开支付宝支付页面</li>
            <li>• 支付完成后，系统会自动更新支付状态</li>
            <li>• 如有问题，请联系客服：nano_banana_service</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}









