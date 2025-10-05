// 测试API key是否正确配置
const testApiKeyCheck = async () => {
  console.log('🔑 测试API key配置...');
  console.log('');

  try {
    const response = await fetch('http://localhost:3000/api/generate/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test_master_key_123'
      },
      body: (() => {
        const formData = new FormData();
        formData.append('prompt', 'test prompt');
        formData.append('service', 'grsai');
        formData.append('options', JSON.stringify({
          style: 'anime',
          pose: 'standing'
        }));
        return formData;
      })()
    });

    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API 调用成功!');
      console.log('📄 响应数据:', data);
      
      if (data.url) {
        if (data.url.includes('grsai.com')) {
          console.log('✅ 使用Grsai API生成');
        } else if (data.url.includes('pollinations.ai')) {
          console.log('⚠️ 降级到测试模式 - API key可能未配置');
        } else {
          console.log('❓ 使用其他服务');
        }
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API 调用失败:', errorData);
    }
  } catch (error) {
    console.log(`❌ 测试异常: ${error.message}`);
  }
};

// 运行测试
testApiKeyCheck();
