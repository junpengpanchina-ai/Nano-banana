const puppeteer = require('puppeteer');

async function testModalImprovements() {
  console.log('🔧 测试会员弹窗改进效果...\n');

  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 访问主页
    console.log('📱 访问主页...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // 点击充值按钮
    console.log('🖱️ 点击充值按钮...');
    await page.click('button:has-text("充值")');
    await page.waitForTimeout(1000);
    
    // 检查弹窗是否出现
    const modal = await page.$('[role="dialog"]');
    if (modal) {
      console.log('✅ 会员充值弹窗已打开');
      
      // 检查弹窗样式改进
      const modalStyles = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (!modal) return null;
        
        const computedStyle = window.getComputedStyle(modal);
        return {
          maxWidth: computedStyle.maxWidth,
          backgroundColor: computedStyle.backgroundColor,
          borderWidth: computedStyle.borderWidth,
          boxShadow: computedStyle.boxShadow,
          borderRadius: computedStyle.borderRadius
        };
      });
      
      console.log('🎨 弹窗样式检查:');
      console.log(`   - 最大宽度: ${modalStyles?.maxWidth}`);
      console.log(`   - 背景色: ${modalStyles?.backgroundColor}`);
      console.log(`   - 边框宽度: ${modalStyles?.borderWidth}`);
      console.log(`   - 阴影: ${modalStyles?.boxShadow ? '有' : '无'}`);
      console.log(`   - 圆角: ${modalStyles?.borderRadius}`);
      
      // 检查套餐卡片
      const planCards = await page.$$('[data-slot="card"]');
      console.log(`📦 找到 ${planCards.length} 个套餐卡片`);
      
      // 检查推荐标签
      const popularBadge = await page.$('span:has-text("最受欢迎")');
      if (popularBadge) {
        console.log('⭐ 推荐标签存在');
      }
      
      // 检查价格显示
      const prices = await page.$$eval('div:has-text("¥")', elements => 
        elements.map(el => el.textContent)
      );
      console.log('💰 价格显示:', prices);
      
      // 检查按钮样式
      const buttons = await page.$$('button:has-text("选择此套餐")');
      console.log(`🔘 找到 ${buttons.length} 个套餐选择按钮`);
      
      // 测试点击套餐
      if (buttons.length > 0) {
        console.log('🖱️ 点击第一个套餐...');
        await buttons[0].click();
        await page.waitForTimeout(1000);
        
        // 检查是否进入支付页面
        const paymentTitle = await page.$('h3:has-text("选择支付方式")');
        if (paymentTitle) {
          console.log('✅ 成功进入支付页面');
          
          // 检查支付方式
          const paymentMethods = await page.$$('[data-slot="card"]');
          console.log(`💳 找到 ${paymentMethods.length} 种支付方式`);
          
          // 测试支付流程
          if (paymentMethods.length > 0) {
            console.log('🖱️ 点击第一个支付方式...');
            await paymentMethods[0].click();
            await page.waitForTimeout(2000);
            
            // 检查是否进入处理页面
            const processingText = await page.$('h3:has-text("正在处理支付")');
            if (processingText) {
              console.log('✅ 支付处理页面正常显示');
              
              // 等待处理完成
              await page.waitForTimeout(2000);
              
              // 检查成功页面
              const successText = await page.$('h3:has-text("支付成功")');
              if (successText) {
                console.log('🎉 支付成功页面正常显示');
              }
            }
          }
        }
      }
      
    } else {
      console.log('❌ 会员充值弹窗未打开');
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
  testModalImprovements().catch(console.error);
}

module.exports = { testModalImprovements };









