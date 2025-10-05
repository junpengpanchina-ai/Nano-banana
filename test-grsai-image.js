// 测试 Grsai API 图像生成功能
const testGrsaiImage = async () => {
  const apiKey = 'sk-bd625bca604243989a7018a67614c889';
  
  console.log('🖼️ 测试 Grsai API 图像生成功能...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log('');

  // 测试不同的图像生成端点和格式
  const testImageGeneration = async () => {
    console.log('🎨 测试图像生成...');
    
    // 尝试不同的端点
    const endpoints = [
      'https://api.grsai.com/v1/images/generations',
      'https://api.grsai.com/v1/image/generations',
      'https://api.grsai.com/v1/generate/image',
      'https://api.grsai.com/v1/flux/generate',
      'https://api.grsai.com/v1/flux/image',
      'https://api.grsai.com/v1/flux',
      'https://api.grsai.com/flux/generate',
      'https://api.grsai.com/generate'
    ];

    // 尝试不同的请求格式
    const requestFormats = [
      {
        name: 'OpenAI DALL-E 格式',
        body: {
          model: 'dall-e-3',
          prompt: 'anime figure, 3d model, high quality, detailed, cute character',
          n: 1,
          size: '1024x1024',
          quality: 'hd',
          style: 'vivid'
        }
      },
      {
        name: 'Flux 格式',
        body: {
          model: 'flux-kontext-pro',
          prompt: 'anime figure, 3d model, high quality, detailed, cute character',
          width: 1024,
          height: 1024,
          quality: 'high'
        }
      },
      {
        name: '简化格式',
        body: {
          prompt: 'anime figure, 3d model, high quality, detailed, cute character',
          size: '1024x1024'
        }
      },
      {
        name: 'Grsai 特定格式',
        body: {
          model: 'flux-kontext-pro',
          text: 'anime figure, 3d model, high quality, detailed, cute character',
          width: 1024,
          height: 1024
        }
      }
    ];

    for (const endpoint of endpoints) {
      for (const format of requestFormats) {
        try {
          console.log(`🔍 测试: ${endpoint} + ${format.name}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(format.body)
          });

          console.log(`📡 状态: ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const responseText = await response.text();
            if (responseText.length > 0) {
              console.log(`✅ 成功! 响应长度: ${responseText.length}`);
              console.log(`📄 响应内容: ${responseText.substring(0, 300)}...`);
              
              try {
                const data = JSON.parse(responseText);
                console.log('📊 解析后的数据:', JSON.stringify(data, null, 2));
                
                // 查找图像 URL
                if (data.data && data.data[0] && data.data[0].url) {
                  console.log(`🖼️ 图像URL: ${data.data[0].url}`);
                } else if (data.url) {
                  console.log(`🖼️ 图像URL: ${data.url}`);
                } else if (data.image_url) {
                  console.log(`🖼️ 图像URL: ${data.image_url}`);
                } else if (data.result && data.result.url) {
                  console.log(`🖼️ 图像URL: ${data.result.url}`);
                }
                
                return { endpoint, format: format.name, success: true, data };
              } catch (parseError) {
                console.log('❌ JSON 解析失败:', parseError.message);
                console.log('📄 原始响应:', responseText);
              }
            } else {
              console.log(`⚠️ 返回空响应`);
            }
          } else {
            const errorText = await response.text();
            console.log(`❌ 失败: ${errorText.substring(0, 200)}...`);
          }
        } catch (error) {
          console.log(`❌ 异常: ${error.message}`);
        }
      }
    }
    
    return { success: false };
  };

  // 测试通过 Chat API 生成图像描述
  const testImageDescription = async () => {
    console.log('\n📝 通过 Chat API 生成图像描述...');
    
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
              role: 'system',
              content: 'You are an expert at describing anime figures for 3D modeling. Generate detailed, specific descriptions that would help create high-quality anime figure models.'
            },
            {
              role: 'user',
              content: 'Please generate a detailed description for an anime figure of a cute magical girl character, suitable for 3D modeling and figure creation.'
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Chat API 调用成功!');
        console.log('📝 生成的描述:', data.choices[0].message.content);
        return { success: true, description: data.choices[0].message.content };
      } else {
        console.log(`❌ Chat API 失败: ${response.status}`);
        return { success: false };
      }
    } catch (error) {
      console.log(`❌ Chat API 异常: ${error.message}`);
      return { success: false };
    }
  };

  // 运行测试
  const imageResult = await testImageGeneration();
  const descriptionResult = await testImageDescription();

  console.log('\n📊 测试总结:');
  console.log(`图像生成: ${imageResult.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`描述生成: ${descriptionResult.success ? '✅ 成功' : '❌ 失败'}`);

  if (imageResult.success) {
    console.log('\n🎉 图像生成功能可用！');
    console.log(`💡 可用端点: ${imageResult.endpoint}`);
    console.log(`💡 可用格式: ${imageResult.format}`);
  } else if (descriptionResult.success) {
    console.log('\n💡 虽然直接图像生成不可用，但可以通过 Chat API 生成图像描述');
    console.log('📝 这可以用于后续的图像生成或作为提示词');
  } else {
    console.log('\n❌ 图像生成功能不可用');
    console.log('💡 建议:');
    console.log('1. 联系 Grsai 技术支持了解图像生成 API');
    console.log('2. 使用 Chat API 生成图像描述作为替代方案');
    console.log('3. 集成其他图像生成服务作为备用');
  }
};

// 运行测试
testGrsaiImage();
