// 调试 Grsai API JSON 解析问题
const testGrsaiDebugJSON = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🔍 调试 Grsai API JSON 解析问题...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试失败的简单对话
  const testSimpleConversation = async () => {
    console.log('💬 测试简单对话（失败案例）...');
    
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
            { role: 'user', content: 'Hello!' }
          ]
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`📊 响应头:`, Object.fromEntries(response.headers.entries()));
      
      // 获取原始响应文本
      const responseText = await response.text();
      console.log(`📄 响应长度: ${responseText.length}`);
      console.log(`📄 响应内容: "${responseText}"`);
      console.log(`📄 响应内容 (hex): ${Buffer.from(responseText).toString('hex')}`);
      
      if (responseText.length === 0) {
        console.log('❌ 问题：响应为空');
        return { success: false, error: '空响应' };
      }
      
      try {
        const data = JSON.parse(responseText);
        console.log('✅ JSON 解析成功');
        console.log('📊 解析后的数据:', JSON.stringify(data, null, 2));
        return { success: true, data };
      } catch (parseError) {
        console.log('❌ JSON 解析失败:', parseError.message);
        console.log('📄 尝试解析的内容:', JSON.stringify(responseText));
        return { success: false, error: parseError.message, rawResponse: responseText };
      }
    } catch (error) {
      console.log(`❌ 请求异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试成功的手办设计建议
  const testFigureDesign = async () => {
    console.log('\n🎨 测试手办设计建议（成功案例）...');
    
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
              role: 'user',
              content: 'Give me design suggestions for a 1/7 scale anime figure of a school girl character.'
            }
          ]
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`📄 响应长度: ${responseText.length}`);
      console.log(`📄 响应内容前200字符: ${responseText.substring(0, 200)}...`);
      
      try {
        const data = JSON.parse(responseText);
        console.log('✅ JSON 解析成功');
        console.log('📊 解析后的数据:', JSON.stringify(data, null, 2));
        return { success: true, data };
      } catch (parseError) {
        console.log('❌ JSON 解析失败:', parseError.message);
        return { success: false, error: parseError.message, rawResponse: responseText };
      }
    } catch (error) {
      console.log(`❌ 请求异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试不同的请求参数
  const testDifferentParameters = async () => {
    console.log('\n🔧 测试不同请求参数...');
    
    const testCases = [
      {
        name: '添加 stream: false',
        body: {
          model: 'gpt-4o-mini',
          stream: false,
          messages: [
            { role: 'user', content: 'Hello!' }
          ]
        }
      },
      {
        name: '添加 max_tokens',
        body: {
          model: 'gpt-4o-mini',
          max_tokens: 100,
          messages: [
            { role: 'user', content: 'Hello!' }
          ]
        }
      },
      {
        name: '添加 temperature',
        body: {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [
            { role: 'user', content: 'Hello!' }
          ]
        }
      },
      {
        name: '使用不同模型',
        body: {
          model: 'gpt-4o',
          messages: [
            { role: 'user', content: 'Hello!' }
          ]
        }
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
          body: JSON.stringify(testCase.body)
        });

        console.log(`📊 状态: ${response.status}`);
        
        const responseText = await response.text();
        console.log(`📄 响应长度: ${responseText.length}`);
        
        if (responseText.length > 0) {
          try {
            const data = JSON.parse(responseText);
            console.log(`✅ 成功! 响应长度: ${JSON.stringify(data).length}`);
            results.push({ name: testCase.name, success: true });
          } catch (parseError) {
            console.log(`❌ JSON 解析失败: ${parseError.message}`);
            console.log(`📄 原始响应: ${responseText.substring(0, 100)}...`);
            results.push({ name: testCase.name, success: false, error: parseError.message });
          }
        } else {
          console.log(`❌ 空响应`);
          results.push({ name: testCase.name, success: false, error: '空响应' });
        }
      } catch (error) {
        console.log(`❌ 异常: ${error.message}`);
        results.push({ name: testCase.name, success: false, error: error.message });
      }
    }
    
    return results;
  };

  // 运行所有测试
  console.log('🚀 开始 JSON 解析调试...\n');
  
  const simpleResult = await testSimpleConversation();
  const figureResult = await testFigureDesign();
  const paramResults = await testDifferentParameters();

  // 生成调试报告
  console.log('\n📊 JSON 解析调试报告');
  console.log('='.repeat(50));
  
  console.log('\n1. 简单对话测试:');
  console.log(`   状态: ${simpleResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!simpleResult.success) {
    console.log(`   错误: ${simpleResult.error}`);
    if (simpleResult.rawResponse) {
      console.log(`   原始响应: ${simpleResult.rawResponse}`);
    }
  }

  console.log('\n2. 手办设计建议测试:');
  console.log(`   状态: ${figureResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!figureResult.success) {
    console.log(`   错误: ${figureResult.error}`);
  }

  console.log('\n3. 不同参数测试:');
  paramResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${result.name}: ${status} ${result.success ? '成功' : '失败'}`);
    if (!result.success) {
      console.log(`      错误: ${result.error}`);
    }
  });

  // 分析问题
  console.log('\n🔍 问题分析:');
  
  if (simpleResult.success && figureResult.success) {
    console.log('✅ 所有测试都成功，问题可能已解决');
  } else if (simpleResult.success && !figureResult.success) {
    console.log('⚠️ 简单对话成功，但复杂请求失败');
  } else if (!simpleResult.success && figureResult.success) {
    console.log('⚠️ 复杂请求成功，但简单对话失败');
    console.log('💡 可能的原因:');
    console.log('   1. 简单请求触发了某种限制或过滤');
    console.log('   2. 某些特定内容被阻止');
    console.log('   3. API 对简单请求有特殊处理');
  } else {
    console.log('❌ 所有测试都失败');
    console.log('💡 可能的原因:');
    console.log('   1. API 服务不稳定');
    console.log('   2. 网络连接问题');
    console.log('   3. API 密钥问题');
  }

  return {
    simple: simpleResult,
    figure: figureResult,
    parameters: paramResults
  };
};

// 运行调试
testGrsaiDebugJSON();
