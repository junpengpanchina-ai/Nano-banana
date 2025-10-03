# Lemon Squeezy 完整设置指南

## 🎯 快速开始（5分钟拿到 Hosted Checkout 链接）

### 步骤 1: 注册 Lemon Squeezy
1. 访问 [Lemon Squeezy](https://www.lemonsqueezy.com/)
2. 点击 "Sign Up" 注册账户
3. 验证邮箱

### 步骤 2: 创建商店
1. 登录后点击 "Create Store"
2. 填写商店信息：
   - Store Name: `Nano Banana`
   - Store URL: `nano-banana` (会自动生成)
3. 点击 "Create Store"

### 步骤 3: 创建产品
1. 左侧菜单 → Products → New Product
2. 填写产品信息：
   - Product Name: `Nano Banana Credits`
   - Type: `Digital product`
3. 点击 "Save"

### 步骤 4: 添加套餐变体
1. 在产品页面点击 "Add Variant"
2. 创建三个套餐：

**入门版 (Starter)**
- Variant Name: `Starter 50 Credits`
- Price: `$4.99`
- Frequency: `One-time`

**专业版 (Pro)**
- Variant Name: `Pro 200 Credits`
- Price: `$19.99`
- Frequency: `One-time`

**企业版 (Enterprise)**
- Variant Name: `Enterprise 1000 Credits`
- Price: `$99.99`
- Frequency: `One-time`

### 步骤 5: 获取 Hosted Checkout 链接
1. 点击任意一个 Variant
2. 找到 "Checkout" 或 "Buy button" 部分
3. 复制 "Hosted Checkout Link"
4. 链接格式：`https://store.lemonsqueezy.com/checkout/buy/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 步骤 6: 配置环境变量
在 `.env.local` 文件中添加：
```bash
# Lemon Squeezy 配置
NEXT_PUBLIC_LEMON_CHECKOUT_URL=https://store.lemonsqueezy.com/checkout/buy/你的-variant-id
NEXT_PUBLIC_LEMON_STORE=你的-store-id
LEMON_WEBHOOK_SECRET=你的-webhook-secret
LEMON_SUCCESS_URL=http://localhost:3000/payment/success
LEMON_CANCEL_URL=http://localhost:3000/payment/cancel
```

## 🔧 详细配置

### 1. 获取 Store ID
1. 在 Dashboard 首页
2. 查看 URL 或设置页面
3. Store ID 格式：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 2. 设置 Webhook
1. 进入 Settings → Developer → Webhooks
2. 点击 "Add webhook"
3. 填写信息：
   - URL: `https://你的域名.com/api/webhooks/lemon`
   - 本地测试: `https://your-ngrok-url.ngrok.io/api/webhooks/lemon`
4. 选择事件：
   - `order_created`
   - `subscription_payment_success`
   - `order_refunded`
5. 保存后复制 "Signing Secret"

### 3. 测试支付流程
1. 访问 `http://localhost:3000/lemon-test`
2. 点击 "立即购买"
3. 在弹出窗口中完成支付
4. 检查 Webhook 是否正常接收

## 🌍 全球支付特性

### 支持的支付方式
- **信用卡**: Visa, Mastercard, American Express
- **数字钱包**: PayPal, Apple Pay, Google Pay
- **银行转账**: 支持多个国家
- **加密货币**: Bitcoin, Ethereum (部分国家)

### 支持的货币
- USD (美元)
- EUR (欧元)
- GBP (英镑)
- CAD (加元)
- AUD (澳元)
- JPY (日元)
- 更多货币...

### 税费处理
- **自动计算**: 根据用户地区自动计算税费
- **合规处理**: 符合各国税务要求
- **透明收费**: 用户清楚看到税费明细

## 💰 费率结构

### Lemon Squeezy 费用
- **交易费**: 3.5% + $0.50
- **无月费**: 没有固定月费
- **无设置费**: 免费注册和设置

### 对比其他服务
| 服务 | 交易费 | 月费 | 设置费 | 税费处理 |
|------|--------|------|--------|----------|
| Lemon Squeezy | 3.5% + $0.50 | 无 | 无 | ✅ 自动 |
| Stripe | 2.9% + $0.30 | 无 | 无 | ❌ 手动 |
| PayPal | 2.9% + $0.30 | 无 | 无 | ❌ 手动 |

## 🔒 安全特性

### 数据安全
- **PCI DSS 合规**: 符合最高安全标准
- **SSL 加密**: 所有数据传输加密
- **定期审计**: 第三方安全审计

### 支付安全
- **3D Secure**: 支持 3D Secure 验证
- **欺诈检测**: 自动欺诈检测系统
- **退款保护**: 自动处理退款

## 📊 数据分析

### Dashboard 功能
- **实时销售**: 实时查看销售数据
- **收入统计**: 详细的收入报表
- **客户分析**: 客户购买行为分析
- **退款管理**: 退款请求处理

### 报表导出
- **CSV 导出**: 支持 Excel 格式
- **API 访问**: 通过 API 获取数据
- **Webhook 数据**: 实时事件通知

## 🚀 高级功能

### 1. 订阅管理
- 支持订阅产品
- 自动续费
- 订阅取消处理

### 2. 优惠券系统
- 创建折扣码
- 设置有效期
- 使用限制

### 3. 多语言支持
- 结账页面多语言
- 自动检测用户语言
- 自定义翻译

### 4. 品牌定制
- 自定义 Logo
- 品牌色彩
- 自定义域名

## 🛠️ 开发集成

### API 文档
- [Lemon Squeezy API](https://docs.lemonsqueezy.com/api)
- [Webhook 文档](https://docs.lemonsqueezy.com/help/webhooks)
- [SDK 支持](https://docs.lemonsqueezy.com/help/sdks)

### 测试环境
- **测试模式**: 使用测试 API 密钥
- **测试卡号**: 提供测试信用卡号
- **沙盒环境**: 完全隔离的测试环境

### 生产部署
1. 更新环境变量为生产值
2. 配置生产 Webhook URL
3. 测试真实支付流程
4. 监控 Webhook 日志

## 📞 技术支持

### 官方支持
- **文档**: [Lemon Squeezy Docs](https://docs.lemonsqueezy.com/)
- **社区**: [Discord Community](https://discord.gg/lemonsqueezy)
- **邮件**: support@lemonsqueezy.com

### 常见问题
1. **Q: 如何更改产品价格？**
   A: 在产品页面编辑 Variant，修改价格后保存。

2. **Q: Webhook 不工作怎么办？**
   A: 检查 URL 是否可访问，签名是否正确。

3. **Q: 如何退款？**
   A: 在订单页面点击 "Refund" 按钮。

4. **Q: 支持哪些国家？**
   A: 支持 200+ 国家，具体列表见官网。

## 🎉 完成设置

配置完成后，你的全球支付系统就搭建完成了！

### 测试清单
- [ ] Lemon Squeezy 账户注册
- [ ] 商店和产品创建
- [ ] Hosted Checkout 链接获取
- [ ] 环境变量配置
- [ ] Webhook 设置
- [ ] 测试支付流程
- [ ] Payoneer 账户设置
- [ ] 提现测试

### 下一步
1. 配置 Payoneer 接收美元
2. 设置自动提现规则
3. 监控支付数据
4. 优化转化率

现在你可以开始接收全球用户的付款了！🌍💰
