// 测试Grsai API连接
const testGrsaiAPI = async () => {
  const apiKey = 'sk-5f1e0d1f16984f3e86704bbb532357f9';
  const userId = '1758354953';
  const username = 'bnana';
  
  // 尝试多个可能的端点
  const endpoints = [
    'https://api.grsai.com/v1/images/generations',
    'https://api.grsai.com/api/v1/images/generations',
    'https://api.grsai.com/images/generations',
    'https://api.grsai.com/generate',
    'https://api.grsai.com/api/generate',
    'https://grsai.com/api/v1/images/generations',
    'https://grsai.com/v1/images/generations'
  ];

  console.log('🚀 测试Grsai API连接...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 尝试端点: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: 'anime figure, 3d model, high quality, detailed, cute character',
          n: 1,
          size: '1024x1024',
          quality: 'hd',
          style: 'vivid',
          user: username
        }),
      });

      console.log(`📡 响应状态: ${response.status}`);
      console.log(`📡 响应头:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API连接成功!');
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
        console.log(`❌ 端点失败: ${response.status} - ${errorText}`);
      }

    } catch (error) {
      console.log(`❌ 端点异常: ${error.message}`);
    }
  }
  
  console.log('\n❌ 所有端点都失败了');
};

// 运行测试
testGrsaiAPI();

