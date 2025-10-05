// 测试 API 密钥状态
const testApiKeyStatus = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🔑 测试 API 密钥状态...');
  console.log(`API Key: ${apiKey}`);
  console.log('');

  try {
    // 测试图像生成 API
    console.log('🎨 测试图像生成...');
    
    const response = await fetch('https://grsai.dakka.com.cn/v1/draw/nano-banana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'nano-banana-fast',
        prompt: 'test anime figure, 1/7 scale, detailed, high quality',
        aspectRatio: '1:1',
        shutProgress: true
      })
    });

    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log(`📄 响应长度: ${responseText.length}`);
      
      // 解析 SSE 数据
      const lines = responseText.split('\n');
      const events = [];
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6);
            if (jsonStr.trim()) {
              const data = JSON.parse(jsonStr);
              events.push(data);
            }
          } catch (error) {
            // 忽略解析错误
          }
        }
      }
      
      console.log(`📊 解析到 ${events.length} 个事件`);
      
      // 显示进度
      for (const event of events) {
        console.log(`📈 进度: ${event.progress}% - 状态: ${event.status}`);
        if (event.results && event.results.length > 0) {
          console.log(`🖼️ 图像 URL: ${event.results[0].url}`);
        }
      }
      
      // 获取最终结果
      const finalEvent = events[events.length - 1];
      if (finalEvent && finalEvent.status === 'succeeded' && finalEvent.results && finalEvent.results.length > 0) {
        console.log('✅ API 密钥有效，图像生成成功！');
        console.log(`🖼️ 最终图像 URL: ${finalEvent.results[0].url}`);
        
        // 验证图像 URL
        try {
          const imageResponse = await fetch(finalEvent.results[0].url, { method: 'HEAD' });
          if (imageResponse.ok) {
            console.log('✅ 图像 URL 可访问');
            console.log(`📊 图像类型: ${imageResponse.headers.get('content-type')}`);
            console.log(`📊 图像大小: ${imageResponse.headers.get('content-length') ? (parseInt(imageResponse.headers.get('content-length')) / 1024).toFixed(2) + ' KB' : '未知'}`);
          } else {
            console.log(`⚠️ 图像 URL 不可访问: ${imageResponse.status}`);
          }
        } catch (imageError) {
          console.log(`⚠️ 图像验证失败: ${imageError.message}`);
        }
        
        return { success: true, imageUrl: finalEvent.results[0].url };
      } else {
        console.log('⚠️ 图像生成未完成或失败');
        return { success: false, error: '生成未完成' };
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ API 调用失败: ${errorText}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ 测试异常: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// 运行测试
testApiKeyStatus();
