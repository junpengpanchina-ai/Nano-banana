#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 AI API密钥配置助手');
console.log('================================');

// 检查是否已存在.env.local
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ 发现现有 .env.local 文件');
  const existingContent = fs.readFileSync(envPath, 'utf8');
  console.log('当前内容:');
  console.log(existingContent);
  console.log('\n');
}

console.log('📋 要启用真正的图片到图片生成，您需要配置以下API密钥之一：');
console.log('');
console.log('1. Stability AI (推荐)');
console.log('   - 访问: https://platform.stability.ai/');
console.log('   - 注册账号并获取API密钥');
console.log('   - 设置: STABILITY_API_KEY=sk-...');
console.log('');
console.log('2. OpenAI DALL-E');
console.log('   - 访问: https://platform.openai.com/');
console.log('   - 注册账号并获取API密钥');
console.log('   - 设置: OPENAI_API_KEY=sk-...');
console.log('');
console.log('3. Replicate');
console.log('   - 访问: https://replicate.com/');
console.log('   - 注册账号并获取API令牌');
console.log('   - 设置: REPLICATE_API_TOKEN=r8_...');
console.log('');

console.log('💡 配置步骤：');
console.log('1. 选择上述服务之一并注册账号');
console.log('2. 获取API密钥');
console.log('3. 创建 .env.local 文件并添加密钥');
console.log('4. 重启开发服务器');
console.log('');

console.log('📝 示例 .env.local 文件内容：');
console.log('STABILITY_API_KEY=sk-your-actual-key-here');
console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
console.log('NEXT_PUBLIC_APP_NAME=Nano Banana');
console.log('');

if (!envExists) {
  console.log('🔨 是否要创建示例 .env.local 文件？(y/n)');
  // 这里可以添加交互式输入，但为了简化，我们直接创建示例文件
  const exampleContent = `# AI服务配置 - 请替换为您的真实API密钥
STABILITY_API_KEY=your_stability_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nano Banana

# 其他可选配置
GRSAI_API_KEY=your_grsai_api_key_here
GRSAI_USER_ID=your_grsai_user_id_here
GRSAI_USERNAME=your_grsai_username_here
`;

  try {
    fs.writeFileSync(envPath, exampleContent);
    console.log('✅ 已创建示例 .env.local 文件');
    console.log('📝 请编辑 .env.local 文件并添加您的真实API密钥');
  } catch (error) {
    console.error('❌ 创建文件失败:', error.message);
  }
}

console.log('');
console.log('🚀 配置完成后，重启开发服务器：');
console.log('npm run dev');
console.log('');
console.log('🎯 然后您就可以上传美女图片并生成真正相关的手办模型了！');


