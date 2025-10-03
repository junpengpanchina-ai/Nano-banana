#!/usr/bin/env node

/**
 * Payoneer 配置脚本
 * 帮助配置 Payoneer 与 Lemon Squeezy 的集成
 */

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
  console.log('🏦 Payoneer 配置向导\n');
  
  console.log('📋 请按照以下步骤获取 Payoneer 银行信息：');
  console.log('1. 登录 https://www.payoneer.com/login');
  console.log('2. 进入 "Receive" 页面');
  console.log('3. 找到 "US Bank Account" 或 "美元银行账户"');
  console.log('4. 记录银行账户信息\n');
  
  const accountNumber = await question('请输入 Payoneer 账户号码: ');
  const accountHolderName = await question('请输入账户持有人姓名: ');
  
  console.log('\n🔧 Lemon Squeezy 配置信息：');
  console.log('```');
  console.log('Bank Name: Community Federal Savings Bank');
  console.log(`Account Number: ${accountNumber}`);
  console.log('Routing Number: 021000021');
  console.log('Account Type: Checking');
  console.log(`Account Holder Name: ${accountHolderName}`);
  console.log('```');
  
  console.log('\n📋 在 Lemon Squeezy 中配置的步骤：');
  console.log('1. 登录 https://app.lemonsqueezy.com/');
  console.log('2. 进入 Settings → Payouts');
  console.log('3. 选择 "Bank Transfer"');
  console.log('4. 填写上面的银行信息');
  console.log('5. 保存配置');
  
  console.log('\n🧪 测试收款流程：');
  console.log('1. 在 Lemon Squeezy 中创建测试订单');
  console.log('2. 完成支付流程');
  console.log('3. 检查 Payoneer 账户是否收到款项');
  console.log('4. 确认金额和手续费');
  
  console.log('\n💰 Payoneer 费率信息：');
  console.log('- 提现手续费: 1.2% (最低 $1.50)');
  console.log('- 汇率: 实时汇率，比银行汇率优惠');
  console.log('- 到账时间: 1-2 个工作日');
  console.log('- 提现限额: 每日 $10,000，每月 $50,000');
  
  console.log('\n📞 技术支持：');
  console.log('- Payoneer 客服: 400-841-6666');
  console.log('- 在线客服: https://www.payoneer.com/help/');
  console.log('- 邮件支持: support@payoneer.com');
  
  console.log('\n🎉 配置完成！现在可以开始接收全球用户的付款了！');
  
  rl.close();
}

main().catch(console.error);
