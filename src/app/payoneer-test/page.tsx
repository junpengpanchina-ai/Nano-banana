"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Banknote, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface PayoneerAccount {
  id: string;
  name: string;
  email: string;
  status: string;
  balance: {
    currency: string;
    amount: number;
  };
  bankAccounts: Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  }>;
}

interface PayoneerTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  date: string;
  type: 'credit' | 'debit';
}

export default function PayoneerTestPage() {
  const [accountInfo, setAccountInfo] = useState<PayoneerAccount | null>(null);
  const [transactions, setTransactions] = useState<PayoneerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccountInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payoneer/account');
      const result = await response.json();
      
      if (result.success) {
        setAccountInfo(result.data);
      } else {
        setError(result.error || 'Failed to load account info');
      }
    } catch (err) {
      setError('Failed to connect to Payoneer API');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payoneer/transactions?limit=10');
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
      } else {
        setError(result.error || 'Failed to load transactions');
      }
    } catch (err) {
      setError('Failed to connect to Payoneer API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccountInfo();
    loadTransactions();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Payoneer 账户测试</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            测试 Payoneer API 连接和账户信息查询
          </p>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={loadAccountInfo}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Banknote className="h-4 w-4 mr-2" />
            )}
            刷新账户信息
          </Button>
          
          <Button 
            onClick={loadTransactions}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            刷新交易记录
          </Button>
        </div>

        {/* 错误提示 */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">错误:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 账户信息 */}
        {accountInfo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-6 w-6" />
                账户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">基本信息</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">账户ID:</span>
                      <span className="font-mono text-sm">{accountInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">姓名:</span>
                      <span>{accountInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">邮箱:</span>
                      <span>{accountInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态:</span>
                      <Badge 
                        className={accountInfo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {accountInfo.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">账户余额</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(accountInfo.balance.amount, accountInfo.balance.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">可用余额</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 银行账户信息 */}
        {accountInfo?.bankAccounts && accountInfo.bankAccounts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                银行账户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountInfo.bankAccounts.map((bank, index) => (
                  <div key={bank.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">银行账户 {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">银行名称:</span>
                        <span className="ml-2 font-mono">{bank.bankName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">账户类型:</span>
                        <span className="ml-2">{bank.accountType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">账户号码:</span>
                        <span className="ml-2 font-mono">{bank.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">路由号码:</span>
                        <span className="ml-2 font-mono">{bank.routingNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 交易记录 */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                最近交易记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <Badge 
                        className={
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 配置说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>配置说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">环境变量配置</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                  <div>PAYONEER_API_KEY=your_api_key</div>
                  <div>PAYONEER_API_SECRET=your_api_secret</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">API 端点</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs">
                  <div>GET /api/payoneer/account - 获取账户信息</div>
                  <div>GET /api/payoneer/transactions - 获取交易记录</div>
                  <div>GET /api/payoneer/balance - 获取账户余额</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">注意事项</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>需要先在 Payoneer 开发者中心申请 API 密钥</li>
                  <li>API 调用有频率限制，请合理使用</li>
                  <li>敏感信息请妥善保管，不要泄露</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
