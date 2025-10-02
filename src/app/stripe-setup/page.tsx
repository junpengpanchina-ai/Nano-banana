"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Globe,
  Shield,
  DollarSign,
  Clock,
  Users,
  FileText,
  Key,
  TestTube
} from 'lucide-react';
import Link from 'next/link';

export default function StripeSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: '访问注册页面',
      description: '打开 Stripe 注册页面并选择地区',
      icon: <Globe className="h-5 w-5" />,
      details: [
        '访问 https://dashboard.stripe.com/register',
        '选择你所在的国家/地区',
        '输入邮箱地址、全名和密码',
        '点击"创建账户"按钮'
      ],
      link: 'https://dashboard.stripe.com/register',
      estimatedTime: '2分钟'
    },
    {
      id: 2,
      title: '验证邮箱',
      description: '检查邮箱并完成验证',
      icon: <CheckCircle className="h-5 w-5" />,
      details: [
        '检查你的邮箱收件箱',
        '找到 Stripe 发送的验证邮件',
        '点击邮件中的验证链接',
        '完成邮箱验证'
      ],
      estimatedTime: '1分钟'
    },
    {
      id: 3,
      title: '填写业务信息',
      description: '提供详细的业务和个人信息',
      icon: <FileText className="h-5 w-5" />,
      details: [
        '选择业务类型（个人/公司/非营利组织）',
        '填写个人信息（姓名、出生日期、地址）',
        '提供业务详情（业务名称、网站、描述）',
        '上传身份证件和地址证明'
      ],
      estimatedTime: '10分钟'
    },
    {
      id: 4,
      title: '添加银行账户',
      description: '设置用于接收付款的银行账户',
      icon: <DollarSign className="h-5 w-5" />,
      details: [
        '提供银行账户详细信息',
        '确保账户与注册地区一致',
        '验证银行账户信息',
        '设置结算周期'
      ],
      estimatedTime: '5分钟'
    },
    {
      id: 5,
      title: '身份验证',
      description: '上传必要的身份证明文件',
      icon: <Shield className="h-5 w-5" />,
      details: [
        '上传身份证件（护照/驾驶证/身份证）',
        '提供地址证明文件',
        '等待 Stripe 审核',
        '可能需要补充额外文件'
      ],
      estimatedTime: '1-3天'
    },
    {
      id: 6,
      title: '获取API密钥',
      description: '获取测试和正式环境的API密钥',
      icon: <Key className="h-5 w-5" />,
      details: [
        '登录 Stripe Dashboard',
        '进入"开发者" > "API 密钥"',
        '复制测试环境密钥',
        '配置到你的项目中'
      ],
      estimatedTime: '3分钟'
    },
    {
      id: 7,
      title: '测试支付',
      description: '使用测试卡号验证支付功能',
      icon: <TestTube className="h-5 w-5" />,
      details: [
        '使用测试卡号进行支付测试',
        '测试成功和失败场景',
        '验证 Webhook 功能',
        '确保支付流程正常'
      ],
      estimatedTime: '10分钟'
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

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
              <Link href="/multi-payment">
                <Button variant="ghost">多网关支付</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stripe 注册指南
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            一步步教你如何注册和配置 Stripe 支付
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>支持40+国家</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>135+货币</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>银行级安全</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 进度条 */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">注册进度</h3>
                <span className="text-sm text-gray-600">
                  {completedSteps.length} / {steps.length} 步骤完成
                </span>
              </div>
              <Progress value={progress} className="mb-4" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>预计总时间: 15-30分钟（不含审核时间）</span>
              </div>
            </CardContent>
          </Card>

          {/* 步骤列表 */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card 
                key={step.id}
                className={`transition-all duration-200 hover:shadow-lg ${
                  currentStep === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${
                  completedSteps.includes(step.id) ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        completedSteps.includes(step.id) 
                          ? 'bg-green-500 text-white' 
                          : currentStep === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completedSteps.includes(step.id) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {step.estimatedTime}
                      </Badge>
                      {step.link && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={step.link} target="_blank" rel="noopener noreferrer">
                            访问
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {currentStep === index && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">详细步骤:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                                {detailIndex + 1}
                              </span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {step.link && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">相关链接</span>
                          </div>
                          <a 
                            href={step.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {step.link}
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleStepComplete(step.id)}
                          disabled={completedSteps.includes(step.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {completedSteps.includes(step.id) ? '已完成' : '标记完成'}
                        </Button>
                        {index < steps.length - 1 && (
                          <Button 
                            onClick={() => setCurrentStep(index + 1)}
                            variant="outline"
                          >
                            下一步
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* 重要提醒 */}
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                重要提醒
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 地区限制</h4>
                  <p className="text-sm text-gray-600">
                    Stripe 目前不支持中国大陆地区，但支持香港、台湾、新加坡等地区。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">📋 所需文件</h4>
                  <p className="text-sm text-gray-600">
                    准备身份证件、地址证明、银行账户信息等必要文件。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">⏰ 审核时间</h4>
                  <p className="text-sm text-gray-600">
                    身份验证通常需要 1-3 个工作日，复杂情况可能需要更长时间。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">🧪 测试环境</h4>
                  <p className="text-sm text-gray-600">
                    注册完成后，先在测试环境中验证支付功能，确保一切正常。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 测试卡号 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                测试卡号
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✅ 成功支付</h4>
                  <div className="space-y-1 text-sm">
                    <div className="bg-gray-100 p-2 rounded font-mono">4242 4242 4242 4242</div>
                    <div className="text-gray-600">Visa 测试卡</div>
                    <div className="bg-gray-100 p-2 rounded font-mono">5555 5555 5555 4444</div>
                    <div className="text-gray-600">MasterCard 测试卡</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">❌ 失败支付</h4>
                  <div className="space-y-1 text-sm">
                    <div className="bg-gray-100 p-2 rounded font-mono">4000 0000 0000 0002</div>
                    <div className="text-gray-600">被拒绝</div>
                    <div className="bg-gray-100 p-2 rounded font-mono">4000 0000 0000 9995</div>
                    <div className="text-gray-600">资金不足</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}








