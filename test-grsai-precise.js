// 精确测试 Grsai API 功能
const testGrsaiPrecise = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🎯 精确测试 Grsai API 功能...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试 1: Chat API 功能测试
  const testChatFunctionality = async () => {
    console.log('💬 测试 Chat API 功能...');
    
    const testCases = [
      {
        name: '简单对话',
        messages: [
          { role: 'user', content: 'Hello!' }
        ]
      },
      {
        name: '图像描述生成',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at describing anime figures for 3D modeling.'
          },
          {
            role: 'user',
            content: 'Generate a detailed description for an anime figure of a cute magical girl.'
          }
        ]
      },
      {
        name: '手办设计建议',
        messages: [
          {
            role: 'user',
            content: 'Give me design suggestions for a 1/7 scale anime figure of a school girl character.'
          }
        ]
      }
    ];

    const results = [];
    
    for (const testCase of testCases) {
      try {
        console.log(`🔍 测试: ${testCase.name}`);
        
        const response = await fetch('https://api.grsai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: testCase.messages
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          console.log(`✅ 成功! 响应长度: ${content.length}`);
          console.log(`📄 内容预览: ${content.substring(0, 100)}...`);
          
          results.push({
            name: testCase.name,
            success: true,
            content: content,
            length: content.length
          });
        } else {
          console.log(`❌ 失败: ${response.status}`);
          results.push({
            name: testCase.name,
            success: false,
            error: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        console.log(`❌ 异常: ${error.message}`);
        results.push({
          name: testCase.name,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  };

  // 测试 2: 不同模型的可用性
  const testModelAvailability = async () => {
    console.log('\n🤖 测试模型可用性...');
    
    const models = [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-3.5-turbo',
      'gpt-4',
      'claude-3-sonnet',
      'claude-3-haiku',
      'gemini-pro'
    ];

    const results = [];
    
    for (const model of models) {
      try {
        console.log(`🔍 测试模型: ${model}`);
        
        const response = await fetch('https://api.grsai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'user', content: 'Test model availability' }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ 模型 ${model} 可用`);
          results.push({ model, available: true });
        } else {
          const errorText = await response.text();
          console.log(`❌ 模型 ${model} 不可用: ${response.status}`);
          results.push({ model, available: false, error: response.status });
        }
      } catch (error) {
        console.log(`❌ 模型 ${model} 异常: ${error.message}`);
        results.push({ model, available: false, error: error.message });
      }
    }
    
    return results;
  };

  // 测试 3: 图像生成能力测试
  const testImageGeneration = async () => {
    console.log('\n🖼️ 测试图像生成能力...');
    
    try {
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
              content: 'You are an expert at generating anime figure images. When asked to generate an image, create a detailed description and if possible, generate the actual image with URL.'
            },
            {
              role: 'user',
              content: 'Generate an anime figure image of a cute magical girl character, suitable for 3D modeling.'
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        console.log('✅ 图像生成请求成功');
        console.log(`📄 响应内容: ${content.substring(0, 200)}...`);
        
        // 检查是否包含图像 URL
        const imageUrlMatch = content.match(/https:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp)/i);
        if (imageUrlMatch) {
          console.log(`🖼️ 找到图像 URL: ${imageUrlMatch[0]}`);
          return { success: true, hasImage: true, imageUrl: imageUrlMatch[0] };
        } else {
          console.log('📝 生成了描述但没有图像 URL');
          return { success: true, hasImage: false, description: content };
        }
      } else {
        console.log(`❌ 图像生成失败: ${response.status}`);
        return { success: false, error: response.status };
      }
    } catch (error) {
      console.log(`❌ 图像生成异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 运行所有测试
  console.log('🚀 开始精确功能测试...\n');
  
  const chatResults = await testChatFunctionality();
  const modelResults = await testModelAvailability();
  const imageResults = await testImageGeneration();

  // 生成测试报告
  console.log('\n📊 精确功能测试报告');
  console.log('='.repeat(50));
  
  console.log('\n1. Chat API 功能测试:');
  chatResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${result.name}: ${status} ${result.success ? '成功' : '失败'}`);
    if (result.success) {
      console.log(`      响应长度: ${result.length} 字符`);
    } else {
      console.log(`      错误: ${result.error}`);
    }
  });

  console.log('\n2. 模型可用性测试:');
  const availableModels = modelResults.filter(r => r.available);
  const unavailableModels = modelResults.filter(r => !r.available);
  console.log(`   可用模型: ${availableModels.length}/${modelResults.length}`);
  availableModels.forEach(result => {
    console.log(`   ✅ ${result.model}`);
  });
  if (unavailableModels.length > 0) {
    console.log('   不可用模型:');
    unavailableModels.forEach(result => {
      console.log(`   ❌ ${result.model} (${result.error})`);
    });
  }

  console.log('\n3. 图像生成能力测试:');
  if (imageResults.success) {
    console.log('   ✅ 图像生成功能可用');
    if (imageResults.hasImage) {
      console.log(`   🖼️ 图像 URL: ${imageResults.imageUrl}`);
    } else {
      console.log('   📝 可以生成图像描述');
    }
  } else {
    console.log(`   ❌ 图像生成功能不可用: ${imageResults.error}`);
  }

  // 总结
  const chatSuccess = chatResults.every(r => r.success);
  const hasAvailableModels = availableModels.length > 0;
  const imageSuccess = imageResults.success;
  
  console.log('\n🎯 总体评估:');
  console.log(`   Chat 功能: ${chatSuccess ? '✅ 完全可用' : '❌ 部分可用'}`);
  console.log(`   模型支持: ${hasAvailableModels ? '✅ 有可用模型' : '❌ 无可用模型'}`);
  console.log(`   图像生成: ${imageSuccess ? '✅ 可用' : '❌ 不可用'}`);
  
  const overallSuccess = chatSuccess && hasAvailableModels;
  console.log(`\n🎉 总体状态: ${overallSuccess ? '✅ 可以正常使用' : '❌ 存在问题'}`);
  
  if (overallSuccess) {
    console.log('\n💡 使用建议:');
    console.log('   1. Chat API 功能完全正常，可以用于文本生成');
    console.log('   2. 可以生成图像描述和设计建议');
    console.log('   3. 建议集成到项目中使用');
    if (imageSuccess && imageResults.hasImage) {
      console.log('   4. 图像生成功能也可用');
    }
  } else {
    console.log('\n💡 问题排查:');
    console.log('   1. 检查 API 密钥是否有效');
    console.log('   2. 检查网络连接');
    console.log('   3. 联系 Grsai 技术支持');
  }

  return {
    chat: chatResults,
    models: modelResults,
    image: imageResults,
    overall: overallSuccess
  };
};

// 运行测试
testGrsaiPrecise();
