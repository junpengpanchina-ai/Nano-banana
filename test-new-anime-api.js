// 测试新的动漫API - /v1/draw/completions
const testNewAnimeAPI = async () => {
  console.log('🎨 测试新的动漫API - /v1/draw/completions...');
  console.log('');

  const testCases = [
    {
      name: '动漫风格 - sora-image',
      prompt: 'cute magical girl character',
      style: 'anime',
      model: 'sora-image'
    },
    {
      name: '写实风格 - sora-image',
      prompt: 'cute magical girl character',
      style: 'realistic',
      model: 'sora-image'
    },
    {
      name: '卡通风格 - sora-image',
      prompt: 'cute magical girl character',
      style: 'cartoon',
      model: 'sora-image'
    },
    {
      name: '动漫风格 - gpt-4o-image',
      prompt: 'cute magical girl character',
      style: 'anime',
      model: 'gpt-4o-image'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 测试: ${testCase.name}`);
      console.log(`📝 提示词: ${testCase.prompt}`);
      console.log(`🎨 风格: ${testCase.style}`);
      console.log(`🤖 模型: ${testCase.model}`);
      
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

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      
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

  console.log('\n📊 新动漫API测试完成！');
  console.log('💡 请检查生成的图像质量和风格效果');
};

// 运行测试
testNewAnimeAPI();
