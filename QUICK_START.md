# 🚀 快速启动指南

## 1. 环境配置

首先配置环境变量：

```bash
# 复制环境变量模板
cp env.example .env.local

# 编辑环境变量
nano .env.local
```

在 `.env.local` 中设置：

```env
# 必须配置的安全密钥
MASTER_API_KEY=your_very_secure_master_key_here
ADMIN_KEY=your_admin_key_here

# AI服务配置（至少配置一个）
GRSAI_API_KEY=your_grsai_api_key
GRSAI_USER_ID=your_grsai_user_id
GRSAI_USERNAME=your_grsai_username

# 其他可选配置
OPENAI_API_KEY=your_openai_api_key
STABILITY_API_KEY=your_stability_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

## 2. 启动应用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 3. 获取API密钥

1. 打开浏览器访问 `http://localhost:3000`
2. 在页面中找到"API密钥管理"卡片
3. 点击"获取API密钥"按钮
4. 复制生成的API密钥

## 4. 测试图片生成

1. 确保已获取API密钥
2. 在描述框中输入提示词，例如："一个可爱的动漫女孩"
3. 选择风格和姿势
4. 点击"生成手办"按钮
5. 等待生成完成

## 5. 验证安全保护

运行测试脚本验证API安全：

```bash
node test-api.js
```

应该看到：
- ✅ 无认证请求被正确拒绝
- ✅ 无效API密钥被正确拒绝  
- ✅ API密钥生成成功
- ✅ 有效API密钥通过认证

## 6. 监控API使用

访问管理接口查看API使用情况：

```bash
# 查看API日志
curl -X GET "http://localhost:3000/api/admin/logs" \
  -H "X-Admin-Key: your_admin_key"

# 查看统计信息
curl -X GET "http://localhost:3000/api/admin/logs?type=stats" \
  -H "X-Admin-Key: your_admin_key"
```

## 🔧 故障排除

### 常见问题

1. **"请先获取API密钥"错误**
   - 确保已点击"获取API密钥"按钮
   - 检查浏览器控制台是否有错误

2. **"Unauthorized"错误**
   - 检查API密钥是否正确
   - 确保环境变量配置正确

3. **"Rate limit exceeded"错误**
   - 等待频率限制重置
   - 检查是否超过每小时100次限制

4. **图片生成失败**
   - 检查AI服务API密钥配置
   - 查看服务器日志获取详细错误信息

### 调试步骤

1. 检查环境变量是否正确加载
2. 查看浏览器网络请求
3. 检查服务器控制台日志
4. 运行API测试脚本

## 📊 安全特性

- ✅ API密钥认证
- ✅ 频率限制（IP + 用户）
- ✅ 输入验证
- ✅ 错误信息隐藏
- ✅ 完整日志记录
- ✅ 自动封禁机制

现在你的API已经受到全面保护，可以安全地生成图片了！🎉
