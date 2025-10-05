# 环境变量配置指南

## 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件，并添加以下内容：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 其他现有配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nano Banana

# API安全配置
MASTER_API_KEY=demo-master-key-12345
ADMIN_KEY=demo-admin-key-12345

# 安全配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
ENABLE_API_LOGGING=true
MAX_REQUEST_SIZE=10485760
```

## 获取Supabase配置信息

1. 访问你的Supabase项目仪表板
2. 进入 Settings > API
3. 复制以下信息：
   - **Project URL**: 替换 `your_supabase_project_url_here`
   - **anon public key**: 替换 `your_supabase_anon_key_here`

## 示例配置

```bash
# 示例（请替换为你的实际值）
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MDAwMCwiZXhwIjoyMDE0MzM2MDAwfQ.example_key_here
```














