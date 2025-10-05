// 使用正确的 Grsai API 端点进行测试
const testGrsaiCorrect = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🚀 测试正确的 Grsai API 端点...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试 Chat Completions API
  const testChatAPI = async () => {
    console.log('📝 测试 Chat Completions API...');
    
    try {
      const response = await fetch('https://api.grsai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          stream: false,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: 'Hello! Can you help me generate an anime figure description?'
            }
          ]
        })
      });

      console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Chat API 调用成功!');
        console.log('📊 响应数据:', JSON.stringify(data, null, 2));
        return true;
      } else {
        const errorText = await response.text();
        console.log(`❌ Chat API 失败: ${errorText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Chat API 异常: ${error.message}`);
      return false;
    }
  };

  // 测试图像生成 API（尝试不同的可能端点）
  const testImageAPI = async () => {
    console.log('\n🖼️ 测试图像生成 API...');
    
    const imageEndpoints = [
      'https://api.grsai.com/v1/images/generations',
      'https://api.grsai.com/v1/image/generations',
      'https://api.grsai.com/v1/generate/image',
      'https://api.grsai.com/v1/flux/generate'
    ];

    for (const endpoint of imageEndpoints) {
      try {
        console.log(`🔍 尝试端点: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'flux-kontext-pro',
            prompt: 'anime figure, 3d model, high quality, detailed, cute character',
            width: 1024,
            height: 1024,
            quality: 'high'
          })
        });

        console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ 图像生成 API 调用成功!');
          console.log('📊 响应数据:', JSON.stringify(data, null, 2));
          return true;
        } else {
          const errorText = await response.text();
          console.log(`❌ 端点失败: ${errorText.substring(0, 200)}...`);
        }
      } catch (error) {
        console.log(`❌ 端点异常: ${error.message}`);
      }
    }
    
    return false;
  };

  // 测试可用的模型列表
  const testModelsAPI = async () => {
    console.log('\n📋 测试模型列表 API...');
    
    try {
      const response = await fetch('https://api.grsai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 模型列表 API 调用成功!');
        console.log('📊 可用模型:', JSON.stringify(data, null, 2));
        return true;
      } else {
        const errorText = await response.text();
        console.log(`❌ 模型列表 API 失败: ${errorText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ 模型列表 API 异常: ${error.message}`);
      return false;
    }
  };

  // 运行所有测试
  const chatSuccess = await testChatAPI();
  const imageSuccess = await testImageAPI();
  const modelsSuccess = await testModelsAPI();

  console.log('\n📊 测试总结:');
  console.log(`Chat API: ${chatSuccess ? '✅ 成功' : '❌ 失败'}`);
  console.log(`Image API: ${imageSuccess ? '✅ 成功' : '❌ 失败'}`);
  console.log(`Models API: ${modelsSuccess ? '✅ 成功' : '❌ 失败'}`);

  if (chatSuccess || imageSuccess || modelsSuccess) {
    console.log('\n🎉 至少有一个 API 端点可用！');
    if (chatSuccess) {
      console.log('💡 可以使用 Chat API 进行文本生成');
    }
    if (imageSuccess) {
      console.log('💡 可以使用 Image API 进行图像生成');
    }
    if (modelsSuccess) {
      console.log('💡 可以获取可用模型列表');
    }
  } else {
    console.log('\n❌ 所有 API 端点都不可用');
    console.log('💡 建议联系 Grsai 技术支持或检查 API 密钥');
  }
};

// 运行测试
testGrsaiCorrect();
