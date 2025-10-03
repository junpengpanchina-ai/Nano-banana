#!/usr/bin/env node

/**
 * 更新 Lemon Squeezy Hosted Checkout URL
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🔗 更新 Lemon Squeezy Hosted Checkout URL...\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // 读取现有环境变量
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // 更新 Hosted Checkout URL
  envContent = envContent.replace(
    /NEXT_PUBLIC_LEMON_CHECKOUT_URL=.*/,
    'NEXT_PUBLIC_LEMON_CHECKOUT_URL=https://store.lemonsqueezy.com/checkout/buy/1018972'
  );
  
  // 写入文件
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Hosted Checkout URL 已更新');
  console.log('🔗 新的 Checkout URL: https://store.lemonsqueezy.com/checkout/buy/1018972');
  
  console.log('\n📋 可用的产品变体:');
  console.log('1. $9.99 - 999 积分 (变体ID: 1018972)');
  console.log('2. $59.99 - 5999 积分 (变体ID: 1018982)');
  console.log('3. $9.99 - 999 积分 (变体ID: 1019027)');
  
  console.log('\n🧪 测试步骤:');
  console.log('1. 重启开发服务器: npm run dev');
  console.log('2. 访问测试页面: http://localhost:3000/lemon-test');
  console.log('3. 点击"立即购买"测试支付流程');
  
  console.log('\n🎉 配置完成！现在可以测试真实的支付流程了！');
}

main();
