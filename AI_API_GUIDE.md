# AI图像生成API对接指南

## 概述

本文档介绍如何为Nano Banana项目对接真实的AI图像生成API服务。项目已集成多个主流AI服务商，支持灵活切换和降级处理。

## 已集成的AI服务

### 1. Stability AI (推荐)

**特点**：
- 开源友好，价格合理
- 支持SDXL、SD 1.5等模型
- 生成速度快，质量高
- 支持ControlNet精确控制

**API配置**：
```bash
STABILITY_API_KEY=your_stability_api_key
```

**价格**：$0.004-0.02/张

**获取API Key**：
1. 访问 https://platform.stability.ai/
2. 注册账号并验证邮箱
3. 在API Keys页面创建新的API Key
4. 复制API Key到环境变量

### 2. OpenAI DALL-E 3

**特点**：
- 理解能力最强
- 生成质量极高
- 支持复杂描述
- 企业级稳定性

**API配置**：
```bash
OPENAI_API_KEY=your_openai_api_key
```

**价格**：$0.04-0.08/张

**获取API Key**：
1. 访问 https://platform.openai.com/
2. 注册账号并添加支付方式
3. 在API Keys页面创建新的Secret Key
4. 复制API Key到环境变量

### 3. Replicate

**特点**：
- 托管各种开源模型
- 按使用付费
- 模型选择丰富
- 支持自定义模型

**API配置**：
```bash
REPLICATE_API_TOKEN=your_replicate_api_token
```

**价格**：$0.002-0.05/次

**获取API Token**：
1. 访问 https://replicate.com/
2. 注册账号
3. 在Account页面获取API Token
4. 复制Token到环境变量

## 使用方法

### 1. 环境配置

创建 `.env.local` 文件：

```env
# AI服务API密钥
OPENAI_API_KEY=your_openai_api_key
STABILITY_API_KEY=your_stability_api_key
REPLICATE_API_TOKEN=your_replicate_api_token

# AI服务配置
AI_DEFAULT_SERVICE=stability
AI_FALLBACK_ENABLED=true
```

### 2. API调用示例

```typescript
// 使用Stability AI生成图像
const response = await fetch('/api/generate/image', {
  method: 'POST',
  body: formData
});

// 请求参数
const formData = new FormData();
formData.append('prompt', 'anime figure, 3d model, high quality');
formData.append('service', 'stability');
formData.append('options', JSON.stringify({
  style: 'anime',
  quality: 'high',
  size: '1024x1024'
}));
```

### 3. 响应格式

```json
{
  "id": "unique_id",
  "url": "generated_image_url",
  "thumbnailUrl": "thumbnail_url",
  "name": "generated_image",
  "size": 0,
  "type": "image/png",
  "service": "stability",
  "prompt": "anime figure, 3d model, high quality",
  "options": {},
  "createdAt": "2024-12-19T10:30:00.000Z"
}
```

## 服务选择建议

### 手办生成推荐配置

**Stability AI + ControlNet**：
```typescript
const config = {
  model: "sd-xl-1024-v1-0",
  style_preset: "3d-model",
  steps: 30,
  cfg_scale: 7,
  width: 1024,
  height: 1024
}
```

**提示词模板**：
```
anime figure, 3d model, high quality, detailed, 
{character_description}, {pose_description}, 
{style_description}, professional lighting
```

### 成本优化策略

1. **开发阶段**：使用Stability AI（成本低）
2. **生产环境**：根据需求选择，Stability AI + OpenAI组合
3. **批量生成**：使用Replicate（按需付费）

## 错误处理

### 1. API Key未配置
```typescript
if (!AI_SERVICES.stability.apiKey) {
  throw new Error("Stability API key not configured");
}
```

### 2. 服务降级
```typescript
try {
  // 尝试主要服务
  imageUrl = await generateWithStability(prompt, options);
} catch (aiError) {
  console.error("AI service error:", aiError);
  // 降级到占位图
  imageUrl = `https://picsum.photos/seed/${Date.now()}/512/512`;
}
```

### 3. 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 401 | API Key无效 | 检查API Key是否正确 |
| 429 | 请求频率限制 | 实现重试机制 |
| 500 | 服务内部错误 | 降级到备用服务 |

## 性能优化

### 1. 缓存策略
```typescript
// 使用Redis缓存生成结果
const cacheKey = `ai_generate_${hash(prompt + options)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### 2. 异步处理
```typescript
// 对于长时间生成任务，使用队列
const job = await queue.add('generate-image', {
  prompt,
  options,
  service
});
```

### 3. 并发控制
```typescript
// 限制并发请求数量
const semaphore = new Semaphore(5);
await semaphore.acquire();
try {
  const result = await generateImage(prompt);
} finally {
  semaphore.release();
}
```

## 监控和日志

### 1. 生成统计
```typescript
// 记录生成统计
await logGeneration({
  service,
  prompt,
  duration: Date.now() - startTime,
  success: true,
  cost: estimatedCost
});
```

### 2. 错误监控
```typescript
// 使用Sentry等工具监控错误
Sentry.captureException(error, {
  tags: {
    service: 'ai-generation',
    provider: service
  }
});
```

## 安全考虑

### 1. API Key保护
- 使用环境变量存储API Key
- 定期轮换API Key
- 监控API使用情况

### 2. 内容过滤
```typescript
// 实现内容过滤
const isAppropriate = await contentFilter.check(prompt);
if (!isAppropriate) {
  throw new Error("Content not appropriate");
}
```

### 3. 速率限制
```typescript
// 实现用户级别的速率限制
const userLimit = await rateLimiter.check(userId);
if (!userLimit.allowed) {
  throw new Error("Rate limit exceeded");
}
```

## 扩展服务

### 1. 添加新的AI服务

```typescript
// 在AI_SERVICES中添加新服务
const AI_SERVICES = {
  // ... 现有服务
  newService: {
    apiKey: process.env.NEW_SERVICE_API_KEY,
    baseUrl: "https://api.newservice.com/v1",
  },
};

// 实现生成函数
async function generateWithNewService(prompt: string, options: any) {
  // 实现逻辑
}
```

### 2. 自定义模型

```typescript
// 使用Replicate托管自定义模型
const customModel = {
  version: "your-model-version-id",
  input: {
    prompt: prompt,
    // 自定义参数
  }
};
```

## 总结

通过集成多个AI服务商，Nano Banana项目具备了：

1. **高可用性**：多服务降级机制
2. **成本优化**：根据需求选择合适服务
3. **质量保证**：多种模型选择
4. **扩展性**：易于添加新服务

建议在生产环境中：
- 优先使用Stability AI（性价比高）
- OpenAI作为高质量备选
- Replicate用于特殊需求
- 实现完善的监控和错误处理

