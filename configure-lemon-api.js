#!/usr/bin/env node

/**
 * Lemon Squeezy API 快速配置脚本
 * 使用提供的 API 密钥配置环境变量
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🔧 配置 Lemon Squeezy API 密钥...\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // 读取现有环境变量
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // 添加 Lemon Squeezy API 配置
  const lemonConfig = `
# Lemon Squeezy API 配置
LEMON_SQUEEZY_API_KEY=nanonana
LEMON_SQUEEZY_JWT_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI0MjAwMTU0NDM4MTMyNzI4ZjMzNDhlMzdiMGFmNzQzYThlZjg4NzRmMDcwNmEzYmVmNWMyMzhkN2Q2YTg5ODY5MzNiMGNlOTdiODUzNWMwMyIsImlhdCI6MTc1OTQyMTk4MS45MDczMzYsIm5iZiI6MTc1OTQyMTk4MS45MDczMzksImV4cCI6MjA3NDk1NDc4MS44OTI3MTQsInN1YiI6IjU2MDk2MDYiLCJzY29wZXMiOltdfQ.cMF8s7UuWae8PC6225XHgIkZZ4hqTaqbRvvcjoArex82jGniLioqh90PBeATahxih1UmXXz9zNuKDvXIYKoOLmKGqLMGUvJw8EoWK2aND5GUivZu23unc67zoxq0liVWfDkbdYl1DNMKWGSJMcRD25iFYBOI3r2UYUG6CvG1rjy-nVMNLZiBVKljEw2Cg0OP-2_PahIbUkLoblIZqcTWqBATLaZzlxdGnsbe4p2-8b8RUpxSYLNGqKekwPrFwI7l5qPfzbntaP0ipQbTjhYJuVfl0tzsAgLXNkLT7TovllNwKqujqwx0iaJlyogNrUFk1RKaeLCzKX4i7JRlaLCa0w2EywhH-Odk886_xgN_eoeDNn2T7H5DiPM-V1xmvKVwhavw1na_Cth3eKQ0vYfPBIrZcQZmGRfJeOPMdQkU5oajZmCktpHhDHv39Hg1j3LEiifz3ODjGDmApEg0vdFXMurjbbo7I6vrVaG5kbcqDplT6oh2JWZhrWZRW_SZhSpPf7TvgtkmLoqJ77V8ZgEn831qsZXr5WdfP2czLvYEX2b-bOa9Izf8Hb-vprwkXXscunRDuGen0tZlDKO7CLnstnO8_lXB7GluWz8Bqwf9Ro1mtRAywuJIc49-gBZnN7mgS1dwsTTxubB7Q5GJiOOhL4FlqZWIE-gKgNdSM9cBKaw

# Lemon Squeezy 商店配置
NEXT_PUBLIC_LEMON_STORE=226270
NEXT_PUBLIC_LEMON_CHECKOUT_URL=https://store.lemonsqueezy.com/checkout/buy/your-variant-id
LEMON_WEBHOOK_SECRET=your-webhook-secret
LEMON_SUCCESS_URL=http://localhost:3000/payment/success
LEMON_CANCEL_URL=http://localhost:3000/payment/cancel

# 支付策略配置
ENABLE_LEMON_SQUEEZY=true
ENABLE_ALIPAY=false
ENABLE_WECHAT=false
ENABLE_YEEPAY=false

# 计费策略（1 美元=多少积分）
CREDITS_PER_UNIT=100
`;

  // 移除旧的 Lemon Squeezy 配置
  envContent = envContent.replace(/# Lemon Squeezy.*?(?=\n# [A-Z]|\n$|$)/gs, '');
  envContent = envContent.replace(/# Lemon Squeezy API.*?(?=\n# [A-Z]|\n$|$)/gs, '');
  envContent = envContent.replace(/# 支付策略配置.*?(?=\n# [A-Z]|\n$|$)/gs, '');
  envContent = envContent.replace(/# 计费策略.*?(?=\n# [A-Z]|\n$|$)/gs, '');
  
  // 添加新配置
  envContent += lemonConfig;
  
  // 写入文件
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ 环境变量已更新到 .env.local');
  console.log('📋 已配置的 Lemon Squeezy API 密钥:');
  console.log('   - API Key: nanonana');
  console.log('   - JWT Token: [已配置]');
  console.log('   - 支付策略: 启用 Lemon Squeezy');
  
  console.log('\n🧪 测试步骤：');
  console.log('1. 重启开发服务器: npm run dev');
  console.log('2. 访问测试页面: http://localhost:3000/lemon-test');
  console.log('3. 检查 API 连接状态');
  console.log('4. 测试支付流程');
  
  console.log('\n📚 下一步：');
  console.log('- 在 Lemon Squeezy Dashboard 中创建产品和变体');
  console.log('- 获取 Hosted Checkout 链接');
  console.log('- 配置 Webhook 回调');
  console.log('- 设置 Payoneer 收款');
  
  console.log('\n🎉 配置完成！现在可以使用 Lemon Squeezy API 了！');
}

main();
