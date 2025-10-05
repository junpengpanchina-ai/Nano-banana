// 调试 Grsai API 响应
const testGrsaiDebug = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🔍 调试 Grsai API 响应...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  try {
    const response = await fetch('https://api.grsai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello! Can you help me generate an anime figure description?'
          }
        ]
      })
    });

    console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
    console.log(`📡 响应头:`, Object.fromEntries(response.headers.entries()));
    
    // 获取原始响应文本
    const responseText = await response.text();
    console.log(`📄 响应内容长度: ${responseText.length}`);
    console.log(`📄 响应内容前500字符: ${responseText.substring(0, 500)}`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ JSON 解析成功!');
        console.log('📊 响应数据:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log('❌ JSON 解析失败:', parseError.message);
        console.log('📄 完整响应内容:', responseText);
      }
    } else {
      console.log(`❌ API 调用失败: ${responseText}`);
    }
  } catch (error) {
    console.log(`❌ 请求异常: ${error.message}`);
  }
};

// 运行调试
testGrsaiDebug();
