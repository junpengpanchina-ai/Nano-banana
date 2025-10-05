// 测试 Grsai API 实际图像生成功能
const testGrsaiImageGeneration = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🖼️ 测试 Grsai API 实际图像生成功能...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试不同类型的图像生成
  const testImageGeneration = async () => {
    console.log('🎨 测试图像生成...');
    
    const testCases = [
      {
        name: '动漫手办 - 魔法少女',
        prompt: 'anime figure of a cute magical girl character, 1/7 scale figure, detailed, high quality, figure model, collectible figure, pose reference, character design, realistic style'
      },
      {
        name: '动漫手办 - 学校女生',
        prompt: 'anime figure of a school girl character, 1/7 scale figure, detailed, high quality, figure model, collectible figure, pose reference, character design, realistic style'
      },
      {
        name: '动漫手办 - 战士角色',
        prompt: 'anime figure of a warrior character, 1/7 scale figure, detailed, high quality, figure model, collectible figure, pose reference, character design, realistic style'
      }
    ];

    const results = [];
    
    for (const testCase of testCases) {
      try {
        console.log(`\n🔍 测试: ${testCase.name}`);
        console.log(`📝 提示词: ${testCase.prompt}`);
        
        const response = await fetch('https://api.grsai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert at generating anime figure images. When asked to generate an image, create a detailed description and generate the actual image with URL. Always include the image URL in your response.'
              },
              {
                role: 'user',
                content: `Please generate an anime figure image based on this description: ${testCase.prompt}. Make it suitable for 3D modeling and figure creation.`
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          console.log(`✅ 请求成功! 响应长度: ${content.length}`);
          
          // 提取图像 URL
          const imageUrlMatch = content.match(/https:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp)/i);
          if (imageUrlMatch) {
            const imageUrl = imageUrlMatch[0];
            console.log(`🖼️ 图像 URL: ${imageUrl}`);
            
            results.push({
              name: testCase.name,
              success: true,
              imageUrl: imageUrl,
              content: content,
              prompt: testCase.prompt
            });
          } else {
            console.log('📝 生成了描述但没有图像 URL');
            console.log(`📄 描述内容: ${content.substring(0, 200)}...`);
            
            results.push({
              name: testCase.name,
              success: false,
              hasImage: false,
              description: content,
              prompt: testCase.prompt
            });
          }
        } else {
          console.log(`❌ 请求失败: ${response.status}`);
          results.push({
            name: testCase.name,
            success: false,
            error: `HTTP ${response.status}`,
            prompt: testCase.prompt
          });
        }
      } catch (error) {
        console.log(`❌ 异常: ${error.message}`);
        results.push({
          name: testCase.name,
          success: false,
          error: error.message,
          prompt: testCase.prompt
        });
      }
    }
    
    return results;
  };

  // 测试图像质量验证
  const testImageQuality = async (imageUrl) => {
    console.log(`\n🔍 验证图像质量: ${imageUrl}`);
    
    try {
      const response = await fetch(imageUrl, {
        method: 'HEAD'
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        console.log(`✅ 图像可访问`);
        console.log(`📊 内容类型: ${contentType}`);
        console.log(`📊 文件大小: ${contentLength ? (parseInt(contentLength) / 1024).toFixed(2) + ' KB' : '未知'}`);
        
        return {
          accessible: true,
          contentType: contentType,
          contentLength: contentLength
        };
      } else {
        console.log(`❌ 图像不可访问: ${response.status}`);
        return {
          accessible: false,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      console.log(`❌ 验证异常: ${error.message}`);
      return {
        accessible: false,
        error: error.message
      };
    }
  };

  // 运行测试
  console.log('🚀 开始图像生成测试...\n');
  
  const imageResults = await testImageGeneration();
  
  // 验证生成的图像
  console.log('\n🔍 验证生成的图像...');
  for (const result of imageResults) {
    if (result.success && result.imageUrl) {
      await testImageQuality(result.imageUrl);
    }
  }

  // 生成测试报告
  console.log('\n📊 图像生成测试报告');
  console.log('='.repeat(50));
  
  const successCount = imageResults.filter(r => r.success).length;
  const imageCount = imageResults.filter(r => r.success && r.imageUrl).length;
  
  console.log(`\n📈 测试统计:`);
  console.log(`   总测试数: ${imageResults.length}`);
  console.log(`   成功数: ${successCount}`);
  console.log(`   生成图像数: ${imageCount}`);
  console.log(`   成功率: ${((successCount / imageResults.length) * 100).toFixed(1)}%`);
  
  console.log(`\n📋 详细结果:`);
  imageResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.name}:`);
    if (result.success) {
      if (result.imageUrl) {
        console.log(`   ✅ 成功生成图像`);
        console.log(`   🖼️ 图像 URL: ${result.imageUrl}`);
      } else {
        console.log(`   ⚠️ 生成了描述但没有图像`);
        console.log(`   📝 描述: ${result.description.substring(0, 100)}...`);
      }
    } else {
      console.log(`   ❌ 失败: ${result.error}`);
    }
  });

  // 总结
  console.log(`\n🎯 测试总结:`);
  if (imageCount > 0) {
    console.log(`✅ 图像生成功能完全可用！`);
    console.log(`💡 建议: 可以集成到项目中使用`);
  } else if (successCount > 0) {
    console.log(`⚠️ 可以生成描述但图像生成不稳定`);
    console.log(`💡 建议: 使用描述生成功能，图像生成作为备用`);
  } else {
    console.log(`❌ 图像生成功能不可用`);
    console.log(`💡 建议: 联系 Grsai 技术支持或使用其他服务`);
  }

  return {
    results: imageResults,
    successCount,
    imageCount,
    successRate: (successCount / imageResults.length) * 100
  };
};

// 运行测试
testGrsaiImageGeneration();
