# 支付网关配置指南

## 🔧 环境变量配置

在你的 `.env.local` 文件中添加以下配置：

```bash
# Stripe支付配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# PayPal支付配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# 支付宝配置
NEXT_PUBLIC_ALIPAY_MERCHANT_ID=your_alipay_merchant_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
ALIPAY_PUBLIC_KEY=your_alipay_public_key
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do
```

## 🏦 支付网关申请流程

### 1. Stripe 申请

#### 步骤：
1. 访问 [Stripe官网](https://stripe.com)
2. 注册账户并完成验证
3. 获取测试密钥和正式密钥
4. 配置Webhook端点

#### 费率：
- 美国: 2.9% + $0.30
- 欧洲: 1.4% + €0.25
- 国际卡: 额外1.5%
- 货币转换: 1%

#### 支持地区：
- 美国、加拿大、英国、德国、法国、意大利、西班牙等40+国家

### 2. PayPal 申请

#### 步骤：
1. 访问 [PayPal开发者中心](https://developer.paypal.com)
2. 创建应用获取Client ID
3. 配置回调URL
4. 测试沙箱环境

#### 费率：
- 国内: 2.9% + $0.30
- 国际: 4.4% + 固定费用
- 货币转换: 2.5%

#### 支持地区：
- 全球200+国家

### 3. 支付宝申请

#### 步骤：
1. 访问 [支付宝开放平台](https://open.alipay.com)
2. 注册开发者账户
3. 创建应用获取商户ID
4. 配置密钥和回调地址

#### 费率：
- 国内: 0.6%
- 国际: 0.6% - 1.0%

#### 支持地区：
- 中国、香港、台湾、新加坡、马来西亚、泰国等

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @stripe/stripe-js @paypal/react-paypal-js
```

### 2. 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并填入你的密钥。

### 3. 测试支付

访问 http://localhost:3000/multi-payment 测试多网关支付功能。

## 🔒 安全注意事项

### 1. 密钥管理
- 永远不要在客户端代码中暴露私钥
- 使用环境变量存储敏感信息
- 定期轮换API密钥

### 2. 数据保护
- 启用HTTPS
- 实施PCI DSS合规
- 使用3D Secure验证

### 3. 风控措施
- 设置交易限额
- 监控异常交易
- 实施欺诈检测

## 📱 移动端适配

### 响应式设计
- 支付组件已适配移动端
- 支持触摸操作
- 优化移动支付体验

### 原生支付
- 支持Apple Pay
- 支持Google Pay
- 支持支付宝APP

## 🌍 国际化支持

### 多语言
- 支持中文、英文
- 自动检测用户语言
- 本地化支付界面

### 多币种
- 自动货币转换
- 本地化价格显示
- 支持135+货币

## 🔧 开发工具

### 测试环境
- Stripe测试卡号: 4242 4242 4242 4242
- PayPal沙箱账户
- 支付宝测试环境

### 调试工具
- Stripe Dashboard
- PayPal开发者工具
- 支付宝开放平台

## 📞 技术支持

### 官方文档
- [Stripe文档](https://stripe.com/docs)
- [PayPal文档](https://developer.paypal.com/docs)
- [支付宝文档](https://opendocs.alipay.com)

### 社区支持
- GitHub Issues
- Stack Overflow
- 开发者论坛

---

*配置完成后，你的网站就可以支持全球用户的多种支付方式了！*








