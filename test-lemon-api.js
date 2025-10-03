#!/usr/bin/env node

/**
 * Lemon Squeezy API 连接测试脚本
 */

// 使用 Node.js 内置的 fetch (Node 18+)

const API_KEY = 'nanonana';
const JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI0MjAwMTU0NDM4MTMyNzI4ZjMzNDhlMzdiMGFmNzQzYThlZjg4NzRmMDcwNmEzYmVmNWMyMzhkN2Q2YTg5ODY5MzNiMGNlOTdiODUzNWMwMyIsImlhdCI6MTc1OTQyMTk4MS45MDczMzYsIm5iZiI6MTc1OTQyMTk4MS45MDczMzksImV4cCI6MjA3NDk1NDc4MS44OTI3MTQsInN1YiI6IjU2MDk2MDYiLCJzY29wZXMiOltdfQ.cMF8s7UuWae8PC6225XHgIkZZ4hqTaqbRvvcjoArex82jGniLioqh90PBeATahxih1UmXXz9zNuKDvXIYKoOLmKGqLMGUvJw8EoWK2aND5GUivZu23unc67zoxq0liVWfDkbdYl1DNMKWGSJMcRD25iFYBOI3r2UYUG6CvG1rjy-nVMNLZiBVKljEw2Cg0OP-2_PahIbUkLoblIZqcTWqBATLaZzlxdGnsbe4p2-8b8RUpxSYLNGqKekwPrFwI7l5qPfzbntaP0ipQbTjhYJuVfl0tzsAgLXNkLT7TovllNwKqujqwx0iaJlyogNrUFk1RKaeLCzKX4i7JRlaLCa0w2EywhH-Odk886_xgN_eoeDNn2T7H5DiPM-V1xmvKVwhavw1na_Cth3eKQ0vYfPBIrZcQZmGRfJeOPMdQkU5oajZmCktpHhDHv39Hg1j3LEiifz3ODjGDmApEg0vdFXMurjbbo7I6vrVaG5kbcqDplT6oh2JWZhrWZRW_SZhSpPf7TvgtkmLoqJ77V8ZgEn831qsZXr5WdfP2czLvYEX2b-bOa9Izf8Hb-vprwkXXscunRDuGen0tZlDKO7CLnstnO8_lXB7GluWz8Bqwf9Ro1mtRAywuJIc49-gBZnN7mgS1dwsTTxubB7Q5GJiOOhL4FlqZWIE-gKgNdSM9cBKaw';

async function testLemonSqueezyAPI() {
  console.log('🧪 测试 Lemon Squeezy API 连接...\n');
  
  try {
    // 测试获取用户信息
    console.log('1. 测试用户信息 API...');
    const userResponse = await fetch('https://api.lemonsqueezy.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ 用户信息 API 连接成功');
      console.log(`   用户 ID: ${userData.data.id}`);
      console.log(`   用户邮箱: ${userData.data.attributes.email}`);
    } else {
      console.log(`❌ 用户信息 API 连接失败: ${userResponse.status}`);
    }
    
    // 测试获取商店列表
    console.log('\n2. 测试商店列表 API...');
    const storesResponse = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });
    
    if (storesResponse.ok) {
      const storesData = await storesResponse.json();
      console.log('✅ 商店列表 API 连接成功');
      console.log(`   商店数量: ${storesData.data.length}`);
      
      if (storesData.data.length > 0) {
        const store = storesData.data[0];
        console.log(`   第一个商店: ${store.attributes.name} (${store.id})`);
      }
    } else {
      console.log(`❌ 商店列表 API 连接失败: ${storesResponse.status}`);
    }
    
    // 测试获取产品变体
    console.log('\n3. 测试产品变体 API...');
    const variantsResponse = await fetch('https://api.lemonsqueezy.com/v1/variants', {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });
    
    if (variantsResponse.ok) {
      const variantsData = await variantsResponse.json();
      console.log('✅ 产品变体 API 连接成功');
      console.log(`   变体数量: ${variantsData.data.length}`);
      
      if (variantsData.data.length > 0) {
        variantsData.data.forEach((variant, index) => {
          console.log(`   变体 ${index + 1}: ${variant.attributes.name} - $${(variant.attributes.price / 100).toFixed(2)}`);
        });
      }
    } else {
      console.log(`❌ 产品变体 API 连接失败: ${variantsResponse.status}`);
    }
    
    console.log('\n🎉 API 测试完成！');
    console.log('\n📋 下一步：');
    console.log('1. 在 Lemon Squeezy Dashboard 中创建产品和变体');
    console.log('2. 获取 Hosted Checkout 链接');
    console.log('3. 配置 Webhook 回调');
    console.log('4. 测试支付流程');
    
  } catch (error) {
    console.error('❌ API 测试失败:', error.message);
  }
}

testLemonSqueezyAPI();
