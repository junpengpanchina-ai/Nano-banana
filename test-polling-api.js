// 测试轮询模式的动漫API
const testPollingAPI = async () => {
  console.log('🔄 测试轮询模式的动漫API...');
  console.log('');

  const testCases = [
    {
      name: '动漫风格 - 轮询模式',
      prompt: 'cute magical girl character',
      style: 'anime',
      model: 'sora-image'
    },
    {
      name: '写实风格 - 轮询模式',
      prompt: 'cute magical girl character',
      style: 'realistic',
      model: 'sora-image'
    },
    {
      name: '卡通风格 - 轮询模式',
      prompt: 'cute magical girl character',
      style: 'cartoon',
      model: 'sora-image'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 测试: ${testCase.name}`);
      console.log(`📝 提示词: ${testCase.prompt}`);
      console.log(`🎨 风格: ${testCase.style}`);
      console.log(`🤖 模型: ${testCase.model}`);
      
      const startTime = Date.now();
      
      // 创建 FormData
      const formData = new FormData();
      formData.append('prompt', testCase.prompt);
      formData.append('service', 'grsai');
      formData.append('options', JSON.stringify({
        style: testCase.style,
        pose: 'standing',
        model: testCase.model
      }));

      console.log('📤 发送请求...');
      
      const response = await fetch('http://localhost:3000/api/generate/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test_master_key_123'
        },
        body: formData
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`⏱️ 总耗时: ${duration}ms`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API 调用成功!');
        
        if (data.url) {
          console.log(`🖼️ 生成的图像 URL: ${data.url}`);
        } else {
          console.log('⚠️ 未返回图像 URL');
        }
      } else {
        const errorData = await response.json();
        console.log('❌ API 调用失败:', errorData);
      }
    } catch (error) {
      console.log(`❌ 测试异常: ${error.message}`);
    }
  }

  console.log('\n📊 轮询模式测试完成！');
  console.log('💡 请检查生成的图像质量和轮询效果');
};

// 运行测试
testPollingAPI();
