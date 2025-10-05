// 使用正确的 Grsai API 文档进行测试
const testGrsaiCorrectAPI = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const baseUrl = 'https://grsai.dakka.com.cn';
  
  console.log('🎯 使用正确的 Grsai API 文档进行测试...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log('');

  // 测试 1: 基础图像生成（流式响应）
  const testStreamGeneration = async () => {
    console.log('🎨 测试流式图像生成...');
    
    try {
      const response = await fetch(`${baseUrl}/v1/draw/nano-banana`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'nano-banana-fast',
          prompt: 'anime figure of a cute magical girl character, 1/7 scale figure, detailed, high quality, figure model, collectible figure',
          aspectRatio: 'auto',
          shutProgress: false
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`📊 响应头:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const responseText = await response.text();
        console.log(`📄 响应长度: ${responseText.length}`);
        console.log(`📄 响应内容: ${responseText}`);
        
        try {
          const data = JSON.parse(responseText);
          console.log('✅ 流式响应解析成功!');
          console.log('📊 响应数据:', JSON.stringify(data, null, 2));
          
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            console.log(`🖼️ 图像 URL: ${result.url}`);
            console.log(`📝 内容: ${result.content}`);
            console.log(`📊 进度: ${data.progress}%`);
            console.log(`📊 状态: ${data.status}`);
            return { success: true, data };
          } else {
            console.log('⚠️ 响应中没有结果数据');
            return { success: false, error: '无结果数据' };
          }
        } catch (parseError) {
          console.log('❌ JSON 解析失败:', parseError.message);
          console.log('📄 原始响应:', responseText);
          return { success: false, error: parseError.message };
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ 请求失败: ${errorText}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ 请求异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试 2: 使用 webHook 模式
  const testWebhookGeneration = async () => {
    console.log('\n🔗 测试 WebHook 模式...');
    
    try {
      const response = await fetch(`${baseUrl}/v1/draw/nano-banana`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'nano-banana-fast',
          prompt: 'anime figure of a school girl character, 1/7 scale figure, detailed, high quality, figure model, collectible figure',
          aspectRatio: '1:1',
          webHook: '-1', // 使用轮询模式
          shutProgress: false
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ WebHook 响应成功!');
        console.log('📊 响应数据:', JSON.stringify(data, null, 2));
        
        if (data.code === 0 && data.data && data.data.id) {
          const taskId = data.data.id;
          console.log(`🆔 任务 ID: ${taskId}`);
          
          // 等待一段时间后查询结果
          console.log('⏳ 等待 5 秒后查询结果...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          return await queryResult(taskId);
        } else {
          console.log('❌ WebHook 响应格式错误');
          return { success: false, error: '响应格式错误' };
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ 请求失败: ${errorText}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ 请求异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 查询结果
  const queryResult = async (taskId) => {
    console.log(`🔍 查询任务结果: ${taskId}`);
    
    try {
      const response = await fetch(`${baseUrl}/v1/draw/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          id: taskId
        })
      });

      console.log(`📊 查询响应状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 查询结果成功!');
        console.log('📊 查询数据:', JSON.stringify(data, null, 2));
        
        if (data.code === 0 && data.data) {
          const resultData = data.data;
          console.log(`📊 任务状态: ${resultData.status}`);
          console.log(`📊 进度: ${resultData.progress}%`);
          
          if (resultData.results && resultData.results.length > 0) {
            const result = resultData.results[0];
            console.log(`🖼️ 图像 URL: ${result.url}`);
            console.log(`📝 内容: ${result.content}`);
            return { success: true, data: resultData };
          } else {
            console.log('⚠️ 任务尚未完成或没有结果');
            return { success: false, error: '任务未完成' };
          }
        } else {
          console.log(`❌ 查询失败: ${data.msg}`);
          return { success: false, error: data.msg };
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ 查询失败: ${errorText}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ 查询异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试 3: 不同模型和参数
  const testDifferentModels = async () => {
    console.log('\n🤖 测试不同模型和参数...');
    
    const testCases = [
      {
        name: 'nano-banana-fast 模型',
        model: 'nano-banana-fast',
        aspectRatio: '1:1'
      },
      {
        name: 'nano-banana 模型',
        model: 'nano-banana',
        aspectRatio: '16:9'
      }
    ];

    const results = [];
    
    for (const testCase of testCases) {
      try {
        console.log(`🔍 测试: ${testCase.name}`);
        
        const response = await fetch(`${baseUrl}/v1/draw/nano-banana`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: testCase.model,
            prompt: 'anime figure of a warrior character, 1/7 scale figure, detailed, high quality, figure model, collectible figure',
            aspectRatio: testCase.aspectRatio,
            shutProgress: true // 直接返回最终结果
          })
        });

        console.log(`📊 状态: ${response.status}`);
        
        if (response.ok) {
          const responseText = await response.text();
          console.log(`📄 响应长度: ${responseText.length}`);
          
          try {
            const data = JSON.parse(responseText);
            console.log(`✅ ${testCase.name} 成功!`);
            if (data.results && data.results.length > 0) {
              console.log(`🖼️ 图像 URL: ${data.results[0].url}`);
            }
            results.push({ name: testCase.name, success: true, data });
          } catch (parseError) {
            console.log(`❌ ${testCase.name} JSON 解析失败: ${parseError.message}`);
            results.push({ name: testCase.name, success: false, error: parseError.message });
          }
        } else {
          console.log(`❌ ${testCase.name} 失败: ${response.status}`);
          results.push({ name: testCase.name, success: false, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        console.log(`❌ ${testCase.name} 异常: ${error.message}`);
        results.push({ name: testCase.name, success: false, error: error.message });
      }
    }
    
    return results;
  };

  // 运行所有测试
  console.log('🚀 开始正确 API 测试...\n');
  
  const streamResult = await testStreamGeneration();
  const webhookResult = await testWebhookGeneration();
  const modelResults = await testDifferentModels();

  // 生成测试报告
  console.log('\n📊 正确 API 测试报告');
  console.log('='.repeat(50));
  
  console.log('\n1. 流式响应测试:');
  console.log(`   状态: ${streamResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!streamResult.success) {
    console.log(`   错误: ${streamResult.error}`);
  }

  console.log('\n2. WebHook 模式测试:');
  console.log(`   状态: ${webhookResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!webhookResult.success) {
    console.log(`   错误: ${webhookResult.error}`);
  }

  console.log('\n3. 不同模型测试:');
  modelResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${result.name}: ${status} ${result.success ? '成功' : '失败'}`);
    if (!result.success) {
      console.log(`      错误: ${result.error}`);
    }
  });

  // 总结
  const successCount = [streamResult, webhookResult, ...modelResults].filter(r => r.success).length;
  const totalCount = 2 + modelResults.length;
  
  console.log(`\n🎯 总体评估:`);
  console.log(`   成功率: ${successCount}/${totalCount} (${((successCount / totalCount) * 100).toFixed(1)}%)`);
  
  if (successCount > 0) {
    console.log(`✅ 正确的 Grsai API 可以正常工作！`);
    console.log(`💡 建议: 使用正确的 API 端点进行集成`);
  } else {
    console.log(`❌ 所有测试都失败了`);
    console.log(`💡 建议: 检查 API 密钥和网络连接`);
  }

  return {
    stream: streamResult,
    webhook: webhookResult,
    models: modelResults,
    successCount,
    totalCount
  };
};

// 运行测试
testGrsaiCorrectAPI();
