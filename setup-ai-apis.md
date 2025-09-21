# AI API 配置指南

## 快速开始

### 1. 创建环境变量文件
```bash
cp env.example .env.local
```

### 2. 编辑 .env.local 文件
```bash
nano .env.local
```

### 3. 配置API密钥

#### 方案A：Stability AI (推荐)
```env
# 主要AI服务
AI_DEFAULT_SERVICE=stability
STABILITY_API_KEY=your_stability_api_key_here

# 其他服务（可选）
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

#### 方案B：OpenAI DALL-E 3 (高质量)
```env
# 主要AI服务
AI_DEFAULT_SERVICE=openai
OPENAI_API_KEY=your_openai_api_key_here

# 其他服务（可选）
STABILITY_API_KEY=your_stability_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 4. 重启开发服务器
```bash
npm run dev
```

## 获取API密钥

### Stability AI
1. 访问：https://platform.stability.ai/
2. 注册账号
3. 验证邮箱
4. 创建API Key
5. 复制密钥到 .env.local

**价格**：$0.004-0.02/张
**特点**：开源友好，速度快，质量高

### OpenAI DALL-E 3
1. 访问：https://platform.openai.com/
2. 注册账号
3. 添加支付方式
4. 创建API Key
5. 复制密钥到 .env.local

**价格**：$0.04-0.08/张
**特点**：理解能力最强，质量极高

### Replicate
1. 访问：https://replicate.com/
2. 注册账号
3. 获取API Token
4. 复制Token到 .env.local

**价格**：$0.002-0.05/次
**特点**：模型丰富，按需付费

## 测试配置

### 1. 测试API连接
```bash
curl -X GET http://localhost:3000/api/generate/image
```

### 2. 测试图像生成
```bash
curl -X POST http://localhost:3000/api/generate/image \
  -F "prompt=anime figure, 3d model, high quality" \
  -F "service=stability"
```

### 3. 使用测试页面
访问：http://localhost:3000/test-api.html

## 故障排除

### 常见问题

1. **API Key无效**
   - 检查密钥是否正确复制
   - 确认账号已激活
   - 检查余额是否充足

2. **403 Forbidden**
   - 检查API Key权限
   - 确认服务是否可用

3. **429 Rate Limited**
   - 等待一段时间后重试
   - 检查使用量限制

4. **500 Internal Error**
   - 检查服务器日志
   - 确认环境变量配置

### 调试模式

在 .env.local 中添加：
```env
LOG_LEVEL=debug
ENABLE_API_LOGGING=true
```

## 推荐配置

### 开发环境
```env
AI_DEFAULT_SERVICE=stability
STABILITY_API_KEY=your_key
AI_FALLBACK_ENABLED=true
```

### 生产环境
```env
AI_DEFAULT_SERVICE=stability
STABILITY_API_KEY=your_key
OPENAI_API_KEY=your_key
REPLICATE_API_TOKEN=your_token
AI_FALLBACK_ENABLED=true
```

## 成本估算

### 每月1000张图片
- **Stability AI**: $4-20
- **OpenAI**: $40-80
- **Replicate**: $2-50

### 推荐组合
- **主要服务**: Stability AI
- **备用服务**: OpenAI (高质量需求)
- **特殊需求**: Replicate (特定模型)


