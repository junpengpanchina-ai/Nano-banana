// 尝试不同的 Grsai API 调用方式
const testGrsaiAlternative = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🔄 尝试不同的 Grsai API 调用方式...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试 1: 使用不同的模型名称
  const testDifferentModels = async () => {
    console.log('📝 测试不同的模型名称...');
    
    const models = [
      'gpt-4o-mini',
      'gpt-4o',
      'gpt-3.5-turbo',
      'gpt-4',
      'claude-3-sonnet',
      'claude-3-haiku',
      'gemini-pro',
      'gemini-2.5-flash'
    ];

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
            stream: false,
            messages: [
              {
                role: 'user',
                content: 'Hello!'
              }
            ]
          })
        });

        console.log(`📡 状态: ${response.status}`);
        
        if (response.ok) {
          const responseText = await response.text();
          if (responseText.length > 0) {
            console.log(`✅ 模型 ${model} 成功! 响应长度: ${responseText.length}`);
            console.log(`📄 响应内容: ${responseText.substring(0, 200)}...`);
            return { model, success: true, response: responseText };
          } else {
            console.log(`⚠️ 模型 ${model} 返回空响应`);
          }
        } else {
          console.log(`❌ 模型 ${model} 失败: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ 模型 ${model} 异常: ${error.message}`);
      }
    }
    
    return { success: false };
  };

  // 测试 2: 尝试不同的端点格式
  const testDifferentEndpoints = async () => {
    console.log('\n🌐 测试不同的端点格式...');
    
    const endpoints = [
      'https://api.grsai.com/v1/chat/completions',
      'https://api.grsai.com/chat/completions',
      'https://api.grsai.com/v1/completions',
      'https://api.grsai.com/completions',
      'https://api.grsai.com/v1/generate',
      'https://api.grsai.com/generate'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 测试端点: ${endpoint}`);
        
        const response = await fetch(endpoint, {
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
                content: 'Hello!'
              }
            ]
          })
        });

        console.log(`📡 状态: ${response.status}`);
        
        if (response.ok) {
          const responseText = await response.text();
          if (responseText.length > 0) {
            console.log(`✅ 端点 ${endpoint} 成功! 响应长度: ${responseText.length}`);
            console.log(`📄 响应内容: ${responseText.substring(0, 200)}...`);
            return { endpoint, success: true, response: responseText };
          } else {
            console.log(`⚠️ 端点 ${endpoint} 返回空响应`);
          }
        } else {
          console.log(`❌ 端点 ${endpoint} 失败: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ 端点 ${endpoint} 异常: ${error.message}`);
      }
    }
    
    return { success: false };
  };

  // 测试 3: 尝试不同的认证方式
  const testDifferentAuth = async () => {
    console.log('\n🔐 测试不同的认证方式...');
    
    const authMethods = [
      {
        name: 'Bearer Token',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      },
      {
        name: 'API Key Header',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        }
      },
      {
        name: 'API Key + User ID',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'X-User-ID': '1758354953'
        }
      }
    ];

    for (const authMethod of authMethods) {
      try {
        console.log(`🔍 测试认证方式: ${authMethod.name}`);
        
        const response = await fetch('https://api.grsai.com/v1/chat/completions', {
          method: 'POST',
          headers: authMethod.headers,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: 'Hello!'
              }
            ]
          })
        });

        console.log(`📡 状态: ${response.status}`);
        
        if (response.ok) {
          const responseText = await response.text();
          if (responseText.length > 0) {
            console.log(`✅ 认证方式 ${authMethod.name} 成功! 响应长度: ${responseText.length}`);
            console.log(`📄 响应内容: ${responseText.substring(0, 200)}...`);
            return { authMethod: authMethod.name, success: true, response: responseText };
          } else {
            console.log(`⚠️ 认证方式 ${authMethod.name} 返回空响应`);
          }
        } else {
          console.log(`❌ 认证方式 ${authMethod.name} 失败: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ 认证方式 ${authMethod.name} 异常: ${error.message}`);
      }
    }
    
    return { success: false };
  };

  // 运行所有测试
  const modelResult = await testDifferentModels();
  const endpointResult = await testDifferentEndpoints();
  const authResult = await testDifferentAuth();

  console.log('\n📊 测试总结:');
  console.log(`模型测试: ${modelResult.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`端点测试: ${endpointResult.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`认证测试: ${authResult.success ? '✅ 成功' : '❌ 失败'}`);

  if (modelResult.success || endpointResult.success || authResult.success) {
    console.log('\n🎉 找到了可用的配置！');
    if (modelResult.success) {
      console.log(`💡 可用模型: ${modelResult.model}`);
    }
    if (endpointResult.success) {
      console.log(`💡 可用端点: ${endpointResult.endpoint}`);
    }
    if (authResult.success) {
      console.log(`💡 可用认证: ${authResult.authMethod}`);
    }
  } else {
    console.log('\n❌ 所有测试都失败了');
    console.log('💡 可能的原因:');
    console.log('1. API 密钥无效或已过期');
    console.log('2. 账户未激活或需要验证');
    console.log('3. API 服务暂时不可用');
    console.log('4. 需要联系 Grsai 技术支持');
  }
};

// 运行测试
testGrsaiAlternative();
