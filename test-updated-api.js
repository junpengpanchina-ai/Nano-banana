// 测试更新后的 API 路由
const testUpdatedAPI = async () => {
  console.log('🧪 测试更新后的 API 路由...');
  
  // 设置环境变量
  process.env.GRSAI_API_KEY = 'sk-bd625bca604243989a7018a67614c889';
  process.env.GRSAI_USER_ID = '1758354953';
  process.env.GRSAI_USERNAME = 'bnana';
  
  try {
    // 测试图像生成 API
    const response = await fetch('http://localhost:3000/api/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_master_key_123'
      },
      body: JSON.stringify({
        prompt: 'cute anime girl figure',
        service: 'grsai',
        options: {
          style: 'anime',
          pose: 'standing'
        }
      })
    });

    console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API 调用成功!');
      console.log('📊 响应数据:', JSON.stringify(data, null, 2));
      
      if (data.result_url || data.url) {
        console.log('🖼️ 生成的图像 URL:', data.result_url || data.url);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API 调用失败:', errorData);
    }
  } catch (error) {
    console.log('❌ 测试异常:', error.message);
    console.log('💡 请确保开发服务器正在运行: npm run dev');
  }
};

// 运行测试
testUpdatedAPI();
