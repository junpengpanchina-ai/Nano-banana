// 简单测试 Grsai API 功能
const testGrsaiSimple = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🧪 简单测试 Grsai API 功能...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  try {
    // 测试一个简单的图像生成请求
    console.log('🎨 测试图像生成...');
    
    const response = await fetch('https://api.grsai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at generating anime figure images. When asked to generate an image, create a detailed description and generate the actual image with URL. Always include the image URL in your response.'
          },
          {
            role: 'user',
            content: 'Generate an anime figure image of a cute magical girl character, suitable for 3D modeling.'
          }
        ]
      })
    });

    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log(`📄 响应长度: ${responseText.length}`);
      
      if (responseText.length > 0) {
        try {
          const data = JSON.parse(responseText);
          const content = data.choices[0].message.content;
          console.log('✅ API 调用成功!');
          console.log(`📝 响应内容长度: ${content.length}`);
          
          // 查找图像 URL
          const imageUrlMatch = content.match(/https:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp)/i);
          if (imageUrlMatch) {
            const imageUrl = imageUrlMatch[0];
            console.log(`🖼️ 找到图像 URL: ${imageUrl}`);
            
            // 验证图像
            try {
              const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
              if (imageResponse.ok) {
                console.log('✅ 图像可访问');
                console.log(`📊 图像类型: ${imageResponse.headers.get('content-type')}`);
                console.log(`📊 图像大小: ${imageResponse.headers.get('content-length') ? (parseInt(imageResponse.headers.get('content-length')) / 1024).toFixed(2) + ' KB' : '未知'}`);
              } else {
                console.log(`⚠️ 图像不可访问: ${imageResponse.status}`);
              }
            } catch (imageError) {
              console.log(`⚠️ 图像验证失败: ${imageError.message}`);
            }
          } else {
            console.log('📝 生成了描述但没有图像 URL');
            console.log(`📄 描述内容: ${content.substring(0, 200)}...`);
          }
          
          console.log('\n🎉 测试成功！Grsai API 功能正常');
          return true;
        } catch (parseError) {
          console.log('❌ JSON 解析失败:', parseError.message);
          console.log('📄 原始响应:', responseText.substring(0, 200));
          return false;
        }
      } else {
        console.log('❌ 返回空响应');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ API 调用失败: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 测试异常: ${error.message}`);
    return false;
  }
};

// 运行测试
testGrsaiSimple();
