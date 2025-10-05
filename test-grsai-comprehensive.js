// 全面测试 Grsai API 连接
const testGrsaiComprehensive = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  const userId = '1758354953';
  const username = 'bnana';
  
  console.log('🚀 开始全面测试 Grsai API...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`👤 Username: ${username}`);
  console.log('');

  // 测试不同的基础 URL 和端点组合
  const baseUrls = [
    'https://api.grsai.com',
    'https://grsai.com/api',
    'https://api.grsai.com/api',
    'https://grsai.com',
    'https://api.grsai.com/v1',
    'https://grsai.com/v1'
  ];

  const endpoints = [
    '/images/generations',
    '/v1/images/generations',
    '/api/v1/images/generations',
    '/generate',
    '/api/generate',
    '/v1/generate',
    '/text-to-image',
    '/api/text-to-image',
    '/v1/text-to-image',
    '/image/generate',
    '/api/image/generate',
    '/v1/image/generate'
  ];

  // 测试不同的认证方式
  const authMethods = [
    {
      name: 'Bearer Token',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'API Key Header',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'API Key + User ID',
      headers: {
        'X-API-Key': apiKey,
        'X-User-ID': userId,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Authorization + User ID',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
        'Content-Type': 'application/json'
      }
    }
  ];

  // 测试不同的请求体格式
  const requestBodies = [
    {
      name: 'OpenAI DALL-E 格式',
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: 'anime figure, 3d model, high quality, detailed, cute character',
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
        user: username
      })
    },
    {
      name: 'Stability AI 格式',
      body: JSON.stringify({
        text_prompts: [{
          text: 'anime figure, 3d model, high quality, detailed, cute character',
          weight: 1
        }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 20
      })
    },
    {
      name: '简化格式',
      body: JSON.stringify({
        prompt: 'anime figure, 3d model, high quality, detailed, cute character',
        size: '1024x1024'
      })
    },
    {
      name: 'Grsai 特定格式',
      body: JSON.stringify({
        model: 'gpt-image',
        prompt: 'anime figure, 3d model, high quality, detailed, cute character',
        width: 1024,
        height: 1024,
        quality: 'high',
        user: username
      })
    }
  ];

  let testCount = 0;
  let successCount = 0;

  for (const baseUrl of baseUrls) {
    for (const endpoint of endpoints) {
      for (const authMethod of authMethods) {
        for (const requestBody of requestBodies) {
          testCount++;
          const fullUrl = baseUrl + endpoint;
          
          try {
            console.log(`\n🔍 测试 ${testCount}: ${authMethod.name} + ${requestBody.name}`);
            console.log(`🌐 URL: ${fullUrl}`);
            
            const response = await fetch(fullUrl, {
              method: 'POST',
              headers: authMethod.headers,
              body: requestBody.body
            });

            console.log(`📡 状态: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log('✅ 成功!');
              console.log('📊 响应数据:', JSON.stringify(data, null, 2));
              
              if (data.data && data.data[0] && data.data[0].url) {
                console.log('🖼️ 图像URL:', data.data[0].url);
              } else if (data.url) {
                console.log('🖼️ 图像URL:', data.url);
              } else if (data.image_url) {
                console.log('🖼️ 图像URL:', data.image_url);
              } else if (data.result && data.result.url) {
                console.log('🖼️ 图像URL:', data.result.url);
              }
              
              successCount++;
              console.log(`\n🎉 找到可用的端点: ${fullUrl}`);
              console.log(`🔑 认证方式: ${authMethod.name}`);
              console.log(`📝 请求格式: ${requestBody.name}`);
              return; // 找到可用端点就退出
            } else {
              const errorText = await response.text();
              console.log(`❌ 失败: ${errorText.substring(0, 100)}...`);
            }

          } catch (error) {
            console.log(`❌ 异常: ${error.message}`);
          }
        }
      }
    }
  }
  
  console.log(`\n📊 测试总结:`);
  console.log(`总测试数: ${testCount}`);
  console.log(`成功数: ${successCount}`);
  console.log(`失败数: ${testCount - successCount}`);
  
  if (successCount === 0) {
    console.log('\n❌ 所有测试都失败了');
    console.log('💡 建议:');
    console.log('1. 检查 API 密钥是否正确');
    console.log('2. 确认账户是否已激活');
    console.log('3. 查看 Grsai 官方文档获取正确的端点');
    console.log('4. 联系 Grsai 技术支持');
  }
};

// 运行测试
testGrsaiComprehensive();
