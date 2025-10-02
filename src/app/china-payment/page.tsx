"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  QrCode,
  Smartphone,
  Globe,
  Star,
  Users,
  Shield,
  DollarSign,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ChinaPaymentPage() {
  const [selectedSolution, setSelectedSolution] = useState<string>('');

  const solutions = [
    {
      id: 'alipay',
      name: '支付宝开放平台',
      type: 'official',
      difficulty: '简单',
      rate: '0.6%',
      requirements: ['身份证', '手机号'],
      advantages: ['用户基数大', '支付成功率高', '无需海外银行卡'],
      disadvantages: ['仅限中国用户', '需要支付宝账户'],
      icon: <QrCode className="h-6 w-6" />,
      color: 'from-blue-400 to-blue-500',
      recommended: true,
      link: 'https://open.alipay.com'
    },
    {
      id: 'wechat',
      name: '微信支付',
      type: 'official',
      difficulty: '中等',
      rate: '0.6%',
      requirements: ['身份证', '手机号', '微信认证'],
      advantages: ['社交属性强', '用户粘性高', '无需海外银行卡'],
      disadvantages: ['需要微信认证', '审核较严格'],
      icon: <Smartphone className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      recommended: true,
      link: 'https://pay.weixin.qq.com'
    },
    {
      id: 'yeepay',
      name: '易宝支付',
      type: 'third-party',
      difficulty: '简单',
      rate: '0.6%',
      requirements: ['身份证', '银行卡'],
      advantages: ['一站式接入', '技术支持好', '个人可申请'],
      disadvantages: ['知名度较低', '功能相对简单'],
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      recommended: true,
      link: 'https://www.yeepay.com'
    },
    {
      id: 'personal-qr',
      name: '个人收款码',
      type: 'personal',
      difficulty: '最简单',
      rate: '0%',
      requirements: ['支付宝/微信账户'],
      advantages: ['免费申请', '无需审核', '立即可用'],
      disadvantages: ['需要手动确认', '每日限额', '用户体验差'],
      icon: <QrCode className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      recommended: false,
      link: ''
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '最简单': return 'bg-green-100 text-green-800';
      case '简单': return 'bg-blue-100 text-blue-800';
      case '中等': return 'bg-yellow-100 text-yellow-800';
      case '困难': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'third-party': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
            
            <div className="flex items-center space-x-4">
              <Link href="/global-payment">
                <Button variant="ghost">全球支付方案</Button>
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
            中国用户支付解决方案
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            没有海外银行卡和营业执照？这些方案适合你！
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>支付宝支付</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>微信支付</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>易宝支付</span>
            </div>
          </div>
        </div>

        {/* 问题说明 */}
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">你的情况</h3>
                <p className="text-red-600">
                  没有海外银行卡和营业执照，无法注册 Stripe 等国际支付平台
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 解决方案 */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">推荐解决方案</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution) => (
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
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center text-white`}>
                        {solution.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{solution.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getTypeColor(solution.type)}>
                            {solution.type === 'official' ? '官方' : 
                             solution.type === 'third-party' ? '第三方' : '个人'}
                          </Badge>
                          <Badge className={getDifficultyColor(solution.difficulty)}>
                            {solution.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 费率 */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">费率</span>
                      <span className="text-2xl font-bold text-blue-600">{solution.rate}</span>
                    </div>
                  </div>

                  {/* 申请要求 */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">申请要求</h4>
                    <div className="flex flex-wrap gap-1">
                      {solution.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 优势 */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">优势</h4>
                    <div className="space-y-1">
                      {solution.advantages.map((advantage, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 劣势 */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">劣势</h4>
                    <div className="space-y-1">
                      {solution.disadvantages.map((disadvantage, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>{disadvantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="pt-4">
                    {solution.link ? (
                      <Button
                        onClick={() => setSelectedSolution(solution.id)}
                        className={`w-full ${
                          solution.recommended 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                            : 'bg-gray-700 hover:bg-gray-800'
                        } text-white`}
                        asChild
                      >
                        <a href={solution.link} target="_blank" rel="noopener noreferrer">
                          立即申请
                        </a>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setSelectedSolution(solution.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        了解详情
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 申请步骤 */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              申请步骤
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="alipay" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="alipay">支付宝</TabsTrigger>
                <TabsTrigger value="wechat">微信支付</TabsTrigger>
                <TabsTrigger value="yeepay">易宝支付</TabsTrigger>
              </TabsList>

              <TabsContent value="alipay" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. 注册开发者</h4>
                    <p className="text-sm text-gray-600">访问支付宝开放平台，使用支付宝账户登录</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. 创建应用</h4>
                    <p className="text-sm text-gray-600">选择"网页&移动应用"，填写应用信息</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. 申请接口</h4>
                    <p className="text-sm text-gray-600">申请"手机网站支付"和"电脑网站支付"</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. 获取密钥</h4>
                    <p className="text-sm text-gray-600">生成应用私钥，上传公钥，获取APPID</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wechat" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. 注册开放平台</h4>
                    <p className="text-sm text-gray-600">访问微信开放平台，注册开发者账户</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. 企业认证</h4>
                    <p className="text-sm text-gray-600">完成企业认证，提交营业执照</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. 申请支付</h4>
                    <p className="text-sm text-gray-600">提交商户信息，等待审核</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. 配置参数</h4>
                    <p className="text-sm text-gray-600">获取商户号，配置API密钥</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="yeepay" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. 注册账户</h4>
                    <p className="text-sm text-gray-600">访问易宝支付官网，注册开发者账户</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. 提交资料</h4>
                    <p className="text-sm text-gray-600">提交身份证和银行卡信息</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. 等待审核</h4>
                    <p className="text-sm text-gray-600">等待易宝支付审核通过</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. 获取密钥</h4>
                    <p className="text-sm text-gray-600">获取商户号和API密钥</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 成本对比 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              成本对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">方案</th>
                    <th className="text-left p-2">申请难度</th>
                    <th className="text-left p-2">费率</th>
                    <th className="text-left p-2">技术要求</th>
                    <th className="text-left p-2">推荐指数</th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((solution) => (
                    <tr key={solution.id} className="border-b">
                      <td className="p-2 font-medium">{solution.name}</td>
                      <td className="p-2">
                        <Badge className={getDifficultyColor(solution.difficulty)}>
                          {solution.difficulty}
                        </Badge>
                      </td>
                      <td className="p-2 font-bold text-blue-600">{solution.rate}</td>
                      <td className="p-2">
                        {solution.type === 'personal' ? '无' : 
                         solution.type === 'official' ? '中等' : '简单'}
                      </td>
                      <td className="p-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < (solution.recommended ? 5 : 3) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 快速开始建议 */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              快速开始建议
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🥇 首选方案</h4>
                <p className="text-sm text-gray-600">
                  支付宝开放平台，个人可申请，费率低，用户基数大
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🥈 备选方案</h4>
                <p className="text-sm text-gray-600">
                  易宝支付，一站式接入，技术支持好，个人可申请
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">🥉 临时方案</h4>
                <p className="text-sm text-gray-600">
                  个人收款码，免费申请，立即可用，适合小规模业务
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}








