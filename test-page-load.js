#!/usr/bin/env node

const http = require('http');

function testPageLoad() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/login', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const hasTitle = data.includes('Nano Banana');
        const hasSmartAuth = data.includes('SmartAuthProvider') || data.includes('智能登录');
        const hasError = data.includes('Error') || data.includes('error');
        
        console.log('🔍 页面加载测试结果:');
        console.log('状态码:', res.statusCode);
        console.log('页面标题:', hasTitle ? '✅ 正常' : '❌ 缺失');
        console.log('智能认证:', hasSmartAuth ? '✅ 正常' : '❌ 缺失');
        console.log('错误信息:', hasError ? '❌ 有错误' : '✅ 无错误');
        console.log('响应大小:', data.length, 'bytes');
        
        if (res.statusCode === 200 && hasTitle && !hasError) {
          console.log('\n✅ 页面加载正常！');
          resolve(true);
        } else {
          console.log('\n❌ 页面加载有问题');
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ 请求失败:', err.message);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ 请求超时');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

testPageLoad().then(success => {
  if (success) {
    console.log('\n🎉 现在可以访问 http://localhost:3000/login 测试登录功能');
    console.log('\n📝 测试用户信息:');
    console.log('邮箱: tset123qq@example.com');
    console.log('密码: 123123');
  } else {
    console.log('\n💡 请检查开发服务器状态');
  }
}).catch(err => {
  console.log('\n❌ 测试失败:', err.message);
});
