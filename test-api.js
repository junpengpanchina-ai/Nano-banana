// 测试API安全保护
const testApiSecurity = async () => {
  console.log('🔒 测试API安全保护...\n');

  // 1. 测试无认证请求
  console.log('1. 测试无认证请求...');
  try {
    const response = await fetch('http://localhost:3000/api/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'test prompt'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ 无认证请求被正确拒绝');
    } else {
      console.log('❌ 无认证请求未被拒绝');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  // 2. 测试无效API密钥
  console.log('\n2. 测试无效API密钥...');
  try {
    const response = await fetch('http://localhost:3000/api/generate/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'test prompt'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ 无效API密钥被正确拒绝');
    } else {
      console.log('❌ 无效API密钥未被拒绝');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  // 3. 测试生成API密钥
  console.log('\n3. 测试生成API密钥...');
  try {
    const response = await fetch('http://localhost:3000/api/admin/generate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'demo-admin-key'
      },
      body: JSON.stringify({
        userId: 'test-user',
        maxRequests: 100
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API密钥生成成功:', data.apiKey.substring(0, 8) + '...');
      
      // 4. 测试有效API密钥
      console.log('\n4. 测试有效API密钥...');
      const testResponse = await fetch('http://localhost:3000/api/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.apiKey}`,
        },
        body: new FormData()
      });
      
      if (testResponse.status === 400) {
        console.log('✅ 有效API密钥通过认证（缺少必要参数）');
      } else {
        console.log('❌ 有效API密钥认证失败');
      }
    } else {
      console.log('❌ API密钥生成失败');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  console.log('\n🎉 API安全测试完成！');
};

// 运行测试
testApiSecurity().catch(console.error);
