#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Nano Banana AI API 快速配置\n');

// 检查 .env.local 是否存在
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 复制 env.example 到 .env.local...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ 已创建 .env.local 文件\n');
  } else {
    console.log('❌ 找不到 env.example 文件');
    process.exit(1);
  }
}

// 读取现有配置
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('请选择要配置的AI服务：\n');
console.log('1. Stability AI (推荐，性价比高)');
console.log('2. OpenAI DALL-E 3 (质量最高)');
console.log('3. Replicate (模型丰富)');
console.log('4. 配置所有服务');
console.log('5. 跳过配置\n');

rl.question('请输入选择 (1-5): ', (choice) => {
  switch (choice) {
    case '1':
      configureStability();
      break;
    case '2':
      configureOpenAI();
      break;
    case '3':
      configureReplicate();
      break;
    case '4':
      configureAll();
      break;
    case '5':
      console.log('⏭️ 跳过配置');
      rl.close();
      break;
    default:
      console.log('❌ 无效选择');
      rl.close();
  }
});

function configureStability() {
  console.log('\n🔧 配置 Stability AI');
  console.log('获取API Key: https://platform.stability.ai/');
  rl.question('请输入 Stability AI API Key: ', (apiKey) => {
    if (apiKey.trim()) {
      envContent = envContent.replace(
        /STABILITY_API_KEY=.*/,
        `STABILITY_API_KEY=${apiKey.trim()}`
      );
      envContent = envContent.replace(
        /AI_DEFAULT_SERVICE=.*/,
        'AI_DEFAULT_SERVICE=stability'
      );
      saveAndExit();
    } else {
      console.log('❌ API Key 不能为空');
      rl.close();
    }
  });
}

function configureOpenAI() {
  console.log('\n🔧 配置 OpenAI DALL-E 3');
  console.log('获取API Key: https://platform.openai.com/');
  rl.question('请输入 OpenAI API Key: ', (apiKey) => {
    if (apiKey.trim()) {
      envContent = envContent.replace(
        /OPENAI_API_KEY=.*/,
        `OPENAI_API_KEY=${apiKey.trim()}`
      );
      envContent = envContent.replace(
        /AI_DEFAULT_SERVICE=.*/,
        'AI_DEFAULT_SERVICE=openai'
      );
      saveAndExit();
    } else {
      console.log('❌ API Key 不能为空');
      rl.close();
    }
  });
}

function configureReplicate() {
  console.log('\n🔧 配置 Replicate');
  console.log('获取API Token: https://replicate.com/');
  rl.question('请输入 Replicate API Token: ', (token) => {
    if (token.trim()) {
      envContent = envContent.replace(
        /REPLICATE_API_TOKEN=.*/,
        `REPLICATE_API_TOKEN=${token.trim()}`
      );
      envContent = envContent.replace(
        /AI_DEFAULT_SERVICE=.*/,
        'AI_DEFAULT_SERVICE=replicate'
      );
      saveAndExit();
    } else {
      console.log('❌ API Token 不能为空');
      rl.close();
    }
  });
}

function configureAll() {
  console.log('\n🔧 配置所有AI服务');
  
  const configs = [
    { name: 'Stability AI', key: 'STABILITY_API_KEY', url: 'https://platform.stability.ai/' },
    { name: 'OpenAI', key: 'OPENAI_API_KEY', url: 'https://platform.openai.com/' },
    { name: 'Replicate', key: 'REPLICATE_API_TOKEN', url: 'https://replicate.com/' }
  ];
  
  let currentIndex = 0;
  
  function askNext() {
    if (currentIndex >= configs.length) {
      // 设置默认服务
      rl.question('\n请选择默认AI服务 (stability/openai/replicate): ', (defaultService) => {
        if (['stability', 'openai', 'replicate'].includes(defaultService)) {
          envContent = envContent.replace(
            /AI_DEFAULT_SERVICE=.*/,
            `AI_DEFAULT_SERVICE=${defaultService}`
          );
          saveAndExit();
        } else {
          console.log('❌ 无效的默认服务');
          rl.close();
        }
      });
      return;
    }
    
    const config = configs[currentIndex];
    console.log(`\n${config.name} - 获取API Key: ${config.url}`);
    rl.question(`请输入 ${config.name} API Key: `, (apiKey) => {
      if (apiKey.trim()) {
        envContent = envContent.replace(
          new RegExp(`${config.key}=.*`),
          `${config.key}=${apiKey.trim()}`
        );
      }
      currentIndex++;
      askNext();
    });
  }
  
  askNext();
}

function saveAndExit() {
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ 配置已保存到 .env.local');
  console.log('\n🚀 现在可以启动开发服务器:');
  console.log('npm run dev');
  console.log('\n📋 测试API:');
  console.log('http://localhost:3000/test-api.html');
  rl.close();
}


