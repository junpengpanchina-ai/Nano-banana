# MongoDB Atlas 设置指南

## 🚀 快速开始

### 1. 创建MongoDB Atlas账户

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 点击 "Try Free" 注册账户
3. 选择 "M0 Sandbox" 免费方案

### 2. 创建集群

1. 选择云服务商（推荐AWS）
2. 选择地区（推荐离你最近的）
3. 集群名称：`nano-banana-cluster`
4. 点击 "Create Cluster"

### 3. 配置数据库访问

1. 在 "Database Access" 中创建数据库用户：
   - 用户名：`nano-banana-user`
   - 密码：生成强密码
   - 权限：`Read and write to any database`

2. 在 "Network Access" 中添加IP地址：
   - 开发环境：`0.0.0.0/0` (允许所有IP)
   - 生产环境：添加你的服务器IP

### 4. 获取连接字符串

1. 点击 "Connect" 按钮
2. 选择 "Connect your application"
3. 复制连接字符串，格式如下：
   ```
   mongodb+srv://nano-banana-user:<password>@nano-banana-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. 配置环境变量

创建 `.env.local` 文件：

```bash
# MongoDB配置
MONGODB_URI=mongodb+srv://nano-banana-user:your_password@nano-banana-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=nano-banana

# 其他配置保持不变
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
```

### 6. 初始化数据库

运行初始化脚本：

```bash
npm run init-mongodb
```

## 📊 数据库结构

### users 集合
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  name: "用户名",
  password: "hashed_password",
  credits: 100,
  avatar_url: "https://...",
  created_at: ISODate,
  updated_at: ISODate
}
```

### generations 集合
```javascript
{
  _id: ObjectId,
  user_id: "user_id",
  prompt: "生成提示词",
  style: "风格类型",
  pose: "姿势类型",
  result_url: "https://...",
  status: "completed",
  created_at: ISODate,
  updated_at: ISODate
}
```

## 🔒 安全特性

- 数据库用户权限控制
- IP白名单访问
- 连接字符串加密
- 自动索引优化

## 🚀 部署到生产环境

1. 更新环境变量中的MongoDB URI
2. 在Network Access中添加生产服务器IP
3. 考虑升级到付费方案以获得更好性能

## 📝 常用操作

### 查看用户数据
```javascript
db.users.find().sort({created_at: -1})
```

### 查看生成记录
```javascript
db.generations.find({user_id: "user_id"}).sort({created_at: -1})
```

### 更新用户积分
```javascript
db.users.updateOne(
  {email: "user@example.com"}, 
  {$set: {credits: 100}}
)
```

## 🆘 故障排除

### 常见问题

1. **连接失败**: 检查IP白名单设置
2. **认证失败**: 验证用户名密码
3. **权限错误**: 检查数据库用户权限

### 获取帮助

- [MongoDB Atlas文档](https://docs.atlas.mongodb.com/)
- [MongoDB社区](https://community.mongodb.com/)


