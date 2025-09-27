#!/usr/bin/env node

const http = require('http');

function testUserState() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/login', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const hasUserState = data.includes('已登录成功') || data.includes('欢迎回来');
        const hasLoginForm = data.includes('智能登录') || data.includes('测试账户');
        
        console.log('🔍 用户状态测试结果:');
        console.log('状态码:', res.statusCode);
        console.log('登录表单:', hasLoginForm ? '✅ 显示' : '❌ 未显示');
        console.log('用户状态:', hasUserState ? '✅ 已登录' : '❌ 未登录');
        
        if (res.statusCode === 200) {
          resolve({
            success: true,
            hasLoginForm: hasLoginForm,
            hasUserState: hasUserState
          });
        } else {
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ 请求失败:', err.message);
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ 请求超时');
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTest() {
  console.log('🧪 测试用户登录状态显示');
  console.log('========================\n');
  
  const result = await testUserState();
  
  if (result.success) {
    console.log('\n📋 测试结果:');
    if (result.hasUserState) {
      console.log('✅ 用户已登录，显示登录状态页面');
    } else if (result.hasLoginForm) {
      console.log('✅ 用户未登录，显示登录表单');
      console.log('\n📝 下一步测试:');
      console.log('1. 访问 http://localhost:3000/login');
      console.log('2. 使用测试账户登录:');
      console.log('   邮箱: tset123qq@example.com');
      console.log('   密码: 123123');
      console.log('3. 登录成功后应该显示用户状态');
      console.log('4. 导航栏应该显示用户信息和积分');
    } else {
      console.log('❌ 页面显示异常');
    }
  } else {
    console.log('\n❌ 测试失败');
  }
}

runTest();
