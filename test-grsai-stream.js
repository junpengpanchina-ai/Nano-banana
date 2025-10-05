// 正确处理 Grsai API 流式响应
const testGrsaiStream = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const baseUrl = 'https://grsai.dakka.com.cn';
  
  console.log('🌊 测试 Grsai API 流式响应处理...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log('');

  // 解析 SSE 流式数据
  const parseSSEData = (text) => {
    const lines = text.split('\n');
    const events = [];
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6); // 移除 "data: " 前缀
          if (jsonStr.trim()) {
            const data = JSON.parse(jsonStr);
            events.push(data);
          }
        } catch (error) {
          console.log(`⚠️ 解析 SSE 行失败: ${line.substring(0, 50)}...`);
        }
      }
    }
    
    return events;
  };

  // 测试流式图像生成
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
          aspectRatio: '1:1',
          shutProgress: false
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`📊 内容类型: ${response.headers.get('content-type')}`);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log(`📄 响应长度: ${responseText.length}`);
        
        // 解析 SSE 数据
        const events = parseSSEData(responseText);
        console.log(`📊 解析到 ${events.length} 个事件`);
        
        // 显示进度
        for (const event of events) {
          console.log(`📈 进度: ${event.progress}% - 状态: ${event.status}`);
          if (event.results && event.results.length > 0) {
            console.log(`🖼️ 图像 URL: ${event.results[0].url}`);
            console.log(`📝 内容: ${event.results[0].content}`);
          }
        }
        
        // 获取最终结果
        const finalEvent = events[events.length - 1];
        if (finalEvent && finalEvent.status === 'succeeded' && finalEvent.results && finalEvent.results.length > 0) {
          console.log('✅ 流式生成成功!');
          return { success: true, data: finalEvent };
        } else {
          console.log('⚠️ 流式生成未完成或失败');
          return { success: false, error: '生成未完成', events };
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

  // 测试 WebHook 模式（轮询）
  const testWebhookMode = async () => {
    console.log('\n🔗 测试 WebHook 模式（轮询）...');
    
    try {
      // 提交任务
      const submitResponse = await fetch(`${baseUrl}/v1/draw/nano-banana`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'nano-banana-fast',
          prompt: 'anime figure of a school girl character, 1/7 scale figure, detailed, high quality, figure model, collectible figure',
          aspectRatio: '16:9',
          webHook: '-1', // 使用轮询模式
          shutProgress: false
        })
      });

      if (!submitResponse.ok) {
        throw new Error(`提交任务失败: ${submitResponse.status}`);
      }

      const submitData = await submitResponse.json();
      console.log('✅ 任务提交成功');
      console.log(`🆔 任务 ID: ${submitData.data.id}`);

      const taskId = submitData.data.id;
      
      // 轮询查询结果
      const maxAttempts = 10;
      const pollInterval = 2000; // 2秒
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`🔍 第 ${attempt} 次查询...`);
        
        const resultResponse = await fetch(`${baseUrl}/v1/draw/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ id: taskId })
        });

        if (!resultResponse.ok) {
          throw new Error(`查询结果失败: ${resultResponse.status}`);
        }

        const resultData = await resultResponse.json();
        console.log(`📊 状态: ${resultData.data.status}, 进度: ${resultData.data.progress}%`);

        if (resultData.data.status === 'succeeded') {
          console.log('✅ 任务完成!');
          if (resultData.data.results && resultData.data.results.length > 0) {
            console.log(`🖼️ 图像 URL: ${resultData.data.results[0].url}`);
            console.log(`📝 内容: ${resultData.data.results[0].content}`);
            return { success: true, data: resultData.data };
          }
        } else if (resultData.data.status === 'failed') {
          console.log(`❌ 任务失败: ${resultData.data.failure_reason}`);
          return { success: false, error: resultData.data.failure_reason };
        }

        // 等待下次查询
        if (attempt < maxAttempts) {
          console.log(`⏳ 等待 ${pollInterval}ms...`);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      }

      console.log('⏰ 查询超时');
      return { success: false, error: '查询超时' };

    } catch (error) {
      console.log(`❌ WebHook 模式异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试不同模型
  const testDifferentModels = async () => {
    console.log('\n🤖 测试不同模型...');
    
    const models = ['nano-banana-fast', 'nano-banana'];
    const results = [];
    
    for (const model of models) {
      try {
        console.log(`🔍 测试模型: ${model}`);
        
        const response = await fetch(`${baseUrl}/v1/draw/nano-banana`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            prompt: 'anime figure of a warrior character, 1/7 scale figure, detailed, high quality, figure model, collectible figure',
            aspectRatio: 'auto',
            shutProgress: true // 直接返回最终结果
          })
        });

        if (response.ok) {
          const responseText = await response.text();
          const events = parseSSEData(responseText);
          const finalEvent = events[events.length - 1];
          
          if (finalEvent && finalEvent.status === 'succeeded' && finalEvent.results && finalEvent.results.length > 0) {
            console.log(`✅ ${model} 成功!`);
            console.log(`🖼️ 图像 URL: ${finalEvent.results[0].url}`);
            results.push({ model, success: true, data: finalEvent });
          } else {
            console.log(`⚠️ ${model} 未完成`);
            results.push({ model, success: false, error: '未完成' });
          }
        } else {
          console.log(`❌ ${model} 失败: ${response.status}`);
          results.push({ model, success: false, error: `HTTP ${response.status}` });
        }
      } catch (error) {
        console.log(`❌ ${model} 异常: ${error.message}`);
        results.push({ model, success: false, error: error.message });
      }
    }
    
    return results;
  };

  // 运行所有测试
  console.log('🚀 开始流式响应测试...\n');
  
  const streamResult = await testStreamGeneration();
  const webhookResult = await testWebhookMode();
  const modelResults = await testDifferentModels();

  // 生成测试报告
  console.log('\n📊 流式响应测试报告');
  console.log('='.repeat(50));
  
  console.log('\n1. 流式响应测试:');
  console.log(`   状态: ${streamResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (streamResult.success) {
    console.log(`   🖼️ 图像 URL: ${streamResult.data.results[0].url}`);
  } else {
    console.log(`   错误: ${streamResult.error}`);
  }

  console.log('\n2. WebHook 模式测试:');
  console.log(`   状态: ${webhookResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (webhookResult.success) {
    console.log(`   🖼️ 图像 URL: ${webhookResult.data.results[0].url}`);
  } else {
    console.log(`   错误: ${webhookResult.error}`);
  }

  console.log('\n3. 不同模型测试:');
  modelResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${result.model}: ${status} ${result.success ? '成功' : '失败'}`);
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
    console.log(`✅ Grsai API 流式响应工作正常！`);
    console.log(`💡 建议: 使用正确的流式数据处理进行集成`);
  } else {
    console.log(`❌ 需要进一步调试`);
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
testGrsaiStream();
