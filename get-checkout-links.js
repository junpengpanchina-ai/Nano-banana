#!/usr/bin/env node

/**
 * 获取 Lemon Squeezy Hosted Checkout 链接
 */

const JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI0MjAwMTU0NDM4MTMyNzI4ZjMzNDhlMzdiMGFmNzQzYThlZjg4NzRmMDcwNmEzYmVmNWMyMzhkN2Q2YTg5ODY5MzNiMGNlOTdiODUzNWMwMyIsImlhdCI6MTc1OTQyMTk4MS45MDczMzYsIm5iZiI6MTc1OTQyMTk4MS45MDczMzksImV4cCI6MjA3NDk1NDc4MS44OTI3MTQsInN1YiI6IjU2MDk2MDYiLCJzY29wZXMiOltdfQ.cMF8s7UuWae8PC6225XHgIkZZ4hqTaqbRvvcjoArex82jGniLioqh90PBeATahxih1UmXXz9zNuKDvXIYKoOLmKGqLMGUvJw8EoWK2aND5GUivZu23unc67zoxq0liVWfDkbdYl1DNMKWGSJMcRD25iFYBOI3r2UYUG6CvG1rjy-nVMNLZiBVKljEw2Cg0OP-2_PahIbUkLoblIZqcTWqBATLaZzlxdGnsbe4p2-8b8RUpxSYLNGqKekwPrFwI7l5qPfzbntaP0ipQbTjhYJuVfl0tzsAgLXNkLT7TovllNwKqujqwx0iaJlyogNrUFk1RKaeLCzKX4i7JRlaLCa0w2EywhH-Odk886_xgN_eoeDNn2T7H5DiPM-V1xmvKVwhavw1na_Cth3eKQ0vYfPBIrZcQZmGRfJeOPMdQkU5oajZmCktpHhDHv39Hg1j3LEiifz3ODjGDmApEg0vdFXMurjbbo7I6vrVaG5kbcqDplT6oh2JWZhrWZRW_SZhSpPf7TvgtkmLoqJ77V8ZgEn831qsZXr5WdfP2czLvYEX2b-bOa9Izf8Hb-vprwkXXscunRDuGen0tZlDKO7CLnstnO8_lXB7GluWz8Bqwf9Ro1mtRAywuJIc49-gBZnN7mgS1dwsTTxubB7Q5GJiOOhL4FlqZWIE-gKgNdSM9cBKaw';

async function getCheckoutLinks() {
  console.log('🔗 获取 Lemon Squeezy Hosted Checkout 链接...\n');
  
  try {
    // 获取产品变体
    const variantsResponse = await fetch('https://api.lemonsqueezy.com/v1/variants', {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });
    
    if (!variantsResponse.ok) {
      throw new Error(`API request failed: ${variantsResponse.status}`);
    }
    
    const variantsData = await variantsResponse.json();
    console.log(`✅ 找到 ${variantsData.data.length} 个产品变体\n`);
    
    // 显示每个变体的信息
    variantsData.data.forEach((variant, index) => {
      const price = (variant.attributes.price / 100).toFixed(2);
      const credits = Math.floor(parseFloat(price) * 100); // 1美元=100积分
      
      console.log(`📦 变体 ${index + 1}:`);
      console.log(`   名称: ${variant.attributes.name}`);
      console.log(`   价格: $${price}`);
      console.log(`   积分: ${credits}`);
      console.log(`   变体ID: ${variant.id}`);
      console.log(`   Hosted Checkout: https://store.lemonsqueezy.com/checkout/buy/${variant.id}`);
      console.log('');
    });
    
    // 生成环境变量配置
    console.log('🔧 环境变量配置:');
    console.log('```bash');
    console.log('# 使用第一个变体作为默认 Hosted Checkout');
    console.log(`NEXT_PUBLIC_LEMON_CHECKOUT_URL=https://store.lemonsqueezy.com/checkout/buy/${variantsData.data[0].id}`);
    console.log('NEXT_PUBLIC_LEMON_STORE=226270');
    console.log('LEMON_WEBHOOK_SECRET=your-webhook-secret');
    console.log('LEMON_SUCCESS_URL=http://localhost:3000/payment/success');
    console.log('LEMON_CANCEL_URL=http://localhost:3000/payment/cancel');
    console.log('```');
    
    console.log('\n📋 下一步：');
    console.log('1. 复制上面的环境变量到 .env.local');
    console.log('2. 在 Lemon Squeezy Dashboard 中设置 Webhook');
    console.log('3. 测试支付流程');
    console.log('4. 配置 Payoneer 收款');
    
  } catch (error) {
    console.error('❌ 获取 Checkout 链接失败:', error.message);
  }
}

getCheckoutLinks();
