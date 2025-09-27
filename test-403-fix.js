#!/usr/bin/env node

const http = require('http');

function testPageLoad(url, description) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const hasError = data.includes('403') || data.includes('Forbidden') || data.includes('frame_ant.js');
        const hasLoginForm = data.includes('智能登录') || data.includes('测试账户');
        
        console.log(`📄 ${description}:`);
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   登录表单: ${hasLoginForm ? '✅ 显示' : '❌ 未显示'}`);
        console.log(`   403错误: ${hasError ? '❌ 有错误' : '✅ 无错误'}`);
        
        resolve({
          success: res.statusCode === 200 && !hasError,
          hasLoginForm: hasLoginForm,
          hasError: hasError
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

async function test403Fix() {
  console.log('🧪 测试 403 Forbidden 错误修复');
  console.log('============================\n');
  
  // 测试登录页面
  const loginResult = await testPageLoad('http://localhost:3000/login', '登录页面');
  
  // 测试主页
  const homeResult = await testPageLoad('http://localhost:3000/', '主页');
  
  console.log('\n📋 测试结果总结:');
  console.log(`登录页面: ${loginResult.success ? '✅ 正常' : '❌ 有问题'}`);
  console.log(`主页: ${homeResult.success ? '✅ 正常' : '❌ 有问题'}`);
  
  if (loginResult.success && homeResult.success) {
    console.log('\n🎉 403 错误已修复！');
    console.log('\n📝 修复内容:');
    console.log('• 修复了 Supabase 客户端配置');
    console.log('• 简化了初始化过程，避免未登录时调用 API');
    console.log('• 添加了正确的认证配置');
    
    console.log('\n🌐 现在可以正常使用登录功能:');
    console.log('1. 访问 http://localhost:3000/login');
    console.log('2. 使用测试账户登录');
    console.log('3. 应该不再有 403 错误');
  } else {
    console.log('\n❌ 仍有问题需要进一步调试');
    
    if (loginResult.hasError) {
      console.log('\n🔍 登录页面问题:');
      console.log('• 可能仍有 403 错误');
      console.log('• 需要检查浏览器控制台');
    }
    
    if (homeResult.hasError) {
      console.log('\n🔍 主页问题:');
      console.log('• 可能仍有 403 错误');
      console.log('• 需要检查浏览器控制台');
    }
  }
}

test403Fix();
