# Supabase 设置指南

## 🚀 快速开始

### 1. 创建Supabase项目

1. 访问 [Supabase官网](https://supabase.com)
2. 点击 "Start your project" 注册账户
3. 创建新项目：
   - **项目名称**: `nano-banana`
   - **数据库密码**: 设置一个强密码
   - **地区**: 选择离你最近的地区

### 2. 获取项目配置

在项目仪表板中，找到以下信息：

1. **项目URL**: `https://your-project-id.supabase.co`
2. **API密钥**: 在 Settings > API 中找到 `anon public` 密钥

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. 初始化数据库

1. 在Supabase仪表板中，进入 **SQL Editor**
2. 复制 `supabase-setup.sql` 文件的内容
3. 粘贴到SQL编辑器中并运行

### 5. 配置认证

1. 在Supabase仪表板中，进入 **Authentication > Settings**
2. 配置以下设置：
   - **Site URL**: `http://localhost:3000` (开发环境)
   - **Redirect URLs**: `http://localhost:3000/**`
   - **Email Auth**: 启用邮箱认证

### 6. 测试连接

运行开发服务器：

```bash
npm run dev
```

访问 `http://localhost:3000/login` 测试登录功能。

## 📊 数据库结构

### users 表
- `id`: 用户唯一标识
- `email`: 用户邮箱
- `name`: 用户姓名
- `credits`: 用户积分
- `avatar_url`: 头像URL
- `created_at`: 创建时间
- `updated_at`: 更新时间

### generations 表
- `id`: 生成记录唯一标识
- `user_id`: 关联用户ID
- `prompt`: 生成提示词
- `style`: 风格类型
- `pose`: 姿势类型
- `result_url`: 结果图片URL
- `status`: 生成状态
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 🔒 安全策略

- 用户只能访问自己的数据
- 行级安全策略已启用
- API密钥保护

## 🚀 部署到生产环境

1. 更新环境变量中的Supabase URL
2. 在Supabase中更新Site URL为生产域名
3. 配置生产环境的Redirect URLs

## 📝 常用操作

### 查看用户数据
```sql
SELECT * FROM users;
```

### 查看生成记录
```sql
SELECT * FROM generations ORDER BY created_at DESC;
```

### 更新用户积分
```sql
UPDATE users SET credits = 100 WHERE email = 'user@example.com';
```

## 🆘 故障排除

### 常见问题

1. **认证失败**: 检查环境变量是否正确
2. **数据库连接失败**: 确认Supabase项目状态
3. **权限错误**: 检查行级安全策略

### 获取帮助

- [Supabase文档](https://supabase.com/docs)
- [Supabase社区](https://github.com/supabase/supabase/discussions)








