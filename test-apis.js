#!/usr/bin/env node

/**
 * API 测试脚本
 * 测试所有支付相关的 API 端点
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, name) {
  try {
    console.log(`\n🧪 测试 ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name} 成功`);
      console.log(`   状态: ${response.status}`);
      console.log(`   数据: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
    } else {
      console.log(`❌ ${name} 失败`);
      console.log(`   状态: ${response.status}`);
      console.log(`   错误: ${data.error || data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ ${name} 连接失败`);
    console.log(`   错误: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 开始测试所有 API 端点...\n');
  
  // 测试基础 API
  await testAPI('/api/test', '环境测试');
  
  // 测试支付状态
  await testAPI('/api/payment/status', '支付状态');
  
  // 测试 Lemon Squeezy
  await testAPI('/api/webhooks/lemon', 'Lemon Squeezy Webhook');
  
  // 测试 Payoneer (需要配置 API 密钥)
  await testAPI('/api/payoneer/account', 'Payoneer 账户信息');
  await testAPI('/api/payoneer/transactions', 'Payoneer 交易记录');
  await testAPI('/api/payoneer/balance', 'Payoneer 账户余额');
  
  console.log('\n📋 测试完成！');
  console.log('\n💡 提示：');
  console.log('- 如果 Payoneer API 失败，请先配置 API 密钥');
  console.log('- 访问 https://developer.payoneer.com/ 获取 API 密钥');
  console.log('- 在 .env.local 中添加 PAYONEER_API_KEY 和 PAYONEER_API_SECRET');
}

main().catch(console.error);
