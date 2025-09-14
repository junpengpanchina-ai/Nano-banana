# Nano Banana - AI人物手办生成平台

基于 Next.js 14 + Tailwind CSS + shadcn/ui 构建的AI人物手办生成平台，让用户能够通过文字描述快速生成个性化的3D手办模型。

## ✨ 功能特性

- 🎨 **AI图像生成** - 基于文字描述生成高质量人物手办
- 📸 **图片上传** - 支持上传图片自动生成3D模型
- 🎯 **3D模型处理** - 上传现有3D模型进行优化和编辑
- 🎭 **多种风格** - 支持动漫、写实、卡通、Q版等多种风格
- ⚡ **快速生成** - 30秒内完成从概念到3D模型的转换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代UI** - 基于shadcn/ui的现代化界面设计

## 🚀 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式系统**: Tailwind CSS
- **UI组件**: shadcn/ui + Radix UI
- **动画库**: Framer Motion
- **3D渲染**: Three.js + React Three Fiber
- **状态管理**: React Hooks
- **类型检查**: TypeScript
- **部署平台**: Vercel

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── generate/      # AI生成API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   └── layout/           # 布局组件
└── lib/                  # 工具函数
    └── utils.ts          # 通用工具
```

## 🎨 主要页面

- **首页** (`/`) - AI生成界面和功能介绍
- **创建** (`/create`) - 高级创作工具
- **提示词** (`/prompts`) - 提示词库和模板
- **定价** (`/pricing`) - 订阅方案和价格
- **我的作品** (`/my-images`) - 用户作品管理
- **API** (`/api`) - API文档和集成

## 🔧 环境变量

创建 `.env.local` 文件并添加以下变量：

```env
# AI服务API密钥
OPENAI_API_KEY=your_openai_api_key
STABILITY_API_KEY=your_stability_api_key

# 数据库连接
DATABASE_URL=your_database_url

# 其他配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署完成

### Vercel配置

项目已包含 `vercel.json` 配置文件，支持：
- 自动构建和部署
- 环境变量管理
- API路由配置
- CORS头设置

## 📱 响应式设计

- **桌面端**: 完整功能界面，双栏布局
- **平板端**: 适配中等屏幕尺寸
- **移动端**: 单栏布局，触摸友好

## 🎯 开发计划

### 第一阶段 (MVP)
- [x] 基础UI界面
- [x] 文字描述生成
- [x] 基础3D预览
- [x] 响应式设计

### 第二阶段 (功能完善)
- [ ] 图片上传生成
- [ ] 3D编辑器
- [ ] 用户系统
- [ ] 作品管理

### 第三阶段 (商业化)
- [ ] 支付系统
- [ ] 订阅管理
- [ ] 高级功能
- [ ] API开放

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目链接: [https://github.com/your-username/nano-banana](https://github.com/your-username/nano-banana)
- 问题反馈: [Issues](https://github.com/your-username/nano-banana/issues)

---

**Nano Banana** - 让AI为你的创意插上翅膀 🚀