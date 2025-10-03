const puppeteer = require('puppeteer');

async function testMembershipModal() {
  console.log('🧪 测试会员充值弹窗功能...\n');

  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 访问主页
    console.log('📱 访问主页...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // 检查充值按钮是否存在
    console.log('🔍 检查导航栏充值按钮...');
    const rechargeButton = await page.$('button:has-text("充值")');
    if (rechargeButton) {
      console.log('✅ 导航栏充值按钮存在');
    } else {
      console.log('❌ 导航栏充值按钮不存在');
    }
    
    // 检查积分系统中的立即购买按钮
    console.log('🔍 检查积分系统购买按钮...');
    const buyButton = await page.$('button:has-text("立即购买")');
    if (buyButton) {
      console.log('✅ 积分系统购买按钮存在');
    } else {
      console.log('❌ 积分系统购买按钮不存在');
    }
    
    // 尝试点击充值按钮
    if (rechargeButton) {
      console.log('🖱️ 点击充值按钮...');
      await rechargeButton.click();
      await page.waitForTimeout(1000);
      
      // 检查弹窗是否出现
      const modal = await page.$('[role="dialog"]');
      if (modal) {
        console.log('✅ 会员充值弹窗已打开');
        
        // 检查套餐选项
        const plans = await page.$$('[data-testid="membership-plan"]');
        console.log(`📦 找到 ${plans.length} 个套餐选项`);
        
        // 检查支付方式
        const paymentMethods = await page.$$('[data-testid="payment-method"]');
        console.log(`💳 找到 ${paymentMethods.length} 种支付方式`);
        
      } else {
        console.log('❌ 会员充值弹窗未打开');
      }
    }
    
    console.log('\n🎉 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testMembershipModal().catch(console.error);
}

module.exports = { testMembershipModal };









