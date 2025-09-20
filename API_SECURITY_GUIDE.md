# API 安全保护指南

## 🔒 已实施的安全措施

### 1. API密钥认证
- **Bearer Token认证**: 所有API请求必须包含有效的Bearer Token
- **动态密钥生成**: 支持为不同用户生成独立的API密钥
- **密钥轮换**: 支持定期更换API密钥

### 2. 频率限制
- **IP限制**: 每个IP地址15分钟内最多50次请求
- **用户限制**: 每个用户1小时内最多100次请求
- **突发限制**: 1分钟内最多10次突发请求
- **自动封禁**: 超限用户/IP自动封禁1-2小时

### 3. 输入验证
- **服务白名单**: 只允许预定义的服务类型
- **长度限制**: 提示词最大1000字符，描述最大500字符
- **格式验证**: 严格验证所有输入参数

### 4. 错误处理
- **信息隐藏**: 不暴露内部错误详情
- **错误ID**: 为每个错误生成唯一ID便于追踪
- **统一响应**: 标准化的错误响应格式

### 5. 日志监控
- **完整记录**: 记录所有API调用详情
- **性能监控**: 跟踪响应时间和错误率
- **安全审计**: 记录可疑活动

## 🚀 使用方法

### 获取API密钥
```bash
curl -X POST https://your-domain.com/api/admin/generate-key \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your_admin_key" \
  -d '{"userId": "user123", "maxRequests": 100}'
```

### 使用API
```bash
curl -X POST https://your-domain.com/api/generate/image \
  -H "Authorization: Bearer your_api_key" \
  -F "prompt=anime character" \
  -F "service=grsai"
```

### 查看日志
```bash
curl -X GET https://your-domain.com/api/admin/logs \
  -H "X-Admin-Key: your_admin_key"
```

## ⚙️ 环境配置

在 `.env.local` 文件中配置：

```env
# 主密钥（用于生成API密钥）
MASTER_API_KEY=your_very_secure_master_key_here

# 管理员密钥（用于管理操作）
ADMIN_KEY=your_admin_key_here

# 其他配置...
```

## 🛡️ 安全建议

### 1. 密钥管理
- 定期更换 `MASTER_API_KEY` 和 `ADMIN_KEY`
- 不要在代码中硬编码密钥
- 使用环境变量存储敏感信息

### 2. 监控告警
- 设置错误率告警（>5%）
- 监控异常请求模式
- 定期检查日志

### 3. 生产环境
- 使用HTTPS
- 配置防火墙规则
- 启用DDoS防护
- 考虑使用Redis存储限流数据

## 📊 监控指标

- **总请求数**: 所有API调用次数
- **错误率**: 4xx/5xx错误占比
- **平均响应时间**: API响应性能
- **状态码分布**: 各状态码的请求分布

## 🔧 故障排除

### 常见错误
1. **401 Unauthorized**: 检查API密钥是否正确
2. **429 Rate Limit Exceeded**: 请求过于频繁，等待重置
3. **400 Bad Request**: 检查请求参数格式

### 调试步骤
1. 检查API密钥是否有效
2. 确认请求格式正确
3. 查看服务器日志
4. 联系管理员获取错误ID详情

## 📈 性能优化

- 使用CDN加速
- 启用响应缓存
- 优化数据库查询
- 监控内存使用

---

**注意**: 此安全系统已全面保护你的API，防止恶意使用和费用滥用。建议定期审查日志并更新安全策略。
