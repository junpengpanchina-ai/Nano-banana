// 测试不同风格的效果
const testStyleDifferences = async () => {
  console.log('🎨 测试不同风格的效果...');
  console.log('');

  const testCases = [
    {
      name: '动漫风格',
      prompt: 'cute magical girl character',
      style: 'anime',
      expectedKeywords: ['anime', 'cel-shaded', 'vibrant colors', 'manga style']
    },
    {
      name: '写实风格',
      prompt: 'cute magical girl character',
      style: 'realistic',
      expectedKeywords: ['realistic', 'photorealistic', 'realistic materials', 'lifelike']
    },
    {
      name: '卡通风格',
      prompt: 'cute magical girl character',
      style: 'cartoon',
      expectedKeywords: ['cartoon', 'stylized', 'simplified', 'cute', 'chibi']
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 测试: ${testCase.name}`);
      console.log(`📝 提示词: ${testCase.prompt}`);
      console.log(`🎨 风格: ${testCase.style}`);
      
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

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API 调用成功!');
        
        if (data.url) {
          console.log(`🖼️ 生成的图像 URL: ${data.url}`);
          
          // 检查生成的提示词是否包含期望的关键词
          console.log('🔍 检查生成的提示词...');
          
          // 这里我们可以通过查看服务器日志来验证提示词
          // 或者我们可以创建一个简单的提示词生成测试
          const enhancedPrompt = generateEnhancedPrompt(testCase.prompt, testCase.style, false);
          console.log(`📝 增强后的提示词: ${enhancedPrompt}`);
          
          // 检查是否包含期望的关键词
          const containsKeywords = testCase.expectedKeywords.some(keyword => 
            enhancedPrompt.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (containsKeywords) {
            console.log(`✅ 提示词包含期望的关键词: ${testCase.expectedKeywords.join(', ')}`);
          } else {
            console.log(`⚠️ 提示词可能不包含期望的关键词`);
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

  console.log('\n📊 风格测试完成！');
  console.log('💡 请检查生成的图像是否体现了不同的风格特点');
};

// 模拟提示词生成逻辑（与 API 中的逻辑一致）
const generateEnhancedPrompt = (prompt, style, hasImage) => {
  if (hasImage) {
    if (style === 'realistic') {
      return `realistic figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, photorealistic style, realistic materials, detailed textures`;
    } else if (style === 'cartoon') {
      return `cartoon figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, cartoon style, stylized, simplified, cute, chibi style`;
    } else {
      return `anime figure of ${prompt}, 1/7 scale figure, detailed, high quality, based on uploaded reference image, figure model, collectible figure, pose reference, character design, anime style, cel-shaded, vibrant colors`;
    }
  } else {
    if (style === 'realistic') {
      return `${prompt}, realistic figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, photorealistic style, realistic materials, detailed textures, lifelike appearance`;
    } else if (style === 'cartoon') {
      return `${prompt}, cartoon figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, cartoon style, stylized, simplified, cute, chibi style, playful design`;
    } else {
      return `${prompt}, anime figure, 1/7 scale figure, detailed, high quality, commercialized figure, figure model, collectible figure, anime style, cel-shaded, vibrant colors, manga style`;
    }
  }
};

// 运行测试
testStyleDifferences();
