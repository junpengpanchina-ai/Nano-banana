#!/usr/bin/env node

/**
 * Lemon Squeezy 快速设置脚本
 * 帮助用户快速配置 Lemon Squeezy 支付系统
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🌍 Lemon Squeezy 全球支付设置向导\n');
  
  console.log('📋 请按照以下步骤获取配置信息：');
  console.log('1. 访问 https://www.lemonsqueezy.com/ 注册账户');
  console.log('2. 创建商店和产品');
  console.log('3. 获取 Hosted Checkout 链接');
  console.log('4. 设置 Webhook 回调\n');
  
  const checkoutUrl = await question('请输入 Hosted Checkout URL: ');
  const storeId = await question('请输入 Store ID: ');
  const webhookSecret = await question('请输入 Webhook Secret: ');
  const domain = await question('请输入你的域名 (例如: your-domain.com): ');
  
  // 生成环境变量配置
  const envConfig = `
# Lemon Squeezy 全球支付配置
NEXT_PUBLIC_LEMON_CHECKOUT_URL=${checkoutUrl}
NEXT_PUBLIC_LEMON_STORE=${storeId}
LEMON_WEBHOOK_SECRET=${webhookSecret}
LEMON_SUCCESS_URL=https://${domain}/payment/success
LEMON_CANCEL_URL=https://${domain}/payment/cancel

# 支付策略配置
ENABLE_LEMON_SQUEEZY=true
ENABLE_ALIPAY=false
ENABLE_WECHAT=false
ENABLE_YEEPAY=false
`;

  // 更新 .env.local 文件
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // 移除旧的 Lemon Squeezy 配置
  envContent = envContent.replace(/# Lemon Squeezy.*?(?=\n# [A-Z]|\n$|$)/gs, '');
  
  // 添加新配置
  envContent += envConfig;
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ 环境变量已更新到 .env.local');
  
  // 生成 Webhook 配置说明
  const webhookUrl = `https://${domain}/api/webhooks/lemon`;
  
  console.log('\n🔧 Webhook 配置说明：');
  console.log(`1. 登录 Lemon Squeezy Dashboard`);
  console.log(`2. 进入 Settings → Developer → Webhooks`);
  console.log(`3. 添加 Webhook URL: ${webhookUrl}`);
  console.log(`4. 选择事件: order_created, subscription_payment_success`);
  console.log(`5. 保存并复制 Signing Secret`);
  
  console.log('\n🧪 测试步骤：');
  console.log('1. 重启开发服务器: npm run dev');
  console.log('2. 访问测试页面: http://localhost:3000/lemon-test');
  console.log('3. 点击"立即购买"测试支付流程');
  console.log('4. 检查 Webhook 是否正常接收');
  
  console.log('\n📚 更多信息：');
  console.log('- 详细设置指南: LEMON_SQUEEZY_SETUP_GUIDE.md');
  console.log('- Payoneer 设置: PAYONEER_SETUP_GUIDE.md');
  console.log('- 测试页面: http://localhost:3000/lemon-test');
  
  console.log('\n🎉 配置完成！现在可以开始接收全球用户的付款了！');
  
  rl.close();
}

main().catch(console.error);
