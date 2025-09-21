#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# AI API 配置
STABILITY_API_KEY=your_stability_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
GRSAI_API_KEY=sk-5f1e0d1f16984f3e86704bbb532357f9
GRSAI_USER_ID=1758354953
GRSAI_USERNAME=bnana

# 默认AI服务
AI_DEFAULT_SERVICE=grsai
AI_FALLBACK_ENABLED=true

# AdSense 配置 (开发环境禁用)
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 数据库配置 (可选)
DATABASE_URL=postgresql://username:password@localhost:5432/nanobanana

# 日志配置
LOG_LEVEL=info
ENABLE_API_LOGGING=true
ENABLE_ANOMALY_DETECTION=false

# 安全配置
JWT_SECRET=your_jwt_secret_here
API_KEYS=your_api_keys_here
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
`;

const envPath = path.join(__dirname, '.env.local');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ 已创建 .env.local 文件');
    console.log('📝 请编辑 .env.local 文件，配置你的 API 密钥');
  } else {
    console.log('⚠️  .env.local 文件已存在，跳过创建');
  }
} catch (error) {
  console.error('❌ 创建 .env.local 文件失败:', error.message);
  process.exit(1);
}

console.log('\n🔧 环境变量配置说明:');
console.log('1. GRSAI_API_KEY: 你的 Grsai API 密钥 (已预填)');
console.log('2. STABILITY_API_KEY: Stability AI API 密钥');
console.log('3. OPENAI_API_KEY: OpenAI API 密钥');
console.log('4. REPLICATE_API_TOKEN: Replicate API 令牌');
console.log('5. NEXT_PUBLIC_ADSENSE_ENABLED: 是否启用广告 (开发环境建议 false)');
console.log('\n🚀 配置完成后运行: npm run dev');

