// 测试图片上传修复
const testImageUploadFix = async () => {
  console.log('🖼️ 测试图片上传修复...');
  console.log('');

  const testCases = [
    {
      name: '无图片 - 动漫风格',
      prompt: 'cute magical girl character',
      style: 'anime',
      hasImage: false
    },
    {
      name: '无图片 - 写实风格', 
      prompt: 'cute magical girl character',
      style: 'realistic',
      hasImage: false
    },
    {
      name: '无图片 - 卡通风格',
      prompt: 'cute magical girl character', 
      style: 'cartoon',
      hasImage: false
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 测试: ${testCase.name}`);
      console.log(`📝 提示词: ${testCase.prompt}`);
      console.log(`🎨 风格: ${testCase.style}`);
      console.log(`🖼️ 有图片: ${testCase.hasImage}`);
      
      const startTime = Date.now();
      
      // 创建 FormData
      const formData = new FormData();
      formData.append('prompt', testCase.prompt);
      formData.append('service', 'grsai');
      formData.append('options', JSON.stringify({
        style: testCase.style,
        pose: 'standing'
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
          
          // 检查URL是否来自Grsai
          if (data.url.includes('grsai.com')) {
            console.log('✅ 使用Grsai API生成');
          } else if (data.url.includes('pollinations.ai')) {
            console.log('⚠️ 降级到测试模式');
          } else {
            console.log('❓ 使用其他服务');
          }
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

  console.log('\n📊 图片上传修复测试完成！');
  console.log('💡 现在应该能生成不同风格的手办了');
};

// 运行测试
testImageUploadFix();
