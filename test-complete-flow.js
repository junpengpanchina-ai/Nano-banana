#!/usr/bin/env node

const http = require('http');

function testPage(url, description) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const hasError = data.includes('useAuth must be used within an AuthProvider') || 
                        data.includes('Error') || 
                        data.includes('error');
        
        console.log(`📄 ${description}:`);
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   错误: ${hasError ? '❌ 有错误' : '✅ 无错误'}`);
        console.log(`   大小: ${data.length} bytes`);
        
        resolve({
          success: res.statusCode === 200 && !hasError,
          hasError,
          data
        });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description} 请求失败:`, err.message);
      resolve({ success: false, hasError: true, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${description} 请求超时`);
      req.destroy();
      resolve({ success: false, hasError: true, error: 'Timeout' });
    });
  });
}

async function testCompleteFlow() {
  console.log('🧪 测试完整登录流程');
  console.log('==================\n');
  
  // 测试登录页面
  const loginResult = await testPage('http://localhost:3000/login', '登录页面');
  
  // 测试主页
  const homeResult = await testPage('http://localhost:3000/', '主页');
  
  console.log('\n📋 测试结果总结:');
  console.log(`登录页面: ${loginResult.success ? '✅ 正常' : '❌ 有问题'}`);
  console.log(`主页: ${homeResult.success ? '✅ 正常' : '❌ 有问题'}`);
  
  if (loginResult.success && homeResult.success) {
    console.log('\n🎉 所有测试通过！');
    console.log('\n📝 使用说明:');
    console.log('1. 访问 http://localhost:3000/login');
    console.log('2. 使用测试账户登录:');
    console.log('   邮箱: tset123qq@example.com');
    console.log('   密码: 123123');
    console.log('3. 登录成功后会自动跳转到主页');
    console.log('4. 主页应该正常显示，没有 useAuth 错误');
  } else {
    console.log('\n❌ 发现问题，需要进一步调试');
    
    if (homeResult.hasError) {
      console.log('\n🔍 主页错误详情:');
      if (homeResult.data.includes('useAuth must be used within an AuthProvider')) {
        console.log('   - 仍有组件使用旧的 useAuth');
      }
      if (homeResult.data.includes('Error')) {
        console.log('   - 存在其他运行时错误');
      }
    }
  }
}

testCompleteFlow();
