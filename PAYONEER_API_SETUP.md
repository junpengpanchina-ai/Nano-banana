# Payoneer API 设置指南

## 🔑 获取 API 密钥

### 1. 访问开发者中心
- 打开 https://developer.payoneer.com/
- 使用你的 Payoneer 账户登录

### 2. 创建应用程序
1. 点击 "Create Application"
2. 填写应用信息：
   - **应用名称**: Nano Banana Payment
   - **描述**: 全球支付系统集成
   - **回调 URL**: https://your-domain.com/api/payoneer/callback
   - **权限范围**: 选择需要的权限

### 3. 获取 API 密钥
创建应用后，你会得到：
- **Client ID** (API Key)
- **Client Secret** (API Secret)

### 4. 配置环境变量
在 `.env.local` 文件中添加：
```bash
PAYONEER_API_KEY=your_client_id
PAYONEER_API_SECRET=your_client_secret
```

## 🛠️ API 功能

### 1. 账户信息查询
```javascript
// 获取账户基本信息
GET /api/payoneer/account

// 响应示例
{
  "success": true,
  "data": {
    "id": "123456",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "balance": {
      "currency": "USD",
      "amount": 1000.50
    },
    "bankAccounts": [...]
  }
}
```

### 2. 交易记录查询
```javascript
// 获取交易记录
GET /api/payoneer/transactions?limit=50

// 响应示例
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "amount": 100.00,
      "currency": "USD",
      "status": "completed",
      "description": "Payment from Lemon Squeezy",
      "date": "2024-01-15T10:30:00Z",
      "type": "credit"
    }
  ]
}
```

### 3. 账户余额查询
```javascript
// 获取账户余额
GET /api/payoneer/balance

// 响应示例
{
  "success": true,
  "data": {
    "currency": "USD",
    "amount": 1000.50
  }
}
```

## 🔧 集成步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp env.example .env.local

# 编辑环境变量
nano .env.local
```

### 3. 测试 API 连接
```bash
# 访问测试页面
http://localhost:3000/payoneer-test
```

### 4. 验证功能
- 检查账户信息是否正确显示
- 验证交易记录是否正常加载
- 确认余额信息准确

## 📊 权限说明

### 必需权限
- **account:read** - 读取账户信息
- **transactions:read** - 读取交易记录
- **balance:read** - 读取账户余额

### 可选权限
- **transactions:write** - 创建交易
- **withdraw:write** - 发起提现
- **webhooks:manage** - 管理 Webhook

## 🔒 安全注意事项

### 1. API 密钥安全
- 不要在代码中硬编码 API 密钥
- 使用环境变量存储敏感信息
- 定期轮换 API 密钥

### 2. 访问控制
- 限制 API 调用频率
- 实施适当的错误处理
- 记录所有 API 调用

### 3. 数据保护
- 加密存储敏感数据
- 实施数据访问控制
- 定期备份重要数据

## 🧪 测试流程

### 1. 本地测试
```bash
# 启动开发服务器
npm run dev

# 访问测试页面
http://localhost:3000/payoneer-test
```

### 2. API 测试
```bash
# 测试账户信息
curl http://localhost:3000/api/payoneer/account

# 测试交易记录
curl http://localhost:3000/api/payoneer/transactions

# 测试账户余额
curl http://localhost:3000/api/payoneer/balance
```

### 3. 生产部署
1. 配置生产环境变量
2. 设置 HTTPS 证书
3. 配置防火墙规则
4. 监控 API 调用

## 📞 技术支持

### 官方支持
- **API 文档**: https://developer.payoneer.com/docs
- **支持中心**: https://www.payoneer.com/help/
- **客服电话**: 400-841-6666

### 常见问题
1. **Q: API 调用失败怎么办？**
   A: 检查 API 密钥是否正确，网络连接是否正常

2. **Q: 如何提高 API 调用频率？**
   A: 联系 Payoneer 客服申请提高限制

3. **Q: 数据不准确怎么办？**
   A: 检查权限设置，确保有足够的访问权限

## 🎯 最佳实践

### 1. 错误处理
```javascript
try {
  const response = await fetch('/api/payoneer/account');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
} catch (error) {
  console.error('API call failed:', error);
  // 处理错误
}
```

### 2. 缓存策略
```javascript
// 缓存账户信息，避免频繁调用
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟
let cachedAccountInfo = null;
let lastFetchTime = 0;

const getAccountInfo = async () => {
  const now = Date.now();
  if (cachedAccountInfo && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedAccountInfo;
  }
  
  const data = await fetchAccountInfo();
  cachedAccountInfo = data;
  lastFetchTime = now;
  return data;
};
```

### 3. 监控和日志
```javascript
// 记录 API 调用
const logApiCall = (endpoint, success, duration) => {
  console.log(`API Call: ${endpoint} - ${success ? 'Success' : 'Failed'} - ${duration}ms`);
};
```

现在你可以开始使用 Payoneer API 了！🚀
