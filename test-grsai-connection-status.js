// 测试 Grsai API 连接状态
const testGrsaiConnectionStatus = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🔍 测试 Grsai API 连接状态...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`⏰ 测试时间: ${new Date().toLocaleString()}`);
  console.log('');

  // 测试 1: 基础连接测试
  const testBasicConnection = async () => {
    console.log('📡 测试基础连接...');
    
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
              content: 'Hello, test connection'
            }
          ]
        })
      });

      console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
      console.log(`📊 响应头:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const responseText = await response.text();
        console.log(`📄 响应长度: ${responseText.length}`);
        
        if (responseText.length > 0) {
          try {
            const data = JSON.parse(responseText);
            console.log('✅ 连接成功!');
            console.log('📊 响应数据:', JSON.stringify(data, null, 2));
            return { success: true, data };
          } catch (parseError) {
            console.log('❌ JSON 解析失败:', parseError.message);
            console.log('📄 原始响应:', responseText);
            return { success: false, error: 'JSON解析失败' };
          }
        } else {
          console.log('⚠️ 返回空响应');
          return { success: false, error: '空响应' };
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ 连接失败: ${errorText}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ 连接异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试 2: 网络连接测试
  const testNetworkConnection = async () => {
    console.log('\n🌐 测试网络连接...');
    
    try {
      const response = await fetch('https://api.grsai.com', {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      console.log(`📊 基础连接状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ 基础网络连接正常');
        return { success: true };
      } else {
        console.log(`❌ 基础网络连接异常: ${response.status}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ 网络连接异常: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // 测试 3: API 端点可用性测试
  const testAPIEndpoints = async () => {
    console.log('\n🔗 测试 API 端点可用性...');
    
    const endpoints = [
      'https://api.grsai.com/v1/chat/completions',
      'https://api.grsai.com/v1/models',
      'https://api.grsai.com/v1/images/generations',
      'https://api.grsai.com/health',
      'https://api.grsai.com/status'
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 测试端点: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        console.log(`📊 状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log('✅ 端点可用');
          results.push({ endpoint, status: 'available', code: response.status });
        } else {
          console.log(`❌ 端点不可用: ${response.status}`);
          results.push({ endpoint, status: 'unavailable', code: response.status });
        }
      } catch (error) {
        console.log(`❌ 端点异常: ${error.message}`);
        results.push({ endpoint, status: 'error', error: error.message });
      }
    }
    
    return results;
  };

  // 测试 4: 认证测试
  const testAuthentication = async () => {
    console.log('\n🔐 测试认证...');
    
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

    const results = [];
    
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
                content: 'Test authentication'
              }
            ]
          })
        });

        console.log(`📊 状态: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log('✅ 认证成功');
          results.push({ method: authMethod.name, status: 'success', code: response.status });
        } else {
          console.log(`❌ 认证失败: ${response.status}`);
          results.push({ method: authMethod.name, status: 'failed', code: response.status });
        }
      } catch (error) {
        console.log(`❌ 认证异常: ${error.message}`);
        results.push({ method: authMethod.name, status: 'error', error: error.message });
      }
    }
    
    return results;
  };

  // 运行所有测试
  console.log('🚀 开始连接状态测试...\n');
  
  const basicResult = await testBasicConnection();
  const networkResult = await testNetworkConnection();
  const endpointResults = await testAPIEndpoints();
  const authResults = await testAuthentication();

  // 生成测试报告
  console.log('\n📊 连接状态测试报告');
  console.log('='.repeat(50));
  
  console.log('\n1. 基础连接测试:');
  console.log(`   状态: ${basicResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!basicResult.success) {
    console.log(`   错误: ${basicResult.error}`);
  }

  console.log('\n2. 网络连接测试:');
  console.log(`   状态: ${networkResult.success ? '✅ 成功' : '❌ 失败'}`);
  if (!networkResult.success) {
    console.log(`   错误: ${networkResult.error}`);
  }

  console.log('\n3. API 端点测试:');
  endpointResults.forEach(result => {
    const status = result.status === 'available' ? '✅' : '❌';
    console.log(`   ${result.endpoint}: ${status} ${result.status} (${result.code || 'N/A'})`);
  });

  console.log('\n4. 认证测试:');
  authResults.forEach(result => {
    const status = result.status === 'success' ? '✅' : '❌';
    console.log(`   ${result.method}: ${status} ${result.status} (${result.code || 'N/A'})`);
  });

  // 总结
  const overallSuccess = basicResult.success && networkResult.success;
  console.log('\n🎯 总体状态:');
  console.log(`   API 连接: ${overallSuccess ? '✅ 正常' : '❌ 异常'}`);
  
  if (overallSuccess) {
    console.log('💡 建议: API 连接正常，可以正常使用');
  } else {
    console.log('💡 建议:');
    console.log('   1. 检查 API 密钥是否正确');
    console.log('   2. 检查网络连接');
    console.log('   3. 联系 Grsai 技术支持');
    console.log('   4. 检查账户状态');
  }

  return {
    basic: basicResult,
    network: networkResult,
    endpoints: endpointResults,
    auth: authResults,
    overall: overallSuccess
  };
};

// 运行测试
testGrsaiConnectionStatus();
