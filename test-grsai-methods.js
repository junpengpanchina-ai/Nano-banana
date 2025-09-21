// 测试Grsai API的不同HTTP方法和格式
const testGrsaiMethods = async () => {
  const apiKey = 'sk-5f1e0d1f16984f3e86704bbb532357f9';
  const userId = '1758354953';
  const username = 'bnana';
  
  const baseUrl = 'https://api.grsai.com';
  
  // 测试不同的端点和方法组合
  const testCases = [
    // GET请求测试
    {
      method: 'GET',
      url: `${baseUrl}/v1/images/generations`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
      },
      body: null
    },
    {
      method: 'GET',
      url: `${baseUrl}/api/v1/images/generations`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
      },
      body: null
    },
    // POST请求测试 - 不同的数据格式
    {
      method: 'POST',
      url: `${baseUrl}/v1/images/generations`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
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
    // 表单数据格式
    {
      method: 'POST',
      url: `${baseUrl}/v1/images/generations`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
      },
      body: new URLSearchParams({
        model: 'dall-e-3',
        prompt: 'anime figure, 3d model, high quality, detailed, cute character',
        n: '1',
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
        user: username
      })
    },
    // 查询参数格式
    {
      method: 'GET',
      url: `${baseUrl}/v1/images/generations?model=dall-e-3&prompt=anime+figure&n=1&size=1024x1024&quality=hd&style=vivid&user=${username}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-User-ID': userId,
      },
      body: null
    },
    // 尝试不同的认证方式
    {
      method: 'POST',
      url: `${baseUrl}/v1/images/generations`,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: 'anime figure, 3d model, high quality, detailed, cute character',
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
        user: username
      })
    }
  ];

  console.log('🚀 测试Grsai API的不同方法和格式...');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      console.log(`\n🔍 测试 ${i + 1}: ${testCase.method} ${testCase.url}`);
      console.log(`📋 请求头:`, testCase.headers);
      
      const response = await fetch(testCase.url, {
        method: testCase.method,
        headers: testCase.headers,
        body: testCase.body
      });

      console.log(`📡 响应状态: ${response.status}`);
      console.log(`📡 响应头:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 成功!');
        console.log('📊 响应数据:', JSON.stringify(data, null, 2));
        
        if (data.data && data.data[0]) {
          console.log('🖼️ 生成的图像URL:', data.data[0].url);
        } else if (data.url) {
          console.log('🖼️ 生成的图像URL:', data.url);
        } else if (data.image_url) {
          console.log('🖼️ 生成的图像URL:', data.image_url);
        }
        return; // 成功就退出
      } else {
        const errorText = await response.text();
        console.log(`❌ 失败: ${response.status} - ${errorText.substring(0, 200)}`);
      }

    } catch (error) {
      console.log(`❌ 异常: ${error.message}`);
    }
  }
  
  console.log('\n❌ 所有测试都失败了');
};

// 运行测试
testGrsaiMethods();


